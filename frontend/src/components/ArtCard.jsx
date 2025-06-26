import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import './ArtCard.css';
import { formatArtistDetails } from '../util/format';
import imgnotavailable from '../assets/fallback.png';

const ArtCard = memo(function ArtCard({ id, label, artists, imageUrl, onClick, onPreload }) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Reset states when imageUrl changes
    useEffect(() => {
        setIsImageLoaded(false);
        setImageError(false);
        setIsLoading(true);
    }, [imageUrl]);

    const handleImageLoad = useCallback(() => {
        setIsImageLoaded(true);
        setIsLoading(false);
    }, []);

    const handleImageError = useCallback((event) => {
        setImageError(true);
        setIsLoading(false);
        event.target.src = imgnotavailable;
        event.target.alt = 'Image not available';
    }, []);

    const handleCardClick = useCallback(() => {
        // Pass the full card data for optimistic UI
        const cardData = {
            id,
            label,
            artists,
            imageUrl: imageError ? imgnotavailable : imageUrl
        };
        onClick(id, cardData);
    }, [onClick, id, label, artists, imageUrl, imageError]);

    // Preload details on hover
    const handleMouseEnter = useCallback(() => {
        if (onPreload) {
            onPreload(id);
        }
    }, [onPreload, id]);

    // Memoize formatted artist details to prevent recalculation
    const artistDetails = useMemo(() => {
        return formatArtistDetails(artists);
    }, [artists]);

    // Show skeleton while loading or if image hasn't loaded yet
    const showSkeleton = isLoading || (!isImageLoaded && !imageError);

    return (
        <div
            className="art-card"
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
        >
            <div className='art-card-container'>
                {showSkeleton && <Skeleton height="100%" />}
                <img
                    src={imageError ? imgnotavailable : imageUrl}
                    alt={label}
                    className="art-card-image"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                        display: showSkeleton ? 'none' : 'block',
                        opacity: isImageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                    loading="eager" // Changed from lazy to eager for better loading
                />
            </div>
            <div className="art-card-content">
                <h3 className="art-card-title">{label}</h3>
                <p className="art-card-artist">
                    {artistDetails}
                </p>
            </div>
        </div>
    );
});

export default ArtCard;