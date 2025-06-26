import { useState, useCallback, useRef, useEffect } from 'react';

// Cache for storing detailed art objects
const artDetailCache = new Map();
const preloadQueue = new Set();

export const useArtDetail = (baseUrl) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const abortController = useRef(null);

    // Create optimistic data from ArtCard information
    const createOptimisticData = useCallback((cardData) => {
        return {
            id: cardData.id,
            label: cardData.label,
            imageUrl: cardData.imageUrl,
            artists: cardData.artists || [],
            // Set loading flags for missing data
            _isOptimistic: true,
            _loadingDetails: true,
            // Initialize empty arrays for data that will be loaded
            departments: [],
            classifiers: [],
            places: [],
            accession_no: null,
            date: null
        };
    }, []);

    // Fetch detailed art object
    const fetchArtDetail = useCallback(async (id) => {
        // Check cache first
        if (artDetailCache.has(id)) {
            return artDetailCache.get(id);
        }

        // Cancel previous request if still pending
        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = new AbortController();

        try {
            const response = await fetch(`${baseUrl}/objects/${id}`, {
                signal: abortController.current.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Cache the result
            artDetailCache.set(id, data);

            // Limit cache size to prevent memory leaks
            if (artDetailCache.size > 100) {
                const firstKey = artDetailCache.keys().next().value;
                artDetailCache.delete(firstKey);
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                return null; // Request was cancelled
            }
            throw error;
        }
    }, [baseUrl]);

    // Load art detail with loading state
    const loadArtDetail = useCallback(async (id) => {
        setLoading(true);
        setError(false);

        try {
            const data = await fetchArtDetail(id);
            setLoading(false);
            return data;
        } catch (error) {
            console.error('Failed to fetch art detail:', error);
            setError(true);
            setLoading(false);
            return null;
        }
    }, [fetchArtDetail]);

    // Preload art detail in background
    const preloadArtDetail = useCallback(async (id) => {
        if (artDetailCache.has(id) || preloadQueue.has(id)) {
            return; // Already cached or being preloaded
        }

        preloadQueue.add(id);

        try {
            await fetchArtDetail(id);
        } catch (error) {
            console.warn('Preload failed for art detail:', id, error);
        } finally {
            preloadQueue.delete(id);
        }
    }, [fetchArtDetail]);

    // Get cached art detail
    const getCachedArtDetail = useCallback((id) => {
        return artDetailCache.get(id) || null;
    }, []);

    // Clear cache
    const clearCache = useCallback(() => {
        artDetailCache.clear();
        preloadQueue.clear();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, []);

    return {
        loadArtDetail,
        preloadArtDetail,
        getCachedArtDetail,
        createOptimisticData,
        clearCache,
        loading,
        error,
        isCached: (id) => artDetailCache.has(id)
    };
};