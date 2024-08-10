import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ErrorPage from "./error/ErrorPage.jsx";
import NoResults from "./error/NoResults.jsx";
import { LIMIT } from "../util/variables.js";
import logToFile from "../../log.js";

function ArtGallery({ searchQuery, searchCriteria, onCardClick, onTotalResults }) {
    const { name } = useParams();  // Get the department name from the URL
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);
    const [previousQuery, setPreviousQuery] = useState('');
    const [previousCriteria, setPreviousCriteria] = useState(searchCriteria);

    const effectiveCriteria = Object.values(searchCriteria).some(value => value)
        ? searchCriteria
        : { all: true };


    const fetchData = async (currentPage) => {
        const encodedQuery = searchQuery ? encodeURIComponent(searchQuery) : '';
        const criteria = Object.keys(effectiveCriteria)
            .filter(key => effectiveCriteria[key])
            .join(',');
        const url = name
            ? `${baseUrl}/departments/${encodeURIComponent(name)}/objects?query=${encodedQuery}&criteria=${criteria}&page=${currentPage}&limit=${LIMIT}`
            : `${baseUrl}/objects?query=${encodedQuery}&criteria=${criteria}&page=${currentPage}&limit=${LIMIT}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const results = await response.json();

            if (results.total === 0) {
                setObjects([]);
                setTotalPages(1);
            } else {
                setObjects(results.data);
                setTotalPages(Math.ceil(results.total / LIMIT));
            }
            onTotalResults(results.total);
            setLoading(false);
            setPreviousQuery(searchQuery);
            setPreviousCriteria(effectiveCriteria);
        } catch (error) {
            logToFile('An error occurred', error);
            setError(true);
            setLoading(false);
            setInitialLoad(true);
        }
    };

    useEffect(() => {
        const criteriaChanged = JSON.stringify(effectiveCriteria) !== JSON.stringify(previousCriteria);
        const queryChanged = searchQuery !== previousQuery;

        if (initialLoad || queryChanged || (criteriaChanged && searchQuery.trim() !== '')) {
            setLoading(true);
            fetchData(1); // Always fetch page 1 on criteria or query change
            setInitialLoad(false);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [searchQuery, effectiveCriteria, name]);

    useEffect(() => {
        if (page !== 1 && (searchQuery.trim() !== '' || initialLoad)) {
            fetchData(page);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    const handlePageClick = (event, value) => {
        setPage(value);
        setInitialLoad(false); // Ensure the next fetch is for the selected page
    };
    return (
        <>
            {error ? (
                <ErrorPage />
            ) : (
                <>
                    {objects === null ? (
                        <NoResults query={searchQuery} />  // Display NoResults page if no data found
                    ) : (
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
                            {objects.length > 0 && (
                                <div className="pagination">
                                    <Stack spacing={2}>
                                        <Pagination count={totalPages} color="primary" showFirstButton showLastButton size="large" onChange={handlePageClick} page={page} />
                                    </Stack>
                                </div>

                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

export default ArtGallery;
