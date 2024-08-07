import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ArtCard.css';

export default function SkeletonCard(){
    return (
        <div className="art-card">
            <div className="art-card-container">
                <Skeleton height="100%" />
            </div>
            <div className="art-card-content">
                <h3 className="art-card-title">
                    <Skeleton width="80%" />
                </h3>
                <p className="art-card-artist">
                    <Skeleton width="60%" />
                </p>
            </div>
        </div>
    );
}