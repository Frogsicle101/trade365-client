import {Card, Stack, Typography} from "@mui/material"
import axios from "../config/axiosConfig";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import AuctionCard from "./AuctionCard";


const SimilarAuctions = (props: any) => {

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [categories, setCategories] = React.useState<{[key:number]: string}>({});

    const [sameCategoryAuctions, setSameCategoryAuctions] = React.useState<Auction[]>([]);
    const [sameSellerAuctions, setSameSellerAuctions] = React.useState<Auction[]>([]);


    React.useEffect(() => {
        getAuctions([props.categoryId], props.sellerId);
        getCategories();
    }, []);


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

    const getAuctions = (selectedCategories: number[], sellerId: number) => {
        axios.get("auctions", {
            params: {
                categoryIds: selectedCategories
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setSameCategoryAuctions(response.data.auctions);

            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })

        axios.get("auctions", {
            params: {
                sellerId: sellerId
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setSameSellerAuctions(response.data.auctions);

            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    }

    const sidewaysList = (auctions: Auction[]) => {
        return (
            <Stack direction="row" spacing={2} sx={{marginY: 2, width: "100%", overflow: "auto"}}>
                {auctions.map(item => (
                    <AuctionCard item={item} cardHeight="15rem" categories={categories}
                                 setSelectedCategories={()=>{}}/>
                ))}
            </Stack>
        )
    }



    return (
        <div>
            <Card>
                <ErrorMessage flag={errorFlag} message={errorMessage}/>
                <Typography variant="h5">
                    Similar Auctions
                </Typography>
            </Card>
            {sidewaysList(sameCategoryAuctions)}
            <Card>
                <ErrorMessage flag={errorFlag} message={errorMessage}/>
                <Typography variant="h5">
                    {"More from " + props.sellerName}
                </Typography>
            </Card>
            {sidewaysList(sameSellerAuctions)}
        </div>



    )
}

export default SimilarAuctions;