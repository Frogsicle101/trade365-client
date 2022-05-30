import {Tooltip} from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import {computeClosingTime} from "./AuctionCard";

const Closing = (props: any) => {
    return (
        <div style={{flex: "1"}}>
            <Tooltip title={dayjs(props.endDate).format("YYYY-MM-DD HH:mm")}>
                <span>{computeClosingTime(props.endDate)}</span>
            </Tooltip>
        </div>
    )
}

export default Closing;