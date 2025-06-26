import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import ArtCard from "./ArtCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ErrorPage from "./error/ErrorPage.jsx";
import NoResults from "./error/NoResults.jsx";
import { LIMIT } from "../util/variables.js";

// Debounce hook for search optimization
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Custom hook for data fetching with caching
const useArtData = (baseUrl, name, searchQuery, searchCriteria, page, limit) => {
    const [state, setState] = useState({
        objects: [],
        loading: true,
        error: false,
        totalPages: 1,
        total: 0
    });

    const cache = useRef(new Map());
    const abortController = useRef(null);

    const fetchData = useCallback(async () => {
        // Cancel previous request if still pending
        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = new AbortController();

        const encodedQuery = searchQuery ? encodeURIComponent(searchQuery) : '';
        const criteria = Object.keys(searchCriteria)
            .filter(key => searchCriteria[key])
            .join(',');

        const url = name
            ? `${baseUrl}/departments/${encodeURIComponent(name)}/objects?query=${encodedQuery}&criteria=${criteria}&page=${page}&limit=${limit}`
            : `${baseUrl}/objects?query=${encodedQuery}&criteria=${criteria}&page=${page}&limit=${limit}`;

        // Check cache first
        const cacheKey = `${url}-${page}`;
        if (cache.current.has(cacheKey)) {
            const cachedData = cache.current.get(cacheKey);
            setState(prev => ({ ...prev, ...cachedData, loading: false }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: false }));

        try {
            const response = await fetch(url, {
                signal: abortController.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = await response.json();

            const newState = {
                objects: results.data || [],
                totalPages: Math.ceil((results.total || 0) / limit),
                total: results.total || 0,
                loading: false,
                error: false
            };

            // Cache the result
            cache.current.set(cacheKey, newState);

            // Limit cache size to prevent memory leaks
            if (cache.current.size > 50) {
                const firstKey = cache.current.keys().next().value;
                cache.current.delete(firstKey);
            }

            setState(newState);
        } catch (error) {
            if (error.name === 'AbortError') {
                return; // Request was cancelled
            }
            console.error('Fetch error:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: true
            }));
        }
    }, [baseUrl, name, searchQuery, searchCriteria, page, limit]);

    useEffect(() => {
        fetchData();

        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, [fetchData]);

    return state;
};

function ArtGallery({ searchQuery, searchCriteria, onCardClick, onTotalResults, onPreload }) {
    const { name } = useParams();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [page, setPage] = useState(1);

    // Debounce search query to reduce API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Memoize effective criteria to prevent unnecessary re-renders
    const effectiveCriteria = useMemo(() => {
        return Object.values(searchCriteria).some(value => value)
            ? searchCriteria
            : { title: true };
    }, [searchCriteria]);

    // Use custom hook for data fetching
    const { objects, loading, error, totalPages, total } = useArtData(
        baseUrl,
        name,
        debouncedSearchQuery,
        effectiveCriteria,
        page,
        LIMIT
    );

    // Memoize skeleton cards to prevent unnecessary re-renders
    const skeletonCards = useMemo(() => {
        return Array(LIMIT).fill().map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
        ));
    }, []);

    // Memoize art cards to prevent unnecessary re-renders
    const artCards = useMemo(() => {
        return objects.map(object => (
            <ArtCard
                key={object.id}
                id={object.id}
                label={object.label}
                artists={object.artists}
                imageUrl={object.imageUrl}
                onClick={onCardClick}
                onPreload={onPreload}
            />
        ));
    }, [objects, onCardClick, onPreload]);

    // Reset page when search changes
    useEffect(() => {
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [debouncedSearchQuery, effectiveCriteria, name]);

    // Update total results
    useEffect(() => {
        onTotalResults(total);
    }, [total, onTotalResults]);

    // Memoize pagination component
    const paginationComponent = useMemo(() => {
        if (objects.length === 0) return null;

        return (
            <div className="pagination">
                <Stack spacing={2}>
                    <Pagination
                        count={totalPages}
                        color="primary"
                        showFirstButton
                        showLastButton
                        size="large"
                        onChange={(event, value) => setPage(value)}
                        page={page}
                    />
                </Stack>
            </div>
        );
    }, [objects.length, totalPages, page]);

    // Memoize the main content to prevent unnecessary re-renders
    const mainContent = useMemo(() => {
        if (objects.length === 0 && !loading) {
            return <NoResults query={debouncedSearchQuery} />;
        }

        return (
            <>
                <div className="art-gallery">
                    {loading ? skeletonCards : artCards}
                </div>
                {paginationComponent}
            </>
        );
    }, [objects.length, loading, debouncedSearchQuery, skeletonCards, artCards, paginationComponent]);

    if (error) {
        return <ErrorPage />;
    }

    return mainContent;
}

export default ArtGallery;
