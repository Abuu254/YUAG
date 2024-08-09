import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from './Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import theme from '../theme';

export default function AllArts() {
    const navigate = useNavigate();
    const handleExploreClick = () => {
        navigate('/all-arts/results');
    };
    return (
        <>
            <Divider sx={{ p: 5, color: "white", backgroundColor: theme.palette.classy.one }}>OR</Divider>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.palette.classy.one,
                    pb: 10,
                }}
            >
                <Button variant="contained" onClick={handleExploreClick}>
                    <Typography variant="h5" marked="center" align="center" component="h2">
                        Exolore the entire Collection
                    </Typography>
                </Button>
            </Box>
        </>
    );
}