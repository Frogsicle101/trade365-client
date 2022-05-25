import {Alert, AlertTitle} from "@mui/material";
import React from "react";

const ErrorMessage = (props: any) => {
    if (props.flag) {
        return (
            <Alert severity="error" sx={{margin: "10px"}}>
                <AlertTitle>Error</AlertTitle>
                {props.message}
            </Alert>
        )
    }
    return null;
}
export default ErrorMessage;