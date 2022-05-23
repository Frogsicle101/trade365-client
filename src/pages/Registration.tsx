import CSS from 'csstype';
import {
    Alert,
    AlertTitle,
    Button, Grid,
    Paper,
    Stack,
    TextField
} from "@mui/material";
import React from "react";
import axios from "../config/axiosConfig";
import {FileUpload} from "../components/FileUpload";
import {useUserStore} from "../store";




const logIn = (email: string, password: string, callback: any) => {
    // //const user = useUserStore(state => state.user);
    // const setUser = useUserStore(state => state.setUser);
    axios.post("users/login", {
        email: email,
        password: password
    }).then(response => {
        // setUser({
        //     userId: response.data.userId,
        //     token: response.data.token
        // })
        axios.defaults.headers.common['X-Authorization'] = response.data.token;
        callback();
    });
}


const uploadImage = (userId: number, imageFile: File) => {

    axios.put("users/" + userId + "/image", imageFile, {
        headers: {
            'Content-Type': imageFile.type
        }
    })
        .then(()=>alert("yay!"));
}


const Registration = () => {

    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

    const initialImageSource = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

    const card: CSS.Properties = {
        padding: "10px",
    }


    const main: CSS.Properties = {
        width: "50%",
        margin: "auto",
        marginTop: "20px"
    }

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const registerHandler = (event: any) => {

        event.preventDefault();

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters")
            setErrorFlag(true);
            return;
        }

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
                        uploadImage(response.data.userId, imageFile);
                    }

                });


            },

            error => {
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
        <div style={main}>
            <Paper elevation={3} style={card}>
                <h1>Register a new account</h1>

                {errorFlag && <Alert severity="error" sx={{margin: "10px"}}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>}

                <form onSubmit={registerHandler}>
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

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Register
                </Button>
                </form>



            </Paper>
        </div>

    )
}

export default Registration;