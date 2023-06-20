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
import { ARTWORKS } from "../../gql/artwork";
import SideBarContext from "../../context/SideBarContext";

const ArtWork = () => {
  const { setNav } = useContext(SideBarContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [artwork, setArtwork] = useState("");
  const [loadArtwork, resultArtwork] = useLazyQuery(ARTWORKS);

  useEffect(() => {
    loadArtwork({
      variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` },
    });
  }, [loadArtwork, rowsPerPage, offset, search]);

  useEffect(() => {
    if (resultArtwork.data) {
      setArtwork(resultArtwork.data.traditional_art_work);
      setCount(
        resultArtwork.data?.traditional_art_work_aggregate.aggregate.count
      );
    }
  }, [resultArtwork]);

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

  if (!artwork) {
    return "no data";
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
            <span>ArtWork</span>
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
                width: 350,
              }}
            >
              {/* Search Box */}

              <InputBase
                id="search-by-phone"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search By Name or Phone"
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
      </div>

      <div>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            variant="contained"
            sx={{
              width: 90,
              height: 60,
              p: 1,
              my: 2,
              fontWeight: "bold",
            }}
            color="secondary"
            onClick={() => navigate("/create_artWork")}
          >
            Add
          </Button>
        </Box>
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
        <TableContainer sx={{ maxHeight: "60vh", Width: "100px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <StyledTableRow>
                <TableCell
                  style={{
                    minWidth: 100,
                    fontWeight: "bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 70 }}>Artwork Image</TableCell>
                <TableCell style={{ minWidth: 70 }}>Artwork Name</TableCell>

                <TableCell style={{ minWidth: 70 }}>Artwork Year</TableCell>
                <TableCell style={{ minWidth: 70 }}>Artwork Type</TableCell>

                <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {artwork.length === 0 && <h1>No Artwork</h1>}
              {artwork &&
                artwork.map((row, index) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>{row.id}</TableCell>

                    <TableCell>
                      <Avatar
                        width="52px"
                        height="52px"
                        src={row.artwork_image_url}
                      ></Avatar>
                    </TableCell>
                    <TableCell>{row.artwork_name}</TableCell>
                    <TableCell>{row.artwork_year}</TableCell>
                    <TableCell>{row.artwork_type}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        // color="warning"
                        // variant="contained"
                        fontWeight="bold"
                        onClick={() => navigate(`/art_work/${row.id}`)}
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
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

export default ArtWork;
