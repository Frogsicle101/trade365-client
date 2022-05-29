import {Card, Typography} from "@mui/material";

const Heading = (props: any) => {
    return (
        <Card sx={{marginY: 2}}>
            <Typography variant="h3" sx={{padding: 1}}>
                {props.children}
            </Typography>
        </Card>
    )
}
export default Heading;