import Header from "../components/Header";
import {
    Avatar,
    Box,
    Card,
    Chip,
    Container, FormControl,
    Grid, InputLabel,
    MenuItem,
    OutlinedInput, Pagination,
    Select,
    Stack,
    Typography
} from "@mui/material";

import FilterIcon from '@mui/icons-material/FilterAlt';
import React from "react";
import axios from "../config/axiosConfig";
import ErrorMessage from "../components/ErrorMessage";
import AuctionCard from "../components/AuctionCard";
import qs from "qs";
import {useSearchStore} from "../store";

const ITEMS_PER_PAGE = 6;

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

    const statuses = ["All", "Open", "Closed"];
    const sorts = [
        "A-Z", "Z-A",
        "Lowest bid", "Highest bid",
        "Lowest reserve", "Highest reserve",
        "Closing soon", "Closing last"
    ]

    return (
        <Card sx={{padding: 1}}>
            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={props.selected}
                    input={<OutlinedInput label="Category"/>}
                    onChange={event => props.setSelected(event.target.value)}
                    MenuProps={MenuProps}
                    multiple
                >
                    {props.categoryList.map((item: number) => {
                        return(
                            <MenuItem key={item} value={item}>
                                {props.categories[item]}
                            </MenuItem>
                    )})}
                </Select>
            </FormControl>

            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    labelId="status-label"
                    value={props.status}
                    input={<OutlinedInput label="Status"/>}
                    onChange={event => props.setStatus(event.target.value)}
                    MenuProps={MenuProps}
                >
                    {statuses.map((item) => {
                        return(
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        )})}
                </Select>
            </FormControl>

            <FormControl sx={{m: 1, width: 300}}>
                <InputLabel id="sort-label">Sort</InputLabel>
                <Select
                    labelId="sort-label"
                    value={props.sort}
                    input={<OutlinedInput label="Sort"/>}
                    onChange={event => props.setSort(event.target.value)}
                    MenuProps={MenuProps}
                >
                    {sorts.map((item) => {
                        return(
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        )})}
                </Select>
            </FormControl>

        </Card>
    )


}

const calculateTimeTo = (endDateString: string) => {
    const now = new Date();
    const endDate = new Date(endDateString);

    return endDate.getTime() - now.getTime();
}

const filterAuctionStatus = (auctions: Auction[], state: string) => {
    if (state === "Open") {
        return auctions.filter(auction => calculateTimeTo(auction.endDate) > 0)
    } else if (state === "Closed") {
        return auctions.filter(auction => calculateTimeTo(auction.endDate) <= 0)
    } else {
        return auctions;
    }

}


const statusTextToParam = (text: string) => {
    const statuses: {[key: string]: string} = {
        "All": "ANY",
        "Open": "OPEN",
        "Closed": "CLOSED"
    }
    return statuses[text];
}

const sortTextToParam = (text: string) => {
    const sorts: {[key: string]: string} = {
        "A-Z": "ALPHABETICAL_ASC",
        "Z-A": "ALPHABETICAL_DESC",
        "Lowest bid": "BIDS_ASC",
        "Highest bid": "BIDS_DESC",
        "Lowest reserve": "RESERVE_ASC",
        "Highest reserve": "RESERVE_DESC",
        "Closing soon": "CLOSING_SOON",
        "Closing last": "CLOSING_LAST"
    };
    return sorts[text];

}

const Auctions = () => {

    const [auctions, setAuctions] = React.useState<Auction[]>([]);
    const [categories, setCategories] = React.useState<{[key:number]: string}>({})
    const [categoryList, setCategoryList] = React.useState<number[]>([]);

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const searchText = useSearchStore(state => state.searchText);
    const setSearchText = useSearchStore(state => state.setSearchText);

    const [selectedCategories, setSelectedCategories] = React.useState([]);

    const [status, setStatus] = React.useState("All");
    const [sort, setSort] = React.useState("Closing soon");

    const [numPages, setNumPages] = React.useState(1);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        getAuctions();
        getCategories();
    }, [selectedCategories, searchText, status, sort, page])

    const getAuctions = () => {
        axios.get("auctions", {
            params: {
                q: searchText,
                categoryIds: selectedCategories,
                sortBy: sortTextToParam(sort),
                status: statusTextToParam(status),
                startIndex: (page - 1) * ITEMS_PER_PAGE,
                count: ITEMS_PER_PAGE
            }
        })
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setAuctions(response.data.auctions);

                setNumPages(Math.ceil(response.data.count / ITEMS_PER_PAGE));
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
                    <AuctionCard item={item} cardHeight={cardHeight} categories={categories}
                    setSelectedCategories={setSelectedCategories}/>
                </Grid>
            )
        }

        )
    }


    return (
        <div>
            <Header/>
            <Container sx={{display: "flex", flexDirection: "column"}}>
                <ErrorMessage flag={errorFlag} message={errorMessage}/>

                <FilterCard
                    selected={selectedCategories} setSelected={setSelectedCategories}
                    categoryList={categoryList} categories={categories}
                    status={status} setStatus={setStatus}
                    sort={sort} setSort={setSort}
                />

                <Grid container spacing={2} sx={{marginTop: 2, flexGrow: 1}}>
                    {list_of_auctions()}
                </Grid>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    padding={1}
                >
                    <Pagination size="large" count={numPages} page={page} onChange={
                        (event, value) => {
                            setPage(value)
                        }
                    } showFirstButton showLastButton/>
                </Box>


            </Container>

        </div>


    )
}

export default Auctions;