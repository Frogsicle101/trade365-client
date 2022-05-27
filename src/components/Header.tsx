import {alpha, AppBar, Avatar, Box, Button, InputBase, styled, TextField, Toolbar, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {useSearchStore} from "../store";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
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

const Header = () => {

    const searchText = useSearchStore(state => state.searchText);
    const setSearchText = useSearchStore(state => state.setSearchText);

    let imageSource = "";
    const navigate = useNavigate();

    return (
        <div>
            <AppBar position="static" sx={{marginBottom: "1rem"}}>
                <Toolbar>
                    <Box flexGrow={1}>
                        <Button onClick={() => navigate("/")} color="inherit" sx={{float: "left"}}>
                            Trade365
                        </Button>
                    </Box>



                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value);
                            }}
                            onKeyPress={event => {
                                if (event.key === "Enter") {
                                    navigate("/");
                                }
                            }}
                            inputProps={{'aria-label': 'search'}}
                        />
                    </Search>



                    <Avatar src={imageSource}/>
                </Toolbar>

            </AppBar>
        </div>

    )
}
export default Header;