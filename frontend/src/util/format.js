export const formatArtistDetails = (artists) => {
    if (!artists || artists.length === 0) {
        return 'Artist: Unknown';
    }

    return artists.map(artist => {
        const { name, type, begin_date, end_date, nationalities, part } = artist;
        const beginYear = begin_date ? new Date(begin_date).getFullYear() : null;
        const endYear = end_date ? new Date(end_date).getFullYear() : "present";
        const nationalityString = nationalities && nationalities.length > 0 ? ` (${nationalities.join(", ")})` : "";

        let dateString = "";
        if (beginYear) {
            dateString = `, ${beginYear} - ${endYear}`;
        } else if (end_date) {
            dateString = `, ? - ${endYear}`;
        }

        if (type === 'Person') {
            return `${part}: ${name}${nationalityString}${dateString}`;
        } else {
            return `${name}${dateString}`;
        }
    }).join("; ");
};
