import React, { useContext } from "react";
import { styled } from "@mui/material/styles";
import EventAvailableSharpIcon from "@mui/icons-material/EventAvailableSharp";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PlayCircleSharpIcon from "@mui/icons-material/PlayCircleSharp";
import BrushIcon from "@mui/icons-material/Brush";
import ListItemIcon from "@mui/material/ListItemIcon";
import PaletteIcon from "@mui/icons-material/Palette";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import SellIcon from "@mui/icons-material/Sell";
import { Box, Typography } from "@mui/material";
import icons from "../view/icons";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../style/App.css";
import SideBarContext from "../context/SideBarContext";

import { makeStyles } from "@mui/styles";
import { Icon } from "@mui/material";

const drawerWidth = 230;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const SideBar = ({ open }) => {
  const { nav, setNav } = useContext(SideBarContext);

  const isActive = {
    fontWeight: "bold",
    backgroundColor: "red",
  };

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
            width: "20px",
            margin: "auto",
            mt: 1,
            mb: 1.5,
          }}
        >
          <img src={icons.logo} alt="mula" width="50px" height="50px" />
        </Box>
      </DrawerHeader>
      <Divider />
      <List className="nav-list">
        <Link to="/dashboard" onClick={() => setNav("")} className="nav-link">
          <ListItem
            button
            className={`${nav === "" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <DashboardIcon className="nav-link-icon" />
            </ListItemIcon>
            Dashboard
          </ListItem>
        </Link>
        <Link to="/user" onClick={() => setNav("user")} className="nav-link">
          <ListItem
            button
            className={`${nav === "user" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <AccountCircleSharpIcon className="nav-link-icon" />
            </ListItemIcon>
            Users
          </ListItem>
        </Link>
        <Link
          to="/art_work"
          onClick={() => setNav("art_work")}
          className="nav-link"
        >
          {/* <ListItem button className={`nav-btn ${nav === "" && "active"}`}> */}
          <ListItem
            button
            className={`${nav === "art_work" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <PaletteIcon className="nav-link-icon" />
            </ListItemIcon>
            ArtWork
          </ListItem>
        </Link>
        <Link
          to="/artist"
          onClick={() => setNav("artist")}
          className="nav-link"
        >
          <ListItem
            button
            className={`${nav === "artist" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <BrushIcon className="nav-link-icon" />
            </ListItemIcon>
            Artist
          </ListItem>
        </Link>
        <Link
          to="/reseller"
          onClick={() => setNav("reseller")}
          className="nav-link"
        >
          <ListItem
            button
            className={`${nav === "reseller" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <SellIcon className="nav-link-icon" />
            </ListItemIcon>
            Reseller
          </ListItem>
        </Link>
        {/* Event */}
        <Link to="/event" onClick={() => setNav("event")} className="nav-link">
          <ListItem
            button
            className={`${nav === "event" ? "nav-btn active" : "nav-btn"}`}
          >
            <ListItemIcon>
              <EventAvailableSharpIcon className="nav-link-icon" />
            </ListItemIcon>
            Event
          </ListItem>
        </Link>{" "}
        <Divider sx={{ my: "1.5rem" }} />
        {/* Digital artwork */}
        <Link
          to="/digital_artwork"
          onClick={() => setNav("digital_artwork")}
          className="nav-link"
        >
          <ListItem
            button
            className={`${
              nav === "digital_artwork" ? "nav-btn active" : "nav-btn"
            }`}
          >
            <ListItemIcon>
              <PaletteIcon className="nav-link-icon" />
            </ListItemIcon>
            Digital Artwork
          </ListItem>
        </Link>
      </List>
    </Drawer>
  );
};

export default SideBar;
