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
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableBody,
  tableCellClasses,
  styled,
  TableRow,
  TableCell,
  TextField,
  FormControl,
  Avatar,
} from "@mui/material";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ARTIST } from "../../gql/artist";
import SideBarContext from "../../context/SideBarContext";

const Artists = () => {
  const { setNav } = useContext(SideBarContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [artist, setArtist] = useState("");
  const [loadArtist, resultArtist] = useLazyQuery(ARTIST);

  useEffect(() => {
    loadArtist({
      variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` },
      fetchPolicy: "network-only",
    });
  }, [loadArtist, rowsPerPage, offset, search]);

  useEffect(() => {
    if (resultArtist.data) {
      console.log("rerror", resultArtist.error);
      setArtist(resultArtist.data.artist);
      setCount(resultArtist.data?.artist_aggregate.aggregate.count);
    }
  }, [resultArtist]);

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
      loadArtist(
        {
          variables: {
            limit: rowsPerPage,
            offset: offset,
            search: `%${search}%`,
          },
          fetchPolicy: "network-only",
        },
        [loadArtist, rowsPerPage, offset, search]
      );
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

  if (!artist) {
    return "no artist";
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        {/* dashboard */}
        <div>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/" className="dashboard">
              Dashboard
            </Link>
            <span>Artists</span>
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
              }}
            >
              {/* Search Box */}

              <InputBase
                id="search-by-phone"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search By Artist Name"
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
                type="submit"
                value={search}
                onClick={handleSearch}
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
          onClick={() => navigate("/create_artist")}
        >
          Add
        </Button>
      </div>

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
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Artist Name
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Profile Image
                </TableCell>

                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Year Born
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Year Died
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </StyledTableRow>
            </TableHead>
            {artist.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    <Typography variant="h6" color="error">
                      No Artists Data
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {/* {artist.length === 0 && <h1>No Artists</h1>} */}
                {artist.map((row, index) => (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.artist_name}</TableCell>
                    <TableCell>
                      <Avatar
                        width="52px"
                        height="52px"
                        src={row.artist_profile_image_url}
                      ></Avatar>
                    </TableCell>

                    <TableCell>{row.year_born}</TableCell>
                    <TableCell>{row.year_died}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ color: "white", p: 1, mr: 1 }}
                        onClick={() => navigate(`/artist/${row.id}`)}
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

export default Artists;
