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

import Users from "../view/user/Users";
import User from "../view/user/User";
import Artists from "../view/artists/Artists";
import Artist from "../view/artists/Artist";
import CreateArtist from "../view/artists/CreateArtist";
import UpdateArtist from "../view/artists/UpdateArtist";
//const Dashboard = lazy(() => import("./Dashboard"));

// const Users = lazy(() => import("./user/Users"));
// const User = lazy(() => import("./user/User"));

// const Artists = lazy(() => import("./artists/Artists"));
// const Artist = lazy(() => import("./artists/Artist"));
//const CreateArtist = lazy(() => import("./artists/CreateArtist"));
// const UpdateArtist = lazy(() => import("./artists/UpdateArtist"));

const drawerWidth = 280;

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
              <Route path="/user" element={<Users />} />
              <Route path="/user/:id" element={<User />} />

              <Route path="/artist" element={<Artists />} />
              <Route path="/artist/:id" element={<Artist />} />
              <Route path="/create_artist" element={<CreateArtist />} />
              <Route path="/update_artist" element={<UpdateArtist />} />
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
