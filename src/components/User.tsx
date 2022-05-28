import {Avatar, Stack} from "@mui/material";
import {rootUrl} from "../config/root";
import React from "react";

const User = (props: any) => {

    return (
        <Stack direction="row" sx={{justifyContent: "center"}}>
            <p>{props.firstName + " " + props.lastName}</p>
            <Avatar src={rootUrl + "users/" + props.Id + "/image"} sx={{margin: "5px"}}>
                {props.firstName[0] + props.lastName[0]}
            </Avatar>
        </Stack>
    )
}

export default User;