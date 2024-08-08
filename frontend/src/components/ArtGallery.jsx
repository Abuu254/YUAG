import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { LIMIT } from "../util/variables.js";

function ArtGallery({ searchQuery, searchCriteria, onCardClick, onTotalResults }) {
    const { name } = useParams();  // Get the department name from the URL
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            const encodedQuery = searchQuery ? encodeURIComponent(searchQuery) : '';
            const criteria = Object.keys(searchCriteria)
            .filter(key => searchCriteria[key])
            .join(',');
            const url = name
            ? `${baseUrl}/departments/${encodeURIComponent(name)}/objects?query=${encodedQuery}&criteria=${criteria}&page=${page}&limit=${LIMIT}`
            : `${baseUrl}/objects?query=${encodedQuery}&criteria=${criteria}&page=${page}&limit=${LIMIT}`;

            console.log("url", url);
            try {
                const response = await fetch(url);
                const results = await response.json();
                setObjects(results.data);
                setTotalPages(Math.ceil(results.total / LIMIT));
                onTotalResults(results.total);
                setLoading(false);
            } catch (error) {
                console.error('Error Fetching Objects:', error);
                setLoading(false);
            }
        };
        // Only fetch data if it's the initial load or if there's a search query
        if (initialLoad || searchQuery) {
            setLoading(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchData();
            setInitialLoad(false); // Set initialLoad to false after the first fetch
        }
    }, [page, name, searchQuery, searchCriteria]);

    const handlePageClick = (event, value = number) => {
        setPage(value);
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
                    <Pagination count={totalPages} color="primary" showFirstButton showLastButton size="large" onChange={handlePageClick} />
                </Stack>
            </div>
        </>
    );
}

export default ArtGallery;