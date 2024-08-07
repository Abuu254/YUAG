import React from 'react';
import Chip from '@mui/material/Chip';
import './ArtGallery.css';

const ArtDetail = ({ art, onClose }) => {
  if (!art) return null;

  return (
    <div className="art-detail">
      <h2>{art.label}</h2>
      <img src={art.imageUrl} alt={art.label} className="art-detail-image" />
      <p><strong>Accession Number:</strong> {art.accession_no}</p>
      <p><strong>Date:</strong> {art.date}</p>
      <h3>Artists</h3>
      <ul>
        {art.artists.map(artist => (
          <li key={artist.id}>
            {artist.name} ({artist.type}), {artist.begin_date} - {artist.end_date}
            <br />
            Nationalities: {artist.nationalities.join(', ')}
            <br />
            Part: {artist.part}
          </li>
        ))}
      </ul>
      <h3>Departments</h3>
      <ul>
        {art.departments.map(department => (
          <li key={department.id}>{department.name}</li>
        ))}
      </ul>
      <h3>Classifiers</h3>
      <ul>
        {art.classifiers.map(classifier => (
          <li key={classifier.id}>{classifier.name}</li>
        ))}
      </ul>
      <h3>Places</h3>
      <ul>
        {art.places.map(place => (
          <li key={place.id}>
            {place.label}
            <br />
            Coordinates: {place.latitude}, {place.longitude}
            <br />
            <a href={place.url} target="_blank" rel="noopener noreferrer">More Info</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtDetail;
