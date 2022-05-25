import Header from "../components/Header";
import {
    Avatar,
    Box,
    Card,
    Chip,
    Container, FormControl,
    Grid, InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    Typography
} from "@mui/material";
import React from "react";
import axios from "../config/axiosConfig";
import ErrorMessage from "../components/ErrorMessage";
import AuctionCard from "../components/AuctionCard";

function FilterCard(props: any) {

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    const handleChange = ((event: any) => {
        props.setSelected(event.target.value);
    })

    return (
        <Card>

            <Typography variant="h6">Filter</Typography>
            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select labelId="category-label" value={props.selected} input={<OutlinedInput label="Category"/>} onChange={handleChange} multiple MenuProps={MenuProps}>
                    {props.categoryList.map((item: number) => {
                        return(
                            <MenuItem key={item} value={item}>
                                {props.categories[item]}
                            </MenuItem>
                    )})}
                </Select>
            </FormControl>

        </Card>
    )


}

const Auctions = () => {

    const [auctions, setAuctions] = React.useState([]);
    const [categories, setCategories] = React.useState<{[key:number]: string}>({})
    const [categoryList, setCategoryList] = React.useState<number[]>([]);

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [searchText, setSearchText] = React.useState<string>("");

    const [selectedCategories, setSelectedCategories] = React.useState([]);

    React.useEffect(() => {
        getAuctions();
        getCategories();
    }, [])

    const getAuctions = () => {
        axios.get(`auctions?q=${searchText}`)
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
                let categoryList: number[] = [];
                for (const category of response.data) {
                    categoryList.push(parseInt(category.categoryId));
                    categoryDict[category.categoryId as keyof Object] = category.name
                }

                setCategories(categoryDict);
                setCategoryList(categoryList);
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }


    const list_of_auctions = () => {
        return auctions.map((item: Auction) => {
            const cardHeight = "15rem";
            return (
                <Grid item xs={12} xl={6} key={item.auctionId}>
                    <AuctionCard item={item} cardHeight={cardHeight} categories={categories}/>
                </Grid>
            )
        }

        )
    }


    return (
        <div>
            <Header searchText={searchText} setSearchText={setSearchText} searchCallback={getAuctions}/>
            <Container sx={{justifyContent: "center"}}>
                <ErrorMessage flag={errorFlag} message={errorMessage}/>

                <FilterCard selected={selectedCategories} setSelected={setSelectedCategories} categoryList={categoryList} categories={categories}/>

                <Grid container spacing={2} sx={{marginTop: 2}}>
                    {list_of_auctions()}
                </Grid>

            </Container>

        </div>


    )
}

export default Auctions;