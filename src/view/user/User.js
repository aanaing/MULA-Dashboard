import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import { USER, EDIT_USER } from "../../gql/user";
import {
  Breadcrumbs,
  Typography,
  Box,
  Paper,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
  Modal,
} from "@mui/material";
//import AddressTable from "../../components/users/AddressTable";
import "../../style/App.css";
import { bgcolor } from "@mui/system";
import CreateArtist from "../artists/CreateArtistByPhone";
import CreateArtistByPhone from "../artists/CreateArtist";

const User = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showComponent, setShowComponent] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", IsError: false });
  const { data, loading, error } = useQuery(USER, { variables: { id: id } });

  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [editUser] = useMutation(EDIT_USER, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      setShowAlert({ message: "User have been updated.", isError: false });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
  });

  //if no data in result
  if (loading) {
    return (
      <div className="loading">
        <em>Loading...</em>
      </div>
    );
  }
  let user = data.users_by_pk;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleCreateOpen = (scrollType) => {
    setCreateOpen(true);
  };

  const handleComponent = () => {
    setShowComponent(!showComponent);
  };

  //Change data from String to object with JSON
  //   if (typeof result.data.users_by_pk.address !== "object") {
  //     try {
  //       let address = JSON.parse(result.data.users_by_pk.address);
  //       user = { ...result.data.users_by_pk, address };
  //     } catch (e) {
  //       user = { ...result.data.users_by_pk };
  //     }
  //   } else user = { ...result.data.users_by_pk, address: "-" };

  return (
    <div>
      <div role="presentation" className="align">
        <Breadcrumbs aria-label="breadcrumb">
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/user" className="user">
            Users
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h5" component="h2" sx={{ m: 3, color: "black" }}>
        User Details
      </Typography>
      <CardContent sx={{ display: "flex" }}>
        <Paper
          elevation={3}
          sx={{
            flex: 4,
            mx: 3,
            py: 3,
            //bgcolor: "#262626",
            color: "black",
            display: "flex",
          }}
        >
          <Box
            sx={{
              ml: "5rem",
              // p: 2,
              width: "50rem",
              // bgcolor: "#f7f7f5",
              borderRadius: 2,
            }}
          >
            {/* User ID */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">ID:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.id}
                </Typography>
              </Grid>
            </Grid>

            {/* FullName */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">FullName:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.fullname}
                </Typography>
              </Grid>
            </Grid>

            {/* Email */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Email:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Grid>
            </Grid>

            {/* Address */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Address:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.address}
                </Typography>
              </Grid>
            </Grid>

            {/* Gender */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Gender:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.gender}
                </Typography>
              </Grid>
            </Grid>

            {/* Phone Number */}
            <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2">Phone Number:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  {user.phone}
                </Typography>
              </Grid>
            </Grid>
            {/* Role */}
            {/* <Grid sx={{ m: 2 }} container spacing={2}>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  Role:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2" color="text.secondary">
                  {user.role}
                </Typography>
              </Grid>
            </Grid> */}
          </Box>
        </Paper>
      </CardContent>

      <CardActions className="flex--3--cols">
        <Box>
          {user.disabled ? (
            <Button
              variant="contained"
              size="large"
              color="warning"
              onClick={() =>
                editUser({ variables: { id: user.id, disabled: false } })
              }
            >
              Enable
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={() =>
                editUser({ variables: { id: user.id, disabled: true } })
              }
            >
              Disable
            </Button>
          )}
        </Box>

        <div>
          <Button
            variant="contained"
            color="info"
            disabled={user.users_artist.length !== 0}
            // component={Link}
            onClick={() => navigate(`/create_artist/${user.id}`)}
          >
            Up to Artist
          </Button>
        </div>

        <Button
          variant="contained"
          color="success"
          disabled={user.users_resellers.length !== 0}
          onClick={() => navigate(`/create_directReseller/${user.id}`)}
        >
          Up to Reseller
        </Button>
      </CardActions>
      {showAlert.message && !showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="success"
        >
          {showAlert.message}
        </Alert>
      )}
      {showAlert.message && showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="error"
        >
          {showAlert.message}
        </Alert>
      )}

      {/* <Modal
        open={createOpen}
        onClose={handleCreateClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "100vw" }}
      >
        <Box>
          <CreateArtistByPhone
            handleClose={handleCreateClose}
            phone={user.phone}
          />
        </Box>
      </Modal> */}
    </div>
  );
};

export default User;
