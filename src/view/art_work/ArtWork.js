import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  Breadcrumbs,
  CardContent,
  CardMedia,
  Card,
  CardActions,
  ListItem,
  ListItemText,
  Alert,
  Paper,
} from "@mui/material";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { DELETE_IMAGE } from "../../gql/image";
import { ARTIST_ID } from "../../gql/artist";
import { ARTWORK_ID, DELETE_ARTWORK, ARTWORKS } from "../../gql/artwork";
const styleR = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 20,
  borderRadius: 1,
  p: 4,
};

const ArtWork = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = useQuery(ARTWORK_ID, { variables: { id: id } });

  const [delete_artwork] = useMutation(DELETE_ARTWORK, {
    onError: (error) => {
      alert("delete error");
    },
    onCompleted: (data) => {
      alert("Artwork has been deleted");
    },
    refetchQueries: [ARTWORKS],
  });

  // const [deleteImage] = useMutation(DELETE_IMAGE, {
  //   onError: (error) => {
  //     console.log("error : ", error);
  //   },
  //   onCompleted: () => {
  //     navigate("/artist");
  //   },
  // });

  const handleRemove = async () => {
    // let image_url = data.artist_by_pk.artist_profile_image_url;
    // console.log("image url", image_url);
    // let image_name = image_url.substring(
    //   image_url.lastIndexOf("/") + 1,
    //   image_url.lenght
    // );
    // await deleteImage({ variables: { image_name: image_name } });
    await delete_artwork({ variables: { id: id } });
    navigate(-1);
  };

  const handleCloseR = () => setOpen(false);
  const handleRemoveOpen = (row) => {
    setOpen(true);
  };

  if (!data) {
    return "no data";
  }

  return (
    <>
      <div role="presentation" className="align">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/art_work" className="dashboard">
            Artwork
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h6" component="h2" sx={{ m: 3, color: "black" }}>
        Artwork Details
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              maxWidth: "40%",
              display: "grid",
              justifyContent: "center",
              margin: "auto",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              height="320"
              image={data.traditional_art_work_by_pk.artwork_image_url}
              sx={{ my: 2 }}
            />
          </Box>
          <Typography
            variant="p"
            fontSize="12px"
            mt="0.5rem"
            color="blue"
            display="flex"
            justifyContent="center"
          >
            Artwork Image
          </Typography>
          <Paper sx={{ p: "2rem", m: "2rem" }}>
            <CardActions
              sx={{
                display: "flex",
                // justifyContent: "center",
              }}
            >
              <Box display="grid" rowGap="1rem">
                <ListItem sx={{ width: "600px" }}>
                  <ListItemText
                    primary="ID"
                    secondary={data.traditional_art_work_by_pk.id}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Artwork Name"
                    secondary={data.traditional_art_work_by_pk.artwork_name}
                  ></ListItemText>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary="Artwork Type"
                    secondary={
                      data.traditional_art_work_by_pk
                        .traditional_art_work_artwork_medium_type?.medium_name
                    }
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Artwork Year"
                    secondary={data.traditional_art_work_by_pk.artwork_year}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Art Series"
                    // secondary={data.traditional_art_work_by_pk.artwork_year}
                  ></ListItemText>
                </ListItem>
              </Box>

              <Box display="grid" rowGap="1rem">
                <ListItem>
                  <ListItemText
                    primary="Artist Name"
                    secondary={
                      data.traditional_art_work_by_pk
                        .traditional_art_work_artist?.artist_name
                    }
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Dimensions"
                    secondary={`${data.traditional_art_work_by_pk.height}${data.traditional_art_work_by_pk.traditional_artwork_dimension?.dimension_name} × ${data.traditional_art_work_by_pk.width}${data.traditional_art_work_by_pk.traditional_artwork_dimension?.dimension_name}`}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Pending"
                    secondary={data.traditional_art_work_by_pk.pending}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Current Price"
                    secondary={data.traditional_art_work_by_pk.current_price}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Update Price"
                    secondary={data.traditional_art_work_by_pk.update_price}
                  ></ListItemText>
                </ListItem>
              </Box>
            </CardActions>

            <Box
              display="grid"
              gridTemplateColumns="50% 50%"
              columnGap="1rem"
              mx="2rem"
            >
              <Box>
                <Typography display="flex" justifyContent="center" mt="2rem">
                  Description Eng
                </Typography>

                <Box sx={{ mt: "1rem", bgcolor: "#f8f9fa" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.traditional_art_work_by_pk.description,
                    }}
                  ></div>
                </Box>
              </Box>
              <Box>
                <Typography display="flex" justifyContent="center" mt="2rem">
                  Description MM
                </Typography>

                <Box sx={{ mt: "1rem", bgcolor: "#f8f9fa" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.traditional_art_work_by_pk.description,
                    }}
                  ></div>
                </Box>
              </Box>
            </Box>
          </Paper>
        </CardContent>
        <Box display="flex" justifyContent="end" columnGap="3rem" m="2rem">
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/update_artwork/${data.traditional_art_work_by_pk.id}`)
            }
            // to={`/art_work/${data.traditional_art_work_by_pk.id}`}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveOpen(data.traditional_art_work_by_pk)}
          >
            Remove
          </Button>
        </Box>
      </Card>
      <Modal
        keepMounted
        open={open}
        onClose={handleCloseR}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styleR}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
            Are you sure want to remove it?
          </Typography>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button color="secondary" onClick={handleCloseR}>
              Cancel
            </Button>
            <Button loading={loading} onClick={handleRemove}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default ArtWork;
