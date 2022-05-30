import {Dialog, Fab, Grid, Typography} from "@mui/material";
import Heading from "./Heading";
import AuctionCard from "./AuctionCard";
import React from "react";
import axios from "../config/axiosConfig";
import ErrorMessage from "./ErrorMessage";
import AddIcon from '@mui/icons-material/Add';
import EditAuction from "./EditAuction";
import dayjs from "dayjs";

const MyAuctions = (props: any) => {

    const [sellerAuctions, setSellerAuctions] = React.useState<Auction[]>([]);
    const [bidderAuctions, setBidderAuctions] = React.useState<Auction[]>([]);

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [categories, setCategories] = React.useState({});

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [state, setState] = React.useState(0);

    const user = props.user;

    React.useEffect(() => {
        getAuctions();
        getCategories();
    }, [state])

    const getAuctions = () => {
        axios.get("auctions", {
            params: {
                sellerId: user.userId
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setSellerAuctions(response.data.auctions);

            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })

        axios.get("auctions", {
            params: {
                bidderId: user.userId
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setBidderAuctions(response.data.auctions);

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

    const handleNewAuction = (
        title: string, category: number,
        reserve: number | string, endDate: Date,
        description: string, imageFile: any) => {

        const stringDay = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss.SSS")
        axios.post("auctions", {
            title: title,
            description: description,
            categoryId: category,
            endDate: stringDay,
            reserve: reserve !== "" ? reserve : 1
        }).then((response) => {
            axios.put("auctions/" + response.data.auctionId + "/image", imageFile, {
                headers: {
                    'Content-Type': imageFile.type
                }}).then()
        })
    }

    const listAuctions = (auctions: Auction[]) => {

        if (auctions.length === 0) {
            return <Typography variant="subtitle1">
                No auctions to display
            </Typography>
        }

        return (
            <Grid container spacing={2}>
                {auctions.map((item: Auction) => {
                    const cardHeight = "15rem";
                    return (
                        <Grid item xs={12} xl={6} key={item.auctionId}>
                            <AuctionCard item={item} cardHeight={cardHeight} categories={categories}
                                         setSelectedCategories={()=>{}} updateCallback={() => setState(state => state + 1)}/>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }


    return (
        <div>
            <Heading>My Auctions</Heading>
            <ErrorMessage flag={errorFlag} message={errorMessage}/>

            {listAuctions(sellerAuctions)}

            <Heading>Bids</Heading>
            {listAuctions(bidderAuctions)}

            <Fab variant="extended" color="primary" sx={{position: "fixed", bottom: 25, right: 25}}
                 onClick={() => setDialogOpen(true)}>
                <AddIcon/>
                Create new auction
            </Fab>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <EditAuction title="Create a new auction" setDialogOpen={setDialogOpen} submitCallback={handleNewAuction}/>
            </Dialog>

        </div>
    )
}

export default MyAuctions;