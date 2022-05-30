import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import React from "react";
import {rootUrl} from "../config/root";
import {useUserStore} from "../store";
import axios from "../config/axiosConfig";
import EditAuction from "./EditAuction";
import dayjs from "dayjs";
import Closing from "./Closing";

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
    const user = useUserStore(state => state.user);

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [description, setDescription] = React.useState("");

    const sellerName = item.sellerFirstName + " " + item.sellerLastName;


    const bidPrice = item.highestBid !== null ? "$" + item.highestBid: "No bids";
    const reserve = "Reserve: $" + item.reserve + " (" + ((item.reserve > item.highestBid) ? "unmet" : "met") + ")";



    const handleEdit = (
        title: string, category: number,
        reserve: number | string, endDate: Date,
        description: string, imageFile: any) => {

        const stringDay = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss.SSS")
        axios.patch("auctions/" + item.auctionId, {
            title: title,
            description: description,
            categoryId: category,
            endDate: stringDay,
            reserve: reserve !== "" ? reserve : 1
        }).then((response) => {
            if (imageFile) {
                axios.put("auctions/" + item.auctionId + "/image", imageFile, {
                    headers: {
                        'Content-Type': imageFile.type
                    }}).then(props.updateCallback)
            } else {
                props.updateCallback();
            }

        })
    }


    const getAuction = () => {
        axios.get("auctions/" + item.auctionId)
            .then((response) => {
                setDescription(response.data.description)
            })
    }

    const deleteAuction = () => {
        axios.delete("auctions/" + item.auctionId).then(() => {
            props.updateCallback();
            setDeleteDialogOpen(false);

        })
    }

    const sellerButtons = () => {
        if (user && user.userId === item.sellerId) {
            return (
                <div>
                    <Tooltip title={!item.highestBid ? "" : "You cannot edit this auction because it has been bid on"} arrow>
                        <div>
                            <Button disabled={item.highestBid} onClick={() => setEditDialogOpen(true)}>
                                Edit
                            </Button>
                            <Button disabled={item.highestBid} onClick={() => setDeleteDialogOpen(true)}>
                                Delete
                            </Button>
                        </div>
                    </Tooltip>
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete {item.title}?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={deleteAuction}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <EditAuction
                            title="Edit Auction"
                            setDialogOpen={setEditDialogOpen}
                            auction={item}
                            description={description}
                            hasImage={true}
                            hideReserve={true}

                            submitCallback={handleEdit}
                        />
                    </Dialog>

                </div>
            )
        }
    }

    React.useEffect(() => {
        getAuction();
    }, [getAuction]);


    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Card sx={{height: cardHeight, width: "400px", flex: 1}}>
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




                            <Closing endDate={item.endDate}/>

                        {sellerButtons()}
                        <Chip
                            label={categories[item.categoryId]} sx={{margin: "1rem"}}
                            onClick={() => {
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
                            alt=""/>

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