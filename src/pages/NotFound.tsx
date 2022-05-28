import Header from "../components/Header";
import {Card, Link, Typography} from "@mui/material";
import React from "react";

const NotFound = () => {
    return (
        <div>
            <Header/>
            <Card sx={{padding: "20px"}}>
                <Typography variant="subtitle1">We couldn't find that page</Typography>
                <Link href="/">Back to the homepage?</Link>
            </Card>
        </div>

    )
}

export default NotFound;