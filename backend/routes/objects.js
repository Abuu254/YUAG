const express = require('express');
const router = express.Router();
const { Object, Agent, Nationality, Department, Classifier, Place } = require('../models');
const { formatDate } = require('../utils/dateUtils');
const { limit, imageUrlPrefix } = require('../utils/config');

// Get all objects
router.get('/objects', async (req, res) => {
  const { page = 1, limit = 18, query = '', criteria = 'all' } = req.query;
  // console.log(req.query);

  try {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    // Count the distinct objects
    const totalObjects = await Object.count();

    const rows = await Object.findAll({
      attributes: ['id', 'label', 'accession_no', 'date'],
      include: [{
        model: Agent,
        attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
        through: {
          attributes: ['part'], // Include the `part` attribute from the junction table
        },
        include: [
          {
            model: Nationality,
            attributes: ['descriptor'],
            through: { attributes: [] }, // Exclude the junction table
          },
        ],
      }],
      offset: offset,
      limit: parsedLimit,
    });

    // Generate image URLs and format agent data
    const objectsWithImageAndArtists = rows.map(object => {
      const artists = object.Agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        type: agent.type,
        begin_date: formatDate(agent.begin_date, agent.begin_date_is_bce),
        end_date: formatDate(agent.end_date, agent.end_date_is_bce),
        nationalities: agent.Nationalities.map(nat => nat.descriptor),
        part: agent.Production.part,
      }));

      return {
        ...object.dataValues,
        imageUrl: `${imageUrlPrefix}${object.id}`,
        artists,
      };
    });
    res.json({ total: totalObjects, data: objectsWithImageAndArtists });
  } catch (error) {
    console.error('Error fetching objects:', error);
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
          attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
          through: {
            attributes: ['part'],
          },
          include: [
            {
              model: Nationality,
              attributes: ['descriptor'],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Department,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Classifier,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Place,
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
    console.error('Error fetching object:', error);
    res.status(500).json({ error: 'Failed to fetch object' });
  }
});

// Get unique department names
router.get('/departments/names', async (req, res) => {
  try {
    const departments = await Place.findAll({
      attributes: ['part_of'],
      group: ['part_of'],
    });

    const departmentNames = departments.map(department => department.part_of);
    res.json(departmentNames);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});


// Get artworks by department name with pagination
router.get('/departments/:name/objects', async (req, res) => {
  const encodedDepartmentName = req.params.name;
  const departmentName = decodeURIComponent(encodedDepartmentName);
  const { page = 1, limit = 18, query = '', criteria = 'all' } = req.query;

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

    // Find objects with pagination
    const { count, rows } = await Object.findAndCountAll({
      attributes: ['id', 'label', 'accession_no', 'date'],
      include: [
        {
          model: Department,
          where: { id: department.id },
          attributes: [],
        },
      ],
      offset: offset,
      limit: parsedLimit,
    });

    // Include nested associations for each object
    const objectsWithDetails = await Promise.all(
      rows.map(async (object) => {
        const objectWithDetails = await Object.findByPk(object.id, {
          include: [
            {
              model: Agent,
              attributes: ['id', 'name', 'type', 'begin_date', 'begin_bce', 'end_date', 'end_bce'],
              through: { attributes: ['part'] },
              include: [
                {
                  model: Nationality,
                  attributes: ['descriptor'],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        });

        const artists = objectWithDetails.Agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          type: agent.type,
          begin_date: formatDate(agent.begin_date, agent.begin_date_is_bce),
          end_date: formatDate(agent.end_date, agent.end_date_is_bce),
          nationalities: agent.Nationalities.map(nat => nat.descriptor),
          part: agent.Production.part,
        }));

        return {
          ...object.dataValues,
          imageUrl: `${imageUrlPrefix}${object.id}`,
          artists,
        };
      })
    );

    res.json({ total: count, data: objectsWithDetails });
  } catch (error) {
    console.error('Error fetching objects by department:', error);
    res.status(500).json({ error: 'Failed to fetch objects by department' });
  }
});

module.exports = router;