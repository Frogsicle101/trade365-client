import {Avatar, Box, Card, Chip, Stack, Typography} from "@mui/material";
import React from "react";

const computeClosingTime = (endDateString: string) => {
    let now = new Date();
    let endDate = new Date(endDateString);

    let elapsed = endDate.getTime() - now.getTime();
    let days = Math.floor(elapsed / (1000 * 60 * 60 * 24))

    if (days < 0) {
        return "Closed";
    } else if (days === 0) {
        return "Closing today";
    } else if (days === 1) {
        return "Closing tomorrow"
    } else {
        return "Closing in " + days + " days";
    }

}

const AuctionCard = (props: any) => {

    const item = props.item;
    const cardHeight = props.cardHeight;
    const categories = props.categories;

    const sellerName = item.sellerFirstName + " " + item.sellerLastName;

    const bidPrice = item.highestBid !== null ? "$" + item.highestBid: "No bids";

    return (
        <Card sx={{height: cardHeight, maxWidth: "600px"}}>
            <div style={{display: "flex"}}>
                <div style={{flex: "1", display: "flex", flexDirection:"column"}}>
                    <Typography variant="h5" style={{flex: "1"}}>{item.title}</Typography>
                    <Box sx={{width: "90%", border: 1, borderRadius: "1rem", margin: "5px", flex: "1"}}>
                        <Stack direction="row" sx={{justifyContent: "center"}}>
                            <p>{sellerName}</p>
                            <Avatar src={"http://localhost:4941/api/v1/users/" + item.sellerId + "/image"} sx={{margin: "5px"}}>
                                {item.sellerFirstName[0] + item.sellerLastName[0]}
                            </Avatar>
                        </Stack>
                    </Box>



                    <div style={{flex: "1"}}>{computeClosingTime(item.endDate)}</div>
                    <Chip label={categories[item.categoryId]} sx={{margin: "1rem"}}/>
                </div>
                <div style={{position: "relative", float: "right"}}>
                    <img src={"http://localhost:4941/api/v1/auctions/" + item.auctionId + "/image"} style={{
                        objectFit: "cover", width: cardHeight, height: cardHeight
                    }}/>
                    <Typography variant="h5" style={{
                        position: "absolute", bottom: "1rem", right: "1rem",
                        color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "0.5rem"
                    }}>
                        {bidPrice}
                    </Typography>
                </div>
            </div>
        </Card>
    )
}

export default AuctionCard;