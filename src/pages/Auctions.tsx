import Header from "../components/Header";
import {Avatar, Box, Card, Chip, Container, Grid, Stack} from "@mui/material";
import React from "react";
import axios from "../config/axiosConfig";

const computeClosingTime = (endDateString: string) => {
    let now = new Date();
    let endDate = new Date(endDateString);

    let elapsed = endDate.getTime() - now.getTime();
    let days = Math.floor(elapsed / (1000 * 60 * 60 * 24))

    if (days === 0) {
        return "Closing today";
    } else if (days === 1) {
        return "Closing tomorrow"
    } else {
        return "Closing in " + days + " days";
    }






}


const Auctions = () => {

    const [auctions, setAuctions] = React.useState([]);
    const [categories, setCategories] = React.useState<{[key:number]: string}>({})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        getAuctions();
        getCategories();
    }, [])

    const getAuctions = () => {
        axios.get('auctions')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
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


    const list_of_auctions = () => {
        return auctions.map((item: Auction) => {
            const sellerName = item.sellerFirstName + " " + item.sellerLastName;
            const cardHeight = "15rem";
            return (
                <Grid item xs={12} xl={6}>
                    <Card key={item.auctionId} sx={{height: cardHeight, maxWidth: "600px"}}>
                        <Grid container spacing={0}>
                            <Grid item xs={6} sx={{justifyContent: "center"}}>
                                <h2>{item.title}</h2>
                                <Box sx={{width: "90%", border: 1, borderRadius: "1rem", margin: "5px"}}>
                                    <Stack direction="row" sx={{justifyContent: "center"}}>
                                        <p>{sellerName}</p>
                                        <Avatar src={"http://localhost:4941/api/v1/users/" + item.sellerId + "/image"} sx={{margin: "5px"}}>
                                            {item.sellerFirstName[0] + item.sellerLastName[0]}
                                        </Avatar>
                                    </Stack>
                                </Box>



                                <p>{computeClosingTime(item.endDate)}</p>
                                <Chip label={categories[item.categoryId]} sx={{margin: "1rem"}}/>
                            </Grid>
                            <Grid item xs={6}>
                                <img src={"http://localhost:4941/api/v1/auctions/" + item.auctionId + "/image"} style={{
                                    objectFit: "cover", width: cardHeight, height: cardHeight, float: "right"
                                }}/>
                            </Grid>

                        </Grid>
                    </Card>
                </Grid>






            )
        }

        )
    }


    return (
        <div>
            <Header/>
            <Container sx={{justifyContent: "center"}}>
                <Grid container spacing={2} sx={{margin: "auto"}}>
                    {list_of_auctions()}
                </Grid>

            </Container>

        </div>


    )
}

export default Auctions;