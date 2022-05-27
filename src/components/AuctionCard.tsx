import {Avatar, Box, Card, Chip, Pagination, Stack, Typography, Link} from "@mui/material";
import React from "react";
import {rootUrl} from "../config/root";
//import {Link} from "react-router-dom";

const FALLBACK_IMAGE = "noImg.svg"

export const computeClosingTime = (endDateString: string) => {
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

    const [imgSource, setImgSource] = React.useState(rootUrl + "auctions/" + item.auctionId + "/image");

    const sellerName = item.sellerFirstName + " " + item.sellerLastName;


    const bidPrice = item.highestBid !== null ? "$" + item.highestBid: "No bids";
    const reserve = "Reserve: $" + item.reserve + " (" + ((item.reserve > item.highestBid) ? "unmet" : "met") + ")";

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Card sx={{height: cardHeight, maxWidth: "600px", flex: 1}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", display: "flex", flexDirection:"column"}}>

                        <Typography variant="h5" style={{flex: "1"}}>
                            <Link href={"/auctions/" + item.auctionId} variant="inherit" underline="hover" color="black">
                                {item.title}
                            </Link>
                        </Typography>

                        <Box sx={{width: "90%", border: 1, borderRadius: "1rem", margin: "5px", flex: "1"}}>
                            <Stack direction="row" sx={{justifyContent: "center"}}>
                                <p>{sellerName}</p>
                                <Avatar src={rootUrl + "users/" + item.sellerId + "/image"} sx={{margin: "5px"}}>
                                    {item.sellerFirstName[0] + item.sellerLastName[0]}
                                </Avatar>
                            </Stack>
                        </Box>



                        <div style={{flex: "1"}}>{computeClosingTime(item.endDate)}</div>
                        <Chip
                            label={categories[item.categoryId]} sx={{margin: "1rem"}}
                            onClick={event => {
                                props.setSelectedCategories([item.categoryId]);
                            }}
                        />


                    </div>
                    <Link href={"/auctions/" + item.auctionId}>
                        <div style={{position: "relative", float: "right"}}>
                            <img src={imgSource} style={{
                                objectFit: "cover", width: cardHeight, height: cardHeight
                            }} onError={() => {
                                setImgSource(FALLBACK_IMAGE);
                            }}
                            />

                            <Typography variant="subtitle1" style={{
                                position: "absolute", bottom: "1rem", right: "1rem",
                                color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "0.5rem",
                                padding: "2px"
                            }}>
                                {reserve}
                            </Typography>
                            <Typography variant="h5" style={{
                                position: "absolute", bottom: "3.25rem", right: "1rem",
                                color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "0.5rem",
                                padding: "2px"
                            }}>
                                {bidPrice}
                            </Typography>
                        </div>
                    </Link>



                </div>
            </Card>
        </Box>

    )
}

export default AuctionCard;