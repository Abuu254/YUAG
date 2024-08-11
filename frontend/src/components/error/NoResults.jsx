import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function NoResults({ query, categories }) {
    return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h5" color="textSecondary">
                No results for query "{query}"
            </Typography>
            {categories && categories.length > 0 && (
                <Typography variant="subtitle1" color="textSecondary">
                    for categories: {categories.join(', ')}
                </Typography>
            )}
        </Box>
    );
}

export default NoResults;
