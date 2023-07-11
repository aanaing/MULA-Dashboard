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
import {
  ARTWORK_ID,
  DELETE_ARTWORK,
  ARTWORKS,
  PENDING_STATUS,
} from "../../gql/artwork";
import {
  All_DIGITAL_ARTWORKS,
  DELETE_DIGITAL_ARTWORK,
  DIGITAL_ARTWORK_ID,
} from "../../gql/digitalArtwork";
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

const DigitalArtwork = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data } = useQuery(DIGITAL_ARTWORK_ID, { variables: { id: id } });

  const [delete_artwork] = useMutation(DELETE_DIGITAL_ARTWORK, {
    onError: (error) => {
      alert("delete error");
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("Digital_artwork has been deleted");
      setLoading(false);
      navigate("/digital_artwork");
    },
    refetchQueries: [All_DIGITAL_ARTWORKS],
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
    },
  });

  const handleRemove = async () => {
    let image_url = data.digital_art_work_by_pk.artwork_image_url;
    console.log("image url", image_url);
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.lenght
    );
    await deleteImage({ variables: { image_name: image_name } });
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
  console.log("data", data);
  return (
    <>
      <div role="presentation" className="align">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/art_work" className="dashboard">
            Digital Artwork
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h6" component="h2" sx={{ m: 3, color: "black" }}>
        Digital Artwork Details
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              width: "100%",
              height: "300px",
              display: "grid",
              justifyContent: "center",
              // p: "2rem",
              margin: "auto",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <CardMedia
              component="img"
              height="300px"
              image={data.digital_art_work_by_pk.artwork_image_url}
            />
          </Box>
          {/* <Typography
            variant="p"
            fontSize="12px"
            mt="0.5rem"
            color="blue"
            display="flex"
            justifyContent="center"
          >
            Artwork Image
          </Typography> */}
          <Box sx={{ p: "2rem" }}>
            <CardActions
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                gap: "2rem",

                // justifyContent: "center",
              }}
            >
              {/* <Box display="grid" rowGap="1rem"> */}
              <ListItem>
                <ListItemText
                  primary="ID"
                  secondary={data.digital_art_work_by_pk.id}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Artwork Name"
                  secondary={data.digital_art_work_by_pk.artwork_name}
                ></ListItemText>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Artwork Year"
                  secondary={data.digital_art_work_by_pk.artwork_year}
                ></ListItemText>
              </ListItem>

              {/* </Box> */}

              {/* <Box display="grid" rowGap="1rem"> */}
              <ListItem>
                <ListItemText
                  primary="Artist Name"
                  secondary={
                    data.digital_art_work_by_pk.digital_art_work_artist
                      ?.artist_name
                  }
                ></ListItemText>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Pending"
                  secondary={
                    data.digital_art_work_by_pk.pending === true
                      ? "Approve"
                      : "Pending"
                  }
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Current Price"
                  secondary={data.digital_art_work_by_pk.current_price}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Update Price"
                  secondary={data.digital_art_work_by_pk.update_price}
                ></ListItemText>
              </ListItem>
              {/* </Box> */}
            </CardActions>

            {/* <Box
              display="grid"
              // gridTemplateColumns="50% 50%"
              columnGap="1rem"
              mx="2rem"
            >
              <Box>
                <Typography display="flex" justifyContent="center" mt="2rem">
                  Description Eng
                </Typography>

                <Box sx={{ mt: "1rem", bgcolor: "#f8f9fa" }}>
                  <div
                    style={{ color: "#495057", padding: "1rem" }}
                    dangerouslySetInnerHTML={{
                      __html: data.digital_art_work_by_pk.description,
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
                    style={{ color: "#495057", padding: "1rem" }}
                    dangerouslySetInnerHTML={{
                      __html: data.traditional_art_work_by_pk.description_mm,
                    }}
                  ></div>
                </Box>
              </Box>
            </Box> */}
          </Box>
        </CardContent>
        <Box display="flex" justifyContent="space-between" m="2rem">
          {/* <Box>
            {data.traditional_art_work_by_pk.pending ? (
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  pending_status({
                    variables: {
                      id: data.traditional_art_work_by_pk.id,
                      pending: false,
                    },
                  })
                }
              >
                Approve
              </Button>
            ) : (
              <Button
                variant="contained"
                color="warning"
                onClick={() =>
                  pending_status({
                    variables: {
                      id: data.traditional_art_work_by_pk.id,
                      pending: true,
                    },
                  })
                }
              >
                Pending
              </Button>
            )}
          </Box> */}

          <Box>
            <Button
              sx={{ mr: "2rem" }}
              variant="contained"
              onClick={() =>
                navigate(
                  `/update_digital_artwork/${data.digital_art_work_by_pk.id}`
                )
              }
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveOpen(data.digital_art_work_by_pk.id)}
            >
              Remove
            </Button>
          </Box>
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
export default DigitalArtwork;
