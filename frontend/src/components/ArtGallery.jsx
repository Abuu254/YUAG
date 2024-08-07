import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { LIMIT } from "../util/variables.js";

function ArtGallery({ onCardClick }) {
    const { name } = useParams();  // Get the department name from the URL
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            const encodedName = encodeURIComponent(name);
            console.log("encoded: ", encodedName);
            const url = name ? `${baseUrl}/departments/${encodedName}/objects?` : `${baseUrl}/objects?page=${page}&limit=${LIMIT}`;
            console.log("url", url);
            try {
                const response = await fetch(`${url}&page=${page}&limit=${LIMIT}`);
                const results = await response.json();
                setObjects(results.data);
                setTotalPages(Math.ceil(results.total / LIMIT));
                setLoading(false);
            } catch (error) {
                console.error('Error Fetching Objects:', error);
                setLoading(false);
            }
        };
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchData();
    }, [page, name]);

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