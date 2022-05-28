import {Button, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import React from "react";
import {useUserStore} from "../store";
import axios from "../config/axiosConfig";

export const logIn = (email: string, password: string, callback: (() => Promise<void>) | (() => void)) => {
    const setUser = useUserStore.getState().setUser;

    axios.post("users/login", {
        email: email,
        password: password
    }).then(response => {

        axios.defaults.headers.common['X-Authorization'] = response.data.token;

        const callbackValue = callback();
        if (callbackValue) {
            callbackValue.then(() => {
                setUser({
                    userId: response.data.userId,
                    token: response.data.token
                });
            });
        } else {
            setUser({
                userId: response.data.userId,
                token: response.data.token
            });
        }


    });
}


const Login = (props: any) => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleClose = () => {
        props.setDialogOpen(false);
    }

    const loginHandler = (event: any) => {
        event.preventDefault();

        logIn(email, password, handleClose);
    }

    return (
        <div>
            <DialogTitle>Login</DialogTitle>
            <form onSubmit={loginHandler}>
                <DialogContent>
                    <Stack alignItems="center">
                        <TextField
                            value={email}
                            label="Email"
                            onChange={event => {
                                setEmail(event.target.value)
                            }}
                            type="email"
                            margin="dense"
                        />
                        <TextField
                            value={password}
                            label="Password"
                            onChange={event => {
                                setPassword(event.target.value)
                            }}
                            type="password"
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
                        Log In
                    </Button>
                </DialogActions>
            </form>

        </div>
    )
}

export default Login;