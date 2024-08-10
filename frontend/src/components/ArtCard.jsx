import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import './ArtCard.css';
import { formatArtistDetails } from '../util/format';
import imgnotavailable from '../assets/fallback.png';

export default function ArtCard({ id, label, artists, imageUrl, onClick }) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };
    const handleImageError = (event) => {
        event.target.src = { imgnotavailable }; // Fallback image
        event.target.alt = 'Image not available';
    };
    return (
        <div className="art-card" onClick={() => onClick(id)}>
            <div className='art-card-container'>
                {!isImageLoaded && <Skeleton height="100%" />}
                <img
                    src={imageUrl}
                    alt={label}
                    className="art-card-image"
                    onLoad={handleImageLoad}
                    style={{ display: isImageLoaded ? 'block' : 'none' }}
                    onError={handleImageError}
                />
            </div>
            <div className="art-card-content">
                <h3 className="art-card-title">{label}</h3>
                <p className="art-card-artist">
                    {formatArtistDetails(artists)}
                </p>
            </div>
        </div>
    );
}