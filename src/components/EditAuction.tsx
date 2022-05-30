import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import {FileUpload} from "./FileUpload";
import React from "react";
import ErrorMessage from "./ErrorMessage";
import dayjs from "dayjs";
import axios from "../config/axiosConfig";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker} from "@mui/x-date-pickers";
import {rootUrl} from "../config/root";

const EditAuction = (props: any) => {

    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [categories, setCategories] = React.useState<{[key:number]: string}>({});

    const [title, setTitle] = React.useState(props.auction.title || "");
    const [category, setCategory] = React.useState<number | string>(props.auction.categoryId || "");
    const [endDate, setEndDate] = React.useState<any>(props.auction.endDate || "");
    const [description, setDescription] = React.useState(props.description || "");
    const [reserve, setReserve] = React.useState<number | string>("");

    const [imageSource, setImageSource] = React.useState("");
    const [imageFile, setImageFile] = React.useState<File | null>(null);

    React.useEffect(() => {
        getCategories();
        if (props.hasImage) {
            setImageSource(rootUrl + "auctions/" + props.auction.auctionId + "/image")
        }
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

    const handleClose = () => {
        props.setDialogOpen(false);
    }

    const submitHandler = (event: any) => {
        event.preventDefault();

        if (imageSource === "") {
            setErrorFlag(true);
            setErrorMessage("You must upload an image");
        } else if (!endDate) {
            setErrorFlag(true);
            setErrorMessage("You must set a date");
        } else if (dayjs(endDate).isBefore(dayjs())) {
            setErrorFlag(true);
            setErrorMessage("The date must be in the future");
        } else {
            handleClose();
            props.submitCallback(title, category, reserve, endDate, description, imageFile);
        }


    }

    return (
        <div>
            <DialogTitle>{props.title}</DialogTitle>
            <form onSubmit={submitHandler}>
                <DialogContent>
                    <ErrorMessage flag={errorFlag} message={errorMessage}/>

                    <Stack direction="row" spacing={2}>
                        <Stack alignItems="center" width={500}>

                            <TextField
                                value={title}
                                label="Title"
                                onChange={
                                    event => {setTitle(event.target.value)}
                                }
                                margin="dense"
                                required
                                sx={{width: "100%"}}
                            />
                            <FormControl sx={{width: "100%"}} margin="dense" required>
                                <InputLabel id="categoryLabel">Category</InputLabel>
                                <Select
                                    labelId="categoryLabel"
                                    label="Category"
                                    value={category}
                                    onChange={(event) => setCategory(Number(event.target.value) || "")}
                                >
                                    {Object.keys(categories).map((key: string) => {
                                        const keyNum = Number(key);
                                        return (
                                            <MenuItem value={key}>{categories[keyNum]}</MenuItem>
                                        )
                                    })}

                                </Select>
                            </FormControl>
                            {!props.hideReserve && (
                                <TextField
                                    value={reserve}
                                    label="Reserve"
                                    onChange={event => setReserve(Number(event.target.value) || "")}
                                    type="number"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">$</InputAdornment>
                                        ),
                                        inputProps: {min: 1}
                                    }}
                                    margin="dense"
                                    sx={{width: "100%"}}
                                />
                            )}


                            <Box marginY={1} width="100%">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="End Date *"
                                        value={endDate}
                                        onChange={(newDate) => setEndDate(newDate)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <TextField
                                value={description}
                                label="Description"
                                onChange={
                                    event => {setDescription(event.target.value)}
                                }
                                margin="dense"
                                required
                                multiline
                                rows={3}
                                sx={{width: "100%"}}
                            />





                        </Stack>
                        <FileUpload
                            imageSource={imageSource} setImageSource={setImageSource}
                            setImageFile={setImageFile}
                        />
                    </Stack>



                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Submit
                    </Button>
                </DialogActions>

            </form>

        </div>
    )
}

export default EditAuction;