import {
    Alert,
    AlertTitle,
    Button, DialogActions, DialogContent, DialogTitle, Grid,
    Stack,
    TextField
} from "@mui/material";
import React from "react";
import axios from "../config/axiosConfig";
import {FileUpload} from "./FileUpload";
import {logIn} from "./Login";


const UpdateAccount = (props: any) => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");

    const [email, setEmail] = React.useState("");

    const [password, setPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        setFirstName(props.user.firstName);
        setLastName(props.user.lastName);
        setEmail(props.user.email);
    }, [])

    const handleClose = () => {
        props.setDialogOpen(false);
        props.updateCallback();
    }

    const updateHandler = (event: any) => {

        event.preventDefault();

        const data: Partial<UserUpdate> = {
            firstName: firstName,
            lastName: lastName,
            email: email
        }

        if (password.length > 0) {
            data["password"] = newPassword;
            data["currentPassword"] = password;
        }

        axios.patch("users/" + props.userId, data)
            .then(response => {
                handleClose();
            }, error => {
                if (error.response && error.response.status === 403) {
                    setErrorMessage("That email is already in use!");
                } else if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.statusText);
                } else {
                    setErrorMessage(error.toString());
                }
                setErrorFlag(true);
            });
    }

    return (
        <div>

            <DialogTitle>Update your account details</DialogTitle>
            <form onSubmit={updateHandler}>
                <DialogContent>
                    {errorFlag && <Alert severity="error" sx={{margin: "10px"}}>
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>}

                    <Stack alignItems="center">

                        <TextField
                            value={firstName}
                            label="First Name"
                            inputProps={{minLength: 1}}
                            onChange={
                                event => {setFirstName(event.target.value)}
                            }
                            margin="dense"
                            required
                        />
                        <TextField
                            value={lastName}
                            label="Last Name"
                            inputProps={{minLength: 1}}
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
                            inputProps={{minLength: 1}}
                            onChange={
                                event => {setEmail(event.target.value)}
                            }
                            margin="dense"
                            required
                        />

                        <TextField
                            value={password}
                            label="Current Password"
                            type="password"
                            inputProps={{minLength: 1}}
                            onChange={
                                event => {setPassword(event.target.value)}
                            }
                            margin="dense"
                            required={newPassword.length > 0}
                        />

                        <TextField
                            value={newPassword}
                            label="New Password"
                            type="password"
                            inputProps={{minLength: 6}}
                            onChange={
                                event => {setNewPassword(event.target.value)}
                            }
                            margin="dense"
                        />


                    </Stack>



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
                        Submit Changes
                    </Button>
                </DialogActions>

            </form>

        </div>

    )
}

export default UpdateAccount;