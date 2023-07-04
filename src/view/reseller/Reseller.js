import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Breadcrumbs,
  CardContent,
  ListItem,
  Card,
  Grid,
  Paper,
  ListItemText,
  Box,
  CardActions,
  Button,
  Modal,
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_RESELLER, DELETE_RESELLER, RESELLER_ID } from "../../gql/reseller";
import { useState } from "react";

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

const Reseller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data } = useQuery(RESELLER_ID, { variables: { id: id } });

  const [delete_reseller] = useMutation(DELETE_RESELLER, {
    onError: (err) => {
      alert("Delete Error");
      console.log("delete Error", err);
    },
    onCompleted: (result) => {
      alert("Reseller user has been deleted");
      navigate(-1);
    },
    refetchQueries: [ALL_RESELLER],
  });

  const handleCloseR = () => setOpen(false);
  const handleRemoveOpen = (row) => {
    setOpen(true);
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    await delete_reseller({ variables: { id: id } });
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
          <Link to="/reseller" className="dashboard">
            Reseller
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h6" component="h2" sx={{ m: 3, color: "black" }}>
        Reseller Details
      </Typography>

      <Card>
        <CardContent>
          <CardActions>
            <Box sx={{ display: "grid", margin: "auto", rowGap: "3rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <ListItem>
                  <ListItemText
                    primary="ID"
                    secondary={data.reseller_by_pk.id}
                  ></ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reseller User"
                    secondary={data.reseller_by_pk.reseller_user?.fullname}
                  ></ListItemText>
                </ListItem>
              </div>
            </Box>
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
                    __html: data.reseller_by_pk.biography,
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
                    __html: data.reseller_by_pk.biography_mm,
                  }}
                ></div>
              </Box>
            </Box>
          </Box>
        </CardContent>
        <Box display="flex" justifyContent="end" columnGap="3rem" m="2rem">
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/update_reseller/${data.reseller_by_pk.id}`)
            }
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveOpen(data.reseller_by_pk)}
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
            <Button onClick={handleRemove}>Confirm</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Reseller;
