import {AppBar, Avatar, Toolbar, Typography} from "@mui/material";

const Header = () => {

    let imageSource = "";

    return (
        <div>
            <AppBar position="static" sx={{marginBottom: "1rem"}}>
                <Toolbar>
                    <Typography variant="h5" sx={{flexGrow: 1}}>
                        Trade365
                    </Typography>

                    <Avatar src={imageSource}/>
                </Toolbar>

            </AppBar>
        </div>

    )
}
export default Header;