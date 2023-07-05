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
  Paper,
  ListItemText,
  Alert,
} from "@mui/material";
import { ARTIST, ARTIST_ID, DELETE_ARTIST } from "../../gql/artist";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { DELETE_IMAGE } from "../../gql/image";
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

const Artist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data } = useQuery(ARTIST_ID, { variables: { id: id } });

  const [delete_artist] = useMutation(DELETE_ARTIST, {
    onError: (error) => {
      alert("delete error");
    },
    onCompleted: (data) => {
      alert("artist had been deleted");
    },
    refetchQueries: [ARTIST],
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
    await delete_artist({ variables: { id: id } });
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
          <Link to="/artist" className="dashboard">
            Artist
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h6" component="h2" sx={{ m: 3, color: "black" }}>
        Artist Details
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
              image={data.artist_by_pk.artist_profile_image_url}
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

          <CardActions
            sx={{
              display: "flex",
              mt: "2rem",
            }}
          >
            <ListItem sx={{ width: "600px" }}>
              <ListItemText
                primary="ID"
                secondary={data.artist_by_pk.id}
              ></ListItemText>
            </ListItem>

            <ListItem>
              <ListItemText
                primary="Artist Name"
                secondary={data.artist_by_pk.artist_name}
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="User Phone"
                secondary={data.artist_by_pk?.artist_user?.phone}
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Year Born"
                secondary={data.artist_by_pk.year_born}
              ></ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Year Died"
                secondary={data.artist_by_pk.year_died}
              ></ListItemText>
            </ListItem>
          </CardActions>
          <Box
            display="grid"
            // gridTemplateColumns="50% 50%"
            columnGap="1rem"
            mx="2rem"
          >
            <Box>
              <Typography display="flex" justifyContent="center" mt="2rem">
                Biography Eng
              </Typography>

              <Box sx={{ mt: "1rem", bgcolor: "#f8f9fa" }}>
                <div
                  style={{ color: "#495057", padding: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: data.artist_by_pk.biography,
                  }}
                ></div>
              </Box>
            </Box>
            <Box>
              <Typography display="flex" justifyContent="center" mt="2rem">
                Biography MM
              </Typography>

              <Box sx={{ mt: "1rem", bgcolor: "#f8f9fa" }}>
                <div
                  style={{ color: "#495057", padding: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html: data.artist_by_pk.biography_mm,
                  }}
                ></div>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <Box display="flex" justifyContent="end" columnGap="3rem" m="2rem">
          <Button
            variant="contained"
            onClick={() => navigate(`/update_artist/${data.artist_by_pk.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveOpen(data.artist_by_pk)}
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
export default Artist;
