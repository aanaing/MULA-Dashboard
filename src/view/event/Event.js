import { useMutation, useQuery } from "@apollo/client";
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
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DELETE_EVENT, ONE_EVENT } from "../../gql/event";
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

const Event = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { data } = useQuery(ONE_EVENT, { variables: { id: id } });

  const [delete_event] = useMutation(DELETE_EVENT, {
    onError: (err) => {
      alert("Delete Error");
      console.log("error", err);
      setLoading(false);
    },
    onCompleted: (data) => {
      alert("Event has been removed");
    },
  });

  const handleRemove = async () => {
    // let image_url = data.artist_by_pk.artist_profile_image_url;
    // console.log("image url", image_url);
    // let image_name = image_url.substring(
    //   image_url.lastIndexOf("/") + 1,
    //   image_url.lenght
    // );
    // await deleteImage({ variables: { image_name: image_name } });
    await delete_event({ variables: { id: id } });
    navigate(-1);
  };
  const handleCloseR = () => setOpen(false);
  const handleRemoveOpen = (row) => {
    setOpen(true);
  };
  if (!data) {
    return;
  }

  return (
    <>
      <div role="presentation" className="align">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/event" className="dashboard">
            Event
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h6" component="h2" sx={{ m: 2, color: "black" }}>
        Event Details
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
              image={data.event_by_pk.event_thumbnail_url}
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
            Event Image
          </Typography>

          <Paper sx={{ p: "2rem" }}>
            <CardActions
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                gap: "2rem",
              }}
            >
              <ListItem>
                <ListItemText
                  primary="ID"
                  secondary={data.event_by_pk.id}
                ></ListItemText>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Event Name Eng"
                  secondary={data.event_by_pk.event_name}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Event Name MM"
                  secondary={data.event_by_pk.event_name_mm}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Date"
                  secondary={data.event_by_pk.event_date_time}
                ></ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Location"
                  secondary={data.event_by_pk.event_location}
                ></ListItemText>
              </ListItem>
            </CardActions>
            <Box
              display="grid"
              // gridTemplateColumns="50% 50%"
              // columnGap="1rem"
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
                      __html: data.event_by_pk.event_description,
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
                      __html: data.event_by_pk.event_description_mm,
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
            onClick={() => navigate(`/update_event/${data.event_by_pk.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveOpen(data.event_by_pk)}
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
export default Event;
