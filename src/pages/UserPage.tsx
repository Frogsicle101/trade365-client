import {useUserStore} from "../store";
import {Avatar, Button, Card, Container, Dialog, Stack, Typography} from "@mui/material";
import React from "react";
import Header from "../components/Header";
import axios from "../config/axiosConfig";
import {rootUrl} from "../config/root";
import ErrorMessage from "../components/ErrorMessage";
import UpdateAccount from "../components/UpdateAccount";
import ChangeProfilePhoto from "../components/ChangeProfilePhoto";
import MyAuctions from "../components/MyAuctions";
import Heading from "../components/Heading";

const UserPage = () => {

    const user = useUserStore(state => state.user);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [fullUser, setFullUser] = React.useState<FullUser | null>(null);

    const [imgSrc, setImgSrc] = React.useState(user ? rootUrl + "users/" + user.userId + "/image" : "");

    const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
    const [photoDialogOpen, setPhotoDialogOpen] = React.useState(false);

    const [imgExists, setImgExists] = React.useState(false);

    const [state, setState] = React.useState(0);

    React.useEffect(() => {
        checkImageExists();
        getUser();
    }, [state]);


    const checkImageExists = () => {
        if (user) {
            axios.get("users/" + user.userId + "/image")
                .then((response) => {
                    setImgExists(true);
                }, error => {
                    setImgExists(false);
                })
        } else {
            setImgExists(false);
        }

    }



    const getUser = () => {
        if (user) {
            axios.get("users/" + user.userId)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setFullUser(response.data);

                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                })
        }

    }

    const handleDeletePhoto = () => {
        if (user) {
            axios.delete("users/" + user.userId + "/image")
                .then((response) => {
                    setImgSrc("");
                }, error => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                })
        }

    }

    const handleUpdateClose = () => {
        setUpdateDialogOpen(false);
    }

    const handlePhotoClose = () => {
        setPhotoDialogOpen(false);
    }



    let innerContent;

    if (user && fullUser) {

        const name = fullUser.firstName + " " + fullUser.lastName;

        innerContent = (
            <div>
                <Heading>Profile</Heading>
                <Card sx={{padding: "10px"}}>
                    <Stack direction="row" justifyContent="space-evenly" alignItems="center">
                        <Stack justifyContent="space-evenly" spacing={2}>
                            <Typography>{"Name: " + name}</Typography>
                            <Typography>{"Email: " + fullUser.email}</Typography>
                            <Button variant="outlined" onClick={() => setUpdateDialogOpen(true)}>
                                Update account details
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleDeletePhoto}
                                disabled={!imgExists}
                            >
                                Delete Profile Photo
                            </Button>
                            <Button variant="outlined"
                                onClick={() => setPhotoDialogOpen(true)}
                            >
                                Change profile photo
                            </Button>
                        </Stack>
                        <Avatar src={imgSrc} sx={{height: "15rem", width: "15rem"}}/>


                    </Stack>

                </Card>
                <Dialog open={updateDialogOpen} onClose={handleUpdateClose}>
                    <UpdateAccount
                        setDialogOpen={setUpdateDialogOpen}
                        user={fullUser}
                        userId={user.userId}
                        updateCallback={() => setState(state => state + 1)}
                    />

                </Dialog>
                <Dialog open={photoDialogOpen} onClose={handlePhotoClose}>
                    <ChangeProfilePhoto setDialogOpen={setPhotoDialogOpen}
                                        updateCallback={()=>setState(state => state + 1)}/>
                </Dialog>

                <MyAuctions user={user}/>

            </div>
        )
    } else {
        innerContent = (
            <Card sx={{padding: "20px"}}>
                <Typography variant="subtitle1">You can't view your profile because you're not logged in</Typography>
            </Card>
        )
    }

    return (
        <div>
            <Header/>
            <ErrorMessage flag={errorFlag} message={errorMessage}/>
            <Container>
                {innerContent}
            </Container>
        </div>
    )

}

export default UserPage;