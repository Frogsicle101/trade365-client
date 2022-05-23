import CSS from 'csstype';
import {Button, FormControl, Grid, InputLabel, Paper, Stack, TextField} from "@mui/material";
import React from "react";
import axios from "axios";
import {rootUrl} from "../config/root";

const Registration = () => {

    const card: CSS.Properties = {
        padding: "10px",
        margin: "20px",
        width: "50%"
    }

    const main: CSS.Properties = {
        display: "flex",
        alignItems: "center"

    }

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");



    const registerHandler = () => {
        axios.post(
            rootUrl + "/users/register",
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
            .then(response => {alert(JSON.stringify(response))},
                error => {alert(JSON.stringify(error))});
    }

    return (
        <div style={main}>
            <Paper elevation={3} style={card}>
                <h1>Register a new account</h1>

                <Stack alignItems="center">
                    <InputLabel>First Name</InputLabel>
                    <TextField label="First Name" onChange={
                        event => {setFirstName(event.target.value)}
                    }/>
                    <TextField label="Last Name" onChange={
                        event => {setLastName(event.target.value)}
                    }/>
                    <TextField
                        label="Email"
                        type="email"
                        onChange={
                            event => {setEmail(event.target.value)}
                        }
                    />

                    <TextField
                        label="Password"
                        type="password"
                        onChange={
                            event => {setPassword(event.target.value)}
                        }
                    />

                    <Button
                        type="submit"
                        color="primary"
                        onClick={registerHandler}
                    >
                        Register
                    </Button>
                </Stack>

            </Paper>
        </div>

    )
}

export default Registration;