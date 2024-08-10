import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function ErrorPage() {
    return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h5" color="error">
                Oops! Something went wrong. Please try again later.
            </Typography>
        </Box>
    );
}

export default ErrorPage;
