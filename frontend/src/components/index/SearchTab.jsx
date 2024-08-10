import { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import useMediaQuery from '../../util/UseMedia.js';
import InteractiveFilter from './InteractiveFilter.jsx';
import Results from '../Results.jsx';
import { Divider } from '@mui/material';

const grey = '#808080';  // Define a light blue color
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(grey, 0.15),
    '&:hover': {
        backgroundColor: alpha(grey, 0.25),
    },
    marginRight: theme.spacing(5),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '30%',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function SearchTab({ onCardClick }) {
    const [searchCriteria, setSearchCriteria] = useState({
        all: true,
        title: false,
        artist: false,
        place: false,
        classifier: false,
    });
    const [searchQuery, setSearchQuery] = useState('');

    const handleCriterionChange = (event) => {
        const { name } = event.target;

        setSearchCriteria({
            all: name === 'all',
            title: name === 'title',
            artist: name === 'artist',
            place: name === 'place',
            classifier: name === 'classifier',
        });
    };


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Box role="section">
            <InteractiveFilter />
            <Box>
                <Toolbar sx={{
                    flexDirection: isSmallScreen ? 'column' : 'row',
                    alignItems: isSmallScreen ? 'stretch' : 'center',
                    justifyContent: isSmallScreen ? 'center' : 'space-between',
                }}>
                    <FormGroup
                        row={!isSmallScreen}
                        sx={{
                            marginBottom: isSmallScreen ? 2 : 0,
                            flexDirection: isSmallScreen ? 'column' : 'row',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchCriteria.all}
                                    onChange={handleCriterionChange}
                                    name="all"
                                />
                            }
                            label="All"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchCriteria.title}
                                    onChange={handleCriterionChange}
                                    name="title"
                                />
                            }
                            label="Object/Art Title"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchCriteria.artist}
                                    onChange={handleCriterionChange}
                                    name="artist"
                                />
                            }
                            label="Name of Artist or Maker"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchCriteria.place}
                                    onChange={handleCriterionChange}
                                    name="place"
                                />
                            }
                            label="Place"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchCriteria.classifier}
                                    onChange={handleCriterionChange}
                                    name="classifier"
                                />
                            }
                            label="Type of Object (Classifier)"
                        />
                    </FormGroup>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            onChange={handleSearch}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Toolbar>
            </Box>
            <Divider></Divider>
            <Results searchQuery={searchQuery} searchCriteria={searchCriteria} onCardClick={onCardClick} />
        </Box>
    )
}
