import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Container from '@mui/material/Container';
import Typography from './Typography';
import { images } from '../../util/images.js';
import theme from '../theme.jsx';

const ImageBackdrop = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: '#000',
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    [theme.breakpoints.down('md')]: {
        width: '100% !important',
        height: 100,
    },
    '&:hover': {
        zIndex: 1,
    },
    '&:hover .imageBackdrop': {
        opacity: 0.15,
    },
    '&:hover .imageMarked': {
        opacity: 0,
    },
    '&:hover .imageTitle': {
        border: '4px solid currentColor',
    },
    '& .imageTitle': {
        position: 'relative',
        padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
    },
    '& .imageMarked': {
        height: 3,
        width: 18,
        background: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
}));

export default function Departments() {
    const navigate = useNavigate();

    const handleDepartmentClick = (departmentName) => {
        navigate(`/departments/${departmentName}`);
    };

    return (
            <Container component="section" sx={{ mt: 0, mb: 4, minWidth:'100%', backgroundColor: theme.palette.classy.one}}>
                <Typography variant="h4" marked="center" align="center" component="h2" color="white" sx={{p: 5}}>
                FOR EVERY CULTURE AND EVERY ERA
                </Typography>
                <Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap'}}>
                    {images.map((image) => (
                        <ImageIconButton
                            key={image.title}
                            style={{
                                width: image.width,
                            }}
                            id={image.id}
                            onClick={() => handleDepartmentClick(image.id)}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center 40%',
                                    backgroundImage: `url(${image.url})`
                                    ,
                                }}
                            />
                            <ImageBackdrop className="imageBackdrop" />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'common.white',
                                }}
                            >
                                <Typography
                                    component="h3"
                                    variant="h6"
                                    color="inherit"
                                    className="imageTitle"
                                >
                                    {image.title}
                                    <div className="imageMarked" />
                                </Typography>
                            </Box>
                        </ImageIconButton>
                    ))}
                </Box>
            </Container>
    );
}