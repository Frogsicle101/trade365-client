import React from "react";

const FileUpload = (props: any) => {


    const handleFileUpload = (event: any) => {
        if (event.target.files && event.target.files[0]) {

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result) {
                    props.setImageSource(reader.result as string);

                }

            }

            reader.readAsDataURL(event.target.files[0]);
            props.setImageFile(event.target.files[0]);
        }
    }

    return (
        <div>
            <img src={props.imageSource} width="100%" alt="Profile image preview"/>

            <input className="mt-1" type="file" accept="image/jpeg, image/png, image/gif" onChange={
               handleFileUpload
            }/>
        </div>
    )
}

export {FileUpload}