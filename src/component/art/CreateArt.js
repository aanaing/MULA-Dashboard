import Typography from "@mui/material/Typography";
import {Avatar, Button, Card, CardContent, CardMedia, Modal, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import {ModalStyled, useStyles} from "../../utils/art";
import cancelIcon from "../../assets/icons/cancel.png";

const CreateArt = ({showCreate, createHandle}) => {
    const classes = useStyles();

    return(
        <Modal open={showCreate} aria-labelledby="parent-modal-title" aria-describedby="parent-modal-description">
            <Box role="presentation" sx={{...ModalStyled, p: 2}}>
                <div style={{ display: "flex", justifyContent: "space-between", px: 6, marginBottom: "10px"}}>
                    <Typography fontWeight="bold" variant="h6">Create Art</Typography>
                    <Avatar sx={{ cursor: "pointer" }} src={cancelIcon} onClick={createHandle} alt="cancel Icon" />
                </div>

                <Card>
                    <CardContent sx={{ p: 3, display: "flex" }} elevation={4}>
                        <Box>
                            <CardMedia image="https://e0.pxfuel.com/wallpapers/252/509/desktop-wallpaper-mui-goku-goku-mui-punch.jpg" className={classes.cardImage} component="img"></CardMedia>
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: "300px 300px 300px", gap: 2}}>
                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField variant="filled" id="painting_name" label="Painting Name"/>
                            </FormControl>

                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField type="file" variant="filled" id="painting_image_url" label="Painting Image" InputLabelProps={{ shrink: true }}/>
                            </FormControl>

                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField variant="filled" id="painting_year" label="Painting Year"/>
                            </FormControl>

                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField variant="filled" id="painting_type" label="Painting Type"/>
                            </FormControl>

                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField variant="filled" id="dimensions" label="Dimension"/>
                            </FormControl>

                            <FormControl sx={{ mx: 3, my: 1, minWidth: "300px"}}>
                                <TextField variant="filled" id="current_price" label="Price"/>
                            </FormControl>
                        </Box>
                    </CardContent>

                    <Box sx={{ display: "flex", justifyContent: "end", marginRight: "40px", marginBottom: "20px"}}>
                        <Button variant="contained" color="primary" sx={{ px: 3, py: 1 }}>Create</Button>
                    </Box>
                </Card>
            </Box>
        </Modal>
    )
};

export default CreateArt;