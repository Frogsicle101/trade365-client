import {useParams} from "react-router-dom";
import Header from "../components/Header";
import {Avatar, Box, Card, Chip, Container, Link, Skeleton, Stack, Typography} from "@mui/material";
import axios from "../config/axiosConfig";
import React from "react";
import ErrorMessage from "../components/ErrorMessage";
import AuctionCard, {computeClosingTime} from "../components/AuctionCard";
import {rootUrl} from "../config/root";
import SimilarAuctions from "../components/SimilarAuctions";

const FALLBACK_IMAGE = "noImg.svg"

const AuctionPage = (props: any) => {
    const {id} = useParams();

    const [auction, setAuction] = React.useState<FullAuction | null>(null);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [categories, setCategories] = React.useState<{[key:number]: string}>({})

    const [imgSource, setImgSource] = React.useState(FALLBACK_IMAGE);

    React.useEffect(() => {
        getAuction();
        getCategories();
    }, []);

    const getAuction = () => {
        axios.get("auctions/" + id)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setAuction(response.data);
                setImgSource(rootUrl + "auctions/" + response.data.auctionId + "/image");
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    const getCategories = () => {
        axios.get('auctions/categories')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                let categoryDict: {[key:number]: string} = {};
                for (const category of response.data) {
                    categoryDict[category.categoryId as keyof Object] = category.name
                }

                setCategories(categoryDict);
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    
    let innerContent;

    if (auction) {
        const sellerName = auction.sellerFirstName + " " + auction.sellerLastName;
        const bidPrice = auction.highestBid !== null ? "$" + auction.highestBid: "No bids";
        const reserve = "Reserve: $" + auction.reserve + " (" + ((auction.reserve > auction.highestBid) ? "unmet" : "met") + ")";

        innerContent = (
            <div>
                <Card sx={{marginBottom: 2}}>
                    <Box display="flex">
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                            <div style={{display: "flex"}}>
                                <div style={{flex: "1", display: "flex", flexDirection:"column"}}>

                                    <Typography variant="h3" sx={{padding: 2}}>{auction.title}</Typography>


                                    <Box display="flex" padding={2}>
                                        <Box textAlign="left" flex={1}>
                                            <Typography variant="body2">
                                                {bidPrice}
                                            </Typography>
                                            <Typography variant="body2">
                                                {reserve}
                                            </Typography>
                                        </Box>


                                        <Box flex={1}>
                                            <Stack direction="row" sx={{justifyContent: "center"}}>
                                                <p>{sellerName}</p>
                                                <Avatar src={rootUrl + "users/" + auction.sellerId + "/image"} sx={{margin: "5px"}}>
                                                    {auction.sellerFirstName[0] + auction.sellerLastName[0]}
                                                </Avatar>
                                            </Stack>
                                        </Box>
                                    </Box>




                                    <div style={{flex: "1"}}>{computeClosingTime(auction.endDate)}</div>
                                    <Chip
                                        label={categories[auction.categoryId]} sx={{margin: "1rem"}}
                                        onClick={event => {
                                            props.setSelectedCategories([auction.categoryId]);
                                        }}
                                    />
                                    <Typography variant="body1" sx={{paddingX: 5}}>
                                        {auction.description}
                                    </Typography>
                                    

                                </div>
                            </div>
                        </Box>
                        
                        <img src={imgSource} style={{height: "25rem", objectFit: "contain"
                        }} onError={() => {
                            setImgSource(FALLBACK_IMAGE);
                        }}/>
                    </Box>
                </Card>
                <SimilarAuctions categoryId={auction.categoryId} sellerId={auction.sellerId} sellerName={sellerName}/>

            </div>

        )
    } else {
        innerContent = (
            <Card sx={{padding: "20px"}}>
                <Typography variant="subtitle1">We couldn't find that auction</Typography>
                <Link href="/">Back to the homepage?</Link>
            </Card>
        )
    }

    return (
        <div>
            <Header/>
            <ErrorMessage flag={errorFlag} message={errorMessage}/>
            <Container sx={{display: "flex", flexDirection: "column"}}>
                {innerContent}
            </Container>
        </div>

    )
}

export default AuctionPage;