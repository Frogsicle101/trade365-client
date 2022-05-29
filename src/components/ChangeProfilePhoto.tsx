import {Button, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {FileUpload} from "./FileUpload";
import React from "react";
import axios from "../config/axiosConfig";
import {useUserStore} from "../store";


export const uploadImage = (userId: number, imageFile: File) => {

    return new Promise<void>(resolve => {
        axios.put("users/" + userId + "/image", imageFile, {
            headers: {
                'Content-Type': imageFile.type
            }
        }).then(() => resolve())

    })
}

const initialImageSource = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

const ChangeProfilePhoto = (props: any) => {

    const [imageSource, setImageSource] = React.useState(initialImageSource);
    const [imageFile, setImageFile] = React.useState<File | null>(null);

    const user = useUserStore(state => state.user)

    const handleClose = () => {
        props.setDialogOpen(false);
        props.updateCallback();
    }

    const handleSubmit = () => {
        if (user && imageFile) {
            uploadImage(user.userId, imageFile).then(() => handleClose());
        }

    }

    return (
        <div>
            <DialogTitle>Upload a new profile photo</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <FileUpload
                        imageSource={imageSource} setImageSource={setImageSource}
                        setImageFile={setImageFile}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Register
                    </Button>
                </DialogActions>
            </form>

        </div>
    )
}

export default ChangeProfilePhoto;