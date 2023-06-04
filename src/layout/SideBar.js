import React, {useContext, useEffect} from "react";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PlayCircleSharpIcon from "@mui/icons-material/PlayCircleSharp";
import BrushIcon from "@mui/icons-material/Brush";
import ListItemIcon from "@mui/material/ListItemIcon";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import { Box, Typography } from "@mui/material";
import icons from "../view/icons";
import {Link, useNavigate} from "react-router-dom";
import "../style/App.css";
import SideBarContext from "../context/SideBarContext";

import { makeStyles } from "@mui/styles";
import { Icon } from "@mui/material";
import * as jose from "jose";

const drawerWidth = 280;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SideBar = ({ open }) => {
  const { nav, setNav, role, setRole } = useContext(SideBarContext);
  const navigate = useNavigate();

  useEffect(() => {
    let userToken = window.localStorage.getItem("mulaloggeduser");

    if(userToken){
      let userData = JSON.parse(userToken);
      let rowDecodeToken = jose.decodeJwt(userData.token);
      setRole(rowDecodeToken["https://hasura.io/jwt/claims"]["x-hasura-default-role"])
    }else{
      navigate("/login");
    }
  })

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f7f7f7",
        },
      }}
      className="sidebar"
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "50px",
            margin: "auto",
            mt: 1,
            mb: 1.5,
          }}
        >
          <img src={icons.logo} alt="mula" />
        </Box>
      </DrawerHeader>
      <List className="nav-list">
        <Link to="/" onClick={() => setNav("")} className="nav-link">
          <ListItem button className={`nav-btn ${nav === "" && "active"}`}>
            <ListItemIcon>
              <DashboardIcon className="nav-link-icon" />
            </ListItemIcon>
            Dashboard
          </ListItem>
        </Link>
        <Link to="/user" onClick={() => setNav("")} className="nav-link">
          <ListItem button className={`nav-btn ${nav === "" && "active"}`}>
            <ListItemIcon>
              <AccountCircleSharpIcon className="nav-link-icon" />
            </ListItemIcon>
            Users
          </ListItem>
        </Link>
        <Link to="/artist" onClick={() => setNav("")} className="nav-link">
          <ListItem button className={`nav-btn ${nav === "" && "active"}`}>
            <ListItemIcon>
              <BrushIcon className="nav-link-icon" />
            </ListItemIcon>
            Artist
          </ListItem>
        </Link>

        {
          role === "artist" &&
            <Link to="/art" onClick={() => setNav("art")} className="nav-link">
              <ListItem className={`nav-btn ${nav === "art" && "active"}`}>
                <ListItemIcon>
                  <BrushIcon className="nav-link-icon"/>
                </ListItemIcon>
                Art
              </ListItem>
            </Link>
        }
      </List>
    </Drawer>
  );
};

export default SideBar;
