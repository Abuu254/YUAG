const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Object, Agent, Nationality, Department, Classifier, Place, Production} = require('../models');
const { formatDate } = require('../utils/dateUtils');
const { imageUrlPrefix } = require('../utils/config');
const { logToFile } = require("../log");

router.get('/objects', async (req, res) => {
    const { page = 1, limit = 18, query = '', criteria = 'title' } = req.query;

    try {
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const offset = (parsedPage - 1) * parsedLimit;

        // Define the base query options
        const queryOptions = {
            where: {},
            attributes: ['id', 'label', 'accession_no', 'date'],
            include: [
                {
                    model: Agent,
                    as: 'Agents',
                    attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
                    through: { attributes: ['part'] },
                    include: [
                        {
                            model: Nationality,
                            as: 'Nationalities',
                            attributes: ['descriptor'],
                            through: { attributes: [] },
                        },
                    ],
                    required: false, // Ensures the agent details are always included
                }
            ],
            offset,
            limit: parsedLimit,
            distinct: true,
        };

        // Conditionally add where clauses based on search criteria
        if (query) {
            if (criteria === 'title') {
                queryOptions.where = {
                    label: {
                        [Op.like]: `%${query}%`,
                    },
                };
            } else if (criteria === 'artist') {
                queryOptions.include[0].where = {
                    name: {
                        [Op.like]: `%${query}%`,
                    },
                };
                queryOptions.include[0].required = true; // Now we require matching agents
            } else if (criteria === 'place') {
                queryOptions.include.push({
                    model: Place,
                    as: 'Places',
                    attributes: ['label', 'part_of'],
                    through: { attributes: [] },
                    where: {
                        [Op.or]: [
                            { label: { [Op.like]: `%${query}%` } },
                            { part_of: { [Op.like]: `%${query}%` } },
                        ],
                    },
                    required: true, // Matching places required
                });
            } else if (criteria === 'classifier') {
                queryOptions.include.push({
                    model: Classifier,
                    as: 'Classifiers',
                    attributes: ['name'],
                    through: { attributes: [] },
                    where: {
                        name: {
                            [Op.like]: `%${query}%`,
                        },
                    },
                    required: true, // Matching classifiers required
                });
            }
        }

        // Execute the query and count distinct objects
        const { count, rows } = await Object.findAndCountAll(queryOptions);

        // Generate image URLs and format agent data
        const objectsWithDetails = rows.map(object => {
            const artists = object.Agents?.map(agent => ({
                id: agent.id,
                name: agent.name,
                type: agent.type,
                begin_date: formatDate(agent.begin_date, agent.begin_date_is_bce),
                end_date: formatDate(agent.end_date, agent.end_date_is_bce),
                nationalities: agent.Nationalities.map(nat => nat.descriptor),
                part: agent.Production?.part || null,
            })) || [];

            return {
                ...object.dataValues,
                imageUrl: `${imageUrlPrefix}${object.id}`,
                artists,
            };
        });

        res.json({ total: count, data: objectsWithDetails });
    } catch (error) {
        logToFile('An error occurred', error);
        res.status(500).json({ error: 'Failed to fetch objects' });
    }
});

// Get detailed data for a specific object
router.get('/objects/:id', async (req, res) => {
    try {
        const object = await Object.findByPk(req.params.id, {
            include: [
                {
                    model: Agent,
                    as: 'Agents',
                    attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
                    through: {
                        attributes: ['part'],
                    },
                    include: [
                        {
                            model: Nationality,
                            as: 'Nationalities',
                            attributes: ['descriptor'],
                            through: { attributes: [] },
                        },
                    ],
                },
                {
                    model: Department,
                    as: 'Departments',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Classifier,
                    as: 'Classifiers',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: Place,
                    as: 'Places',
                    attributes: ['id', 'label', 'longitude', 'latitude', 'url'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!object) {
            return res.status(404).json({ error: 'Object not found' });
        }

        const artists = object.Agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            type: agent.type,
            begin_date: formatDate(agent.begin_date, agent.begin_date_is_bce),
            end_date: formatDate(agent.end_date, agent.end_date_is_bce),
            nationalities: agent.Nationalities.map(nat => nat.descriptor),
            part: agent.Production.part,
        }));

        const departments = object.Departments.map(department => ({
            id: department.id,
            name: department.name,
        }));

        const classifiers = object.Classifiers.map(classifier => ({
            id: classifier.id,
            name: classifier.name,
        }));

        const places = object.Places.map(place => ({
            id: place.id,
            label: place.label,
            longitude: place.longitude,
            latitude: place.latitude,
            url: place.url,
        }));

        const detailedObject = {
            id: object.id,
            label: object.label,
            accession_no: object.accession_no,
            date: object.date,
            imageUrl: `${imageUrlPrefix}${object.id}`,
            artists,
            departments,
            classifiers,
            places,
        };
        res.json(detailedObject);
    } catch (error) {
        logToFile('An error occurred', error);
        res.status(500).json({ error: 'Failed to fetch object' });
    }
});

// Get artworks by department name with pagination and search
router.get('/departments/:name/objects', async (req, res) => {
    const encodedDepartmentName = req.params.name;
    const departmentName = decodeURIComponent(encodedDepartmentName);
    const { page = 1, limit = 18, query = '', criteria = 'title' } = req.query;

    try {
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const offset = (parsedPage - 1) * parsedLimit;

        // Find the department
        const department = await Department.findOne({
            where: { name: departmentName },
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Define the base query options
        const queryOptions = {
            where: {},
            attributes: ['id', 'label', 'accession_no', 'date'],
            include: [
                {
                    model: Department,
                    as: 'Departments',
                    where: { id: department.id },
                    attributes: [],
                },
                {
                    model: Agent,
                    as: 'Agents',
                    attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
                    through: { attributes: ['part'] },
                    include: [
                        {
                            model: Nationality,
                            as: 'Nationalities',
                            attributes: ['descriptor'],
                            through: { attributes: [] },
                        },
                    ],
                    required: false, // Ensures the agent details are always included
                }
            ],
            offset,
            limit: parsedLimit,
            distinct: true,
        };

        // Conditionally add where clauses based on search criteria
        if (query) {
            if (criteria === 'title') {
                queryOptions.where = {
                    label: {
                        [Op.like]: `%${query}%`,
                    },
                };
            } else if (criteria === 'artist') {
                queryOptions.include[1].where = {
                    name: {
                        [Op.like]: `%${query}%`,
                    },
                };
                queryOptions.include[1].required = true; // Now we require matching agents
            } else if (criteria === 'place') {
                queryOptions.include.push({
                    model: Place,
                    as: 'Places',
                    attributes: ['label', 'part_of'],
                    through: { attributes: [] },
                    where: {
                        [Op.or]: [
                            { label: { [Op.like]: `%${query}%` } },
                            { part_of: { [Op.like]: `%${query}%` } },
                        ],
                    },
                    required: true, // Matching places required
                });
            } else if (criteria === 'classifier') {
                queryOptions.include.push({
                    model: Classifier,
                    as: 'Classifiers',
                    attributes: ['name'],
                    through: { attributes: [] },
                    where: {
                        name: {
                            [Op.like]: `%${query}%`,
                        },
                    },
                    required: true, // Matching classifiers required
                });
            }
        }

        // Execute the query and count distinct objects
        const { count, rows } = await Object.findAndCountAll(queryOptions);

        // Generate image URLs and format agent data
        const objectsWithDetails = rows.map(object => {
            const artists = object.Agents?.map(agent => ({
                id: agent.id,
                name: agent.name,
                type: agent.type,
                begin_date: formatDate(agent.begin_date, agent.begin_date_is_bce),
                end_date: formatDate(agent.end_date, agent.end_date_is_bce),
                nationalities: agent.Nationalities.map(nat => nat.descriptor),
                part: agent.Production?.part || null,
            })) || [];

            return {
                ...object.dataValues,
                imageUrl: `${imageUrlPrefix}${object.id}`,
                artists,
            };
        });

        res.json({ total: count, data: objectsWithDetails });
    } catch (error) {
        logToFile('An error occurred', error);
        res.status(500).json({ error: 'Failed to fetch objects by department' });
    }
});


module.exports = router;