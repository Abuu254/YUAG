import logo from '../../assets/thumbnail.png';
import { Box, ThemeProvider } from '@mui/material';
import HomeLayout from './HomeLayout';
import bg from '../../assets/background.jpg'
import Typography from './Typography';

export default function Welcome() {
    const backgroundImage = bg;
    return (
        <HomeLayout
            sxBackground={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundColor: '#7fc7d9', // Average color of the background image.
                backgroundPosition: 'center',
            }}
        >
            <img
                style={{ display: 'none' }}
                src={backgroundImage}
                alt="increase priority"
            />
            <Typography color="inherit" align="center" variant="h2" marked="center">
                Welcome to Yale Art Gallery
            </Typography>
            <Typography
                color="inherit"
                align="center"
                variant="h5"
                sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
            >
                Explore an online collection of more than 180,000 artworks spanning ancient times to the present day.
            </Typography>

            <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
                Enjoy the Experience!
            </Typography>
        </HomeLayout>
    );
}
