import {useParams} from "react-router-dom";
import Header from "../components/Header";
import {Box, Card, Container, Link, Skeleton, Typography} from "@mui/material";
import axios from "../config/axiosConfig";
import React from "react";
import ErrorMessage from "../components/ErrorMessage";
import AuctionCard from "../components/AuctionCard";
import {rootUrl} from "../config/root";

const FALLBACK_IMAGE = "noImg.svg"

const AuctionPage = () => {
    const {id} = useParams();

    const [auction, setAuction] = React.useState<Auction | null>(null);
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
        innerContent = (
            <div>
                <Card>
                    <Box display="flex">
                        <Typography variant="h3" sx={{flexGrow: 1}}>{auction.title}</Typography>
                        <img src={imgSource} style={{maxHeight: "25rem", objectFit: "contain"
                        }} onError={() => {
                            setImgSource(FALLBACK_IMAGE);
                        }}/>
                    </Box>


                </Card>
                <AuctionCard item={auction} categories={categories} setSelectedCategories={()=>{}}/>
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