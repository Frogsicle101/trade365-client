import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    InputAdornment,
    TextField,
    Tooltip
} from "@mui/material";
import React from "react";
import {useUserStore} from "../store";
import axios from "../config/axiosConfig";
import ErrorMessage from "./ErrorMessage";

const BidButton = (props: any) => {

    const auctionClosed = props.auctionClosed;
    const auction = props.auction
    const id = auction.auctionId;
    const highestBid = props.highestBid;

    const bidPlacedCallback = props.callback;

    const user = useUserStore(state => state.user);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [open, setOpen] = React.useState(false);

    const [amount, setAmount] = React.useState(0);

    const handleClickPlaceBid = () => {
        if (!user) {
            props.noUserCallback();
        } else {
            setOpen(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        sendBid(amount);

    }

    const sendBid = (amount: number) => {
        axios.post("auctions/" + id + "/bids", {
            amount: amount
        })
            .then((response) => {
                setErrorFlag(false);
                handleClose();
                bidPlacedCallback();

            }, (error) => {

                setErrorMessage(error.toString());

                if (error.response && error.response.status === 403) {
                    setErrorMessage("Someone just placed a bid higher than that!");
                    bidPlacedCallback();
                }

                setErrorFlag(true);

            })
    }
    let userIsSeller = false;
    if (user) {
        userIsSeller = user.userId === auction.sellerId;
    }

    const shouldDisable = auctionClosed || userIsSeller;

    let toolTipText = "";
    if (userIsSeller) {
        toolTipText = "You cannot bid on your own auction";
    } else if (auctionClosed) {
        toolTipText = "This auction has closed"
    }

    return (
        <Box margin="2rem">
            <Box>
                <Tooltip title={toolTipText} arrow>
                    <div style={{float: "right"}}>
                        <Button
                            variant="contained"
                            disabled={shouldDisable}
                            onClick={handleClickPlaceBid}
                        >
                            Place New Bid!
                        </Button>
                    </div>
                </Tooltip>

            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Place Bid</DialogTitle>
                <ErrorMessage flag={errorFlag} message={errorMessage}/>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            <p>Current Highest Bid: {highestBid}</p>
                            <p>Please enter your bid value in NZD</p>
                        </DialogContentText>
                        <TextField
                            value={amount}
                            onChange={event => setAmount(parseInt(event.target.value, 10))}
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">$</InputAdornment>
                                ),
                                inputProps: {min: highestBid + 1}
                            }}
                            autoFocus
                        />
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
                            Submit bid
                        </Button>
                    </DialogActions>
                </form>


            </Dialog>
        </Box>

    )
}

export default BidButton;