import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { LIMIT } from "../util/variables.js";
import logToFile from "../../log.js";

function ArtGallery({ searchQuery, searchCriteria, onCardClick, onTotalResults }) {
    const { name } = useParams();  // Get the department name from the URL
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);

    const fetchData = async (currentPage) => {
        const encodedQuery = searchQuery ? encodeURIComponent(searchQuery) : '';
        const criteria = Object.keys(searchCriteria)
            .filter(key => searchCriteria[key])
            .join(',');
        const url = name
            ? `${baseUrl}/departments/${encodeURIComponent(name)}/objects?query=${encodedQuery}&criteria=${criteria}&page=${currentPage}&limit=${LIMIT}`
            : `${baseUrl}/objects?query=${encodedQuery}&criteria=${criteria}&page=${currentPage}&limit=${LIMIT}`;

        try {
            const response = await fetch(url);
            const results = await response.json();
            setObjects(results.data);
            setTotalPages(Math.ceil(results.total / LIMIT));
            onTotalResults(results.total);
            setLoading(false);
        } catch (error) {
            logToFile('An error occurred', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Reset page number to 1 when searchQuery, searchCriteria, or name changes
        setPage(1);
        setInitialLoad(true);
    }, [searchQuery, searchCriteria, name]);

    useEffect(() => {
        if (initialLoad) {
            setLoading(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchData(1); // Always fetch page 1 when resetting
            setInitialLoad(false);
        } else {
            fetchData(page);
        }
    }, [page, initialLoad]);

    const handlePageClick = (event, value) => {
        setPage(value);
        setInitialLoad(false); // Ensure the next fetch is for the selected page
    };

    return (
        <>
            <div className="art-gallery">
                {loading ? (
                    Array(LIMIT).fill().map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    objects.map(object => (
                        <ArtCard
                            key={object.id}
                            id={object.id}
                            label={object.label}
                            artists={object.artists}
                            imageUrl={object.imageUrl}
                            onClick={() => onCardClick(object.id)}
                        />
                    ))
                )}
            </div>
            <div className="pagination">
                <Stack spacing={2}>
                    <Pagination count={totalPages} color="primary" showFirstButton showLastButton size="large" onChange={handlePageClick} page={page} />
                </Stack>
            </div>
        </>
    );
}

export default ArtGallery;
