import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import axios from "../config/axiosConfig";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import User from "./User";
import dayjs from "dayjs";
import {useInterval} from "../hooks/useInterval";

const Bids = (props: any) => {

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [bids, setBids] = React.useState<Bid[]>([]);


    useInterval(() => {
        getBids();
    }, 10000);


    const getBids = () => {
        axios.get("auctions/" + props.auction.auctionId + "/bids")
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setBids(response.data)
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }


    const listOfBids = () => {
        return bids.map((item, index) => (
            <TableRow key={item.timestamp} sx={index === 0?{fontSize: "large"}:{fontSize: "small"}}>
                <TableCell>
                    <User firstName={item.firstName} lastName={item.lastName} id={item.bidderId}/>
                </TableCell>
                <TableCell>{dayjs(item.timestamp).format('hh:mm a DD/MM/YYYY')}</TableCell>
                <TableCell>{"$" + item.amount}</TableCell>
            </TableRow>
        ))
    }

    React.useEffect(() => {
        getBids();
    }, [props.numBids, getBids]);

    if (bids.length > 0) {
        return (
            <div>
                <TableContainer component={Paper} sx={{maxHeight: 440, overflow: "auto", marginBottom: 2}}>
                    <ErrorMessage flag={errorFlag} message={errorMessage}/>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Bidder</TableCell>
                                <TableCell>Bid Time</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listOfBids()}
                        </TableBody>

                    </Table>
                </TableContainer>
            </div>

        )
    } else {
        return <div/>;
    }


}

export default Bids;