import {
    Alert,
    AlertTitle,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField
} from "@mui/material";
import React from "react";
import axios from "../config/axiosConfig";
import {FileUpload} from "./FileUpload";
import {logIn} from "./Login";
import {uploadImage} from "./ChangeProfilePhoto";

const Registration = (props: any) => {

    const initialImageSource = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");


    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleClose = () => {
        props.setDialogOpen(false);
    }

    const registerHandler = (event: any) => {

        event.preventDefault();

        axios.post(
            "users/register",
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
            .then(response => {
                    logIn(email, password, () => {
                        if (imageFile) {
                            return uploadImage(response.data.userId, imageFile).then(handleClose);
                        } else {
                            handleClose();
                        }
                    }, setErrorMessage, setErrorFlag);
                }, error => {
                    if (error.response && error.response.status === 403) {
                        setErrorMessage("That email is already in use!");
                    } else {
                        setErrorMessage(error.toString());
                    }
                    setErrorFlag(true);
                });
    }

    const [imageSource, setImageSource] = React.useState(initialImageSource);
    const [imageFile, setImageFile] = React.useState<File | null>(null);

    return (
        <div>

            <DialogTitle>Register a new account</DialogTitle>
            <form onSubmit={registerHandler}>
                <DialogContent>
                    {errorFlag && <Alert severity="error" sx={{margin: "10px"}}>
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Stack alignItems="center">

                                <TextField
                                    value={firstName}
                                    label="First Name"
                                    onChange={
                                        event => {setFirstName(event.target.value)}
                                    }
                                    margin="dense"
                                    required
                                />
                                <TextField
                                    value={lastName}
                                    label="Last Name"
                                    onChange={
                                        event => {setLastName(event.target.value)}
                                    }
                                    margin="dense"
                                    required
                                />
                                <TextField
                                    value={email}
                                    label="Email"
                                    type="email"
                                    onChange={
                                        event => {setEmail(event.target.value)}
                                    }
                                    margin="dense"
                                    required
                                />

                                <TextField
                                    value={password}
                                    label="Password"
                                    type="password"
                                    inputProps={{minLength: 6}}
                                    onChange={
                                        event => {setPassword(event.target.value)}
                                    }
                                    margin="dense"
                                    required
                                />


                            </Stack>
                        </Grid>
                        <Grid item xs={6}>
                            <FileUpload
                                imageSource={imageSource} setImageSource={setImageSource}
                                setImageFile={setImageFile}
                            />
                        </Grid>
                    </Grid>



                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Register
                    </Button>
                </DialogActions>

            </form>

        </div>

    )
}

export default Registration;