import Divider from '@mui/material/Divider';
import ExploreDepartments from './ExploreDepartment.jsx';
import AllArts from './AllArts.jsx';
import { ThemeProvider } from '@mui/material';
import theme from "../theme.jsx";

export default function Explore({onCardClick, onPreload}) {
    return (
        <ThemeProvider theme={theme}>
        <Divider></Divider>
            <ExploreDepartments />
            <AllArts/>
        </ThemeProvider>
    )
}
