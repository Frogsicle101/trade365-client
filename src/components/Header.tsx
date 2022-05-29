import {
    alpha,
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    InputBase, Menu,
    MenuItem,
    styled, Tab, Tabs,
    Toolbar
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {useHeaderStore, useUserStore} from "../store";
import React from "react";
import Registration from "./Registration";
import Login from "./Login";
import {logout} from "../utils/userUtils";
import {rootUrl} from "../config/root";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

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

const Header = (props: any) => {

    const searchText = useHeaderStore(state => state.searchText);
    const setSearchText = useHeaderStore(state => state.setSearchText);

    const loginOpen = useHeaderStore(state => state.loginOpen);
    const setLoginOpen = useHeaderStore(state => state.setLoginOpen);

    const user = useUserStore(state => state.user);

    const [tabIndex, setTabIndex] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const userArea = () => {
        if (user === null) {
            return (
                <Button color="inherit" onClick={()=>setLoginOpen(true)}>Login / Register</Button>
            )
        } else {
            return (
                <Avatar src={rootUrl + "users/" + user.userId + "/image"} onClick={handleMenu}/>
            )
        }
    }

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

                    {userArea()}

                </Toolbar>

            </AppBar>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    navigate("/profile");
                    handleClose();
                }}>My Account</MenuItem>
                <MenuItem onClick={() => {
                    logout().then(() => {handleClose(); navigate("/")})
                }}>Logout</MenuItem>
            </Menu>

            <Dialog open={loginOpen} onClose={()=>setLoginOpen(false)}>
                <Tabs value={tabIndex} onChange={(event, value) => setTabIndex(value)}>
                    <Tab label="Login"/>
                    <Tab label="Register"/>
                </Tabs>
                <TabPanel value={tabIndex} index={0}>
                    <Login setDialogOpen={setLoginOpen}/>
                </TabPanel>
                <TabPanel value={tabIndex} index={1}>
                    <Registration setDialogOpen={setLoginOpen}/>
                </TabPanel>
            </Dialog>
        </div>

    )
}
export default Header;