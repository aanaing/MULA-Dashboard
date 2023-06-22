import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Drawer from "@mui/material/Drawer";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// const useStyles = makeStyles((theme) => ({
//   sidebar: {
//     width: 240,
//     flexShrink: 0,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   activeMenuItem: {
//     backgroundColor: theme.palette.action.selected,
//   },
// }));

const Sidebar = () => {
  // const classes = useStyles();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div>
      <IconButton
        edge="start"
        className="nav-btn"
        color="inherit"
        aria-label="menu"
        onClick={handleSidebarOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={handleSidebarClose}
        // className={classes.sidebar}
      >
        <MenuItem
          component={Link}
          to="/"
          onClick={handleSidebarClose}
          // className={isActiveRoute("/") ? active : ""}
        >
          Home
        </MenuItem>
        <MenuItem
          component={Link}
          to="/about"
          onClick={handleSidebarClose}
          // className={isActiveRoute("/about") ? active : ""}
        >
          About
        </MenuItem>
        <MenuItem onClick={handleMenuOpen}>Dropdown</MenuItem>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
          <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
        </Menu>
      </Drawer>
    </div>
  );
};

export default Sidebar;
