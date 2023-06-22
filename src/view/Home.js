import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
  createContext,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert } from "@mui/material";

import Header from "../layout/Header";
import SideBar from "../layout/SideBar";

import Dashboard from "../view/dashboard/Dashboard";
import Users from "../view/user/Users";
import User from "../view/user/User";

import Artists from "../view/artists/Artists";
import Artist from "../view/artists/Artist";
import CreateArtistByPhone from "./artists/CreateArtistByPhone";
import CreateArtist from "./artists/CreateArtist";
import UpdateArtist from "../view/artists/UpdateArtist";

import Resellers from "../view/reseller/Resellers";
import Reseller from "../view/reseller/Reseller";
import CreateReseller from "../view/reseller/CreateReseller";
import UpdateReseller from "../view/reseller/UpdateReseller";
import DirectCreateReseller from "../view/reseller/DirectCreateReseller";

import ArtWorks from "../view/art_work/ArtWorks";
import ArtWork from "../view/art_work/ArtWork";
import CreateArtWork from "../view/art_work/CreateArtWork";
import UpdateArtWork from "../view/art_work/UpdateArtWork";

const drawerWidth = 260;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();
  const AuthContext = createContext();
  const [auth, setAuth] = useState(null);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const homeAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  // useEffect(() => {
  //   const loggedUser = window.localStorage.getItem("loggedUser");
  //   if (loggedUser) {
  //     const parsedLoggedUser = JSON.parse(loggedUser);
  //     setAuth(parsedLoggedUser);
  //   } else {
  //     navigate("/login");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Box
      sx={{
        display: "flex",
        //bgcolor: "#F8F7FC",
        //bgcolor: "#1e1e1e",
        background: "#F7F7F7",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawer} />
      <SideBar handleDrawerClose={handleDrawerClose} open={open} />
      <Main open={open}>
        <DrawerHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContext.Provider value={auth}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user" element={<Users />} />
              <Route path="/user/:id" element={<User />} />

              <Route path="/artist" element={<Artists />} />
              <Route path="/artist/:id" element={<Artist />} />
              <Route
                path="/create_artist/:id"
                element={<CreateArtistByPhone />}
              />
              <Route path="/create_artist" element={<CreateArtist />} />
              <Route path="/update_artist/:id" element={<UpdateArtist />} />

              <Route path="/reseller" element={<Resellers />} />
              <Route path="/reseller/:id" element={<Reseller />} />
              <Route path="/create_reseller" element={<CreateReseller />} />
              <Route path="/update_reseller/:id" element={<UpdateReseller />} />
              <Route
                path="/create_directReseller/:id"
                element={<DirectCreateReseller />}
              />

              <Route path="/art_work" element={<ArtWorks />} />
              <Route path="/art_work/:id" element={<ArtWork />} />
              <Route path="/create_artWork" element={<CreateArtWork />} />
              <Route path="/update_artWork/:id" element={<UpdateArtWork />} />
            </Routes>
          </AuthContext.Provider>
        </Suspense>
      </Main>
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
          severity="warning"
        >
          {showAlert.message}
        </Alert>
      )}
    </Box>
  );
};

export default Admin;
