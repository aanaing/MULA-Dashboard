import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import DirectionsIcon from "@mui/icons-material/Directions";
import "../../style/App.css";
import {
  Box,
  Breadcrumbs,
  Button,
  TablePagination,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  styled,
  TableRow,
  TableCell,
  Avatar,
} from "@mui/material";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ALL_USERS } from "../../gql/user";
import SideBarContext from "../../context/SideBarContext";

const Users = () => {
  const { setNav } = useContext(SideBarContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [user, setUser] = useState("");
  const [loadUser, resultUser] = useLazyQuery(ALL_USERS);

  useEffect(() => {
    loadUser({
      variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` },
      fetchPolicy: "network-only",
    });
  }, [loadUser, rowsPerPage, offset, search]);
  useEffect(() => {
    if (resultUser.data) {
      setUser(resultUser.data.users);
      setCount(Number(resultUser.data?.users_aggregate.aggregate.count));
    }
  }, [resultUser]);

  if (!user) {
    return "no user";
  }

  const idsFromDatabase = Array.isArray(user) && user.map((u) => u.id);
  console.log("ids from database", idsFromDatabase);
  // const orderedIds = idsFromDatabase.sort((a, b) => a - b);

  // const newSequentialIds = orderedIds.map((id, index) => index + 1);

  // setUser({ ...user, id: newSequentialIds });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchValue);
    if (searchValue === "") {
      loadUser({
        variables: {
          limit: rowsPerPage,
          offset: offset,
          search: `%${search}%`,
        },
        fetchPolicy: "network-only",
      });
    }
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (!user) {
    return (
      <div className="loading">
        <em>Loading...</em>
      </div>
    );
  }

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          "@media (max-width: 480px)": {
            display: "grid",
            gap: "1rem",
            padding: "0",
          },
        }}
      >
        {/* dashboard */}
        <div>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="dashboard">
              Dashboard
            </Link>
            <span>Users</span>
          </Breadcrumbs>
        </div>
        {/* search */}
        <div>
          <form onSubmit={handleSearch}>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "auto",
                // "@media (max-width: 320px)": {
                //   width: "auto",
                // },
              }}
            >
              {/* Search Box */}
              <InputBase
                id="search-by-phone"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search By Fullname"
                type="search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton
                //   color="warning"
                sx={{ p: "10px" }}
                aria-label="directions"
                value={search}
                onClick={handleSearch}
                type="submit"
              >
                <DirectionsIcon />
              </IconButton>
            </Paper>
          </form>
        </div>
        {/* add */}

        <Button
          variant="contained"
          sx={{
            px: 3,
            py: 1,
          }}
          color="secondary"
          onClick={() => navigate("/create_user")}
        >
          Add
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap row",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            minHeight: "25vh",
          },
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "70vh",
            Width: "100px",
            border: "1px groove rgba(0,0,0,0.2)",
          }}
        >
          <Table stickyHeader aria-label="sticky table , responsive table">
            <TableHead>
              <StyledTableRow>
                <TableCell
                  style={{
                    minWidth: 70,
                    fontWeight: "bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Profile Image
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Phone
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Created At
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Updated At
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </StyledTableRow>
            </TableHead>

            {user.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    <Typography variant="h6" color="error">
                      No Users Data
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {user.map((row, index) => (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Avatar
                        width="52px"
                        height="52px"
                        src={row.profile_image_url}
                      ></Avatar>
                    </TableCell>
                    <TableCell>{row.fullname}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.created_at.slice(0, 10)}</TableCell>
                    <TableCell>{row.updated_at.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ color: "white", p: 1, mr: 1 }}
                        onClick={() => navigate(`/user/${row.id}`)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ color: "black" }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
};

export default Users;
