import { useEffect, useState } from "react";

import {
  Button,
  Box,
  Breadcrumbs,
  InputBase,
  TableRow,
  TablePagination,
  TableHead,
  TableBody,
  TableContainer,
  Paper,
  Avatar,
  Table,
  styled,
  TableCell,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ALL_EVENTS } from "../../gql/event";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const Events = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data } = useQuery(ALL_EVENTS, {
    variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` },
    fetchPolicy: "network-only",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
  if (!data) {
    return;
  }
  console.log("event", data);
  return (
    <>
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
            <span>Event</span>
          </Breadcrumbs>
        </div>
        {/* search
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
              Search Box

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
        </div> */}
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
            onClick={() => navigate("/create_event")}
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
        {/* <TableContainer sx={{ maxHeight: "60vh", Width: "100px" }}> */}
        <TableContainer component={Paper}>
          {/* <Table stickyHeader aria-label="sticky table"> */}
          <Table
            stickyHeader
            aria-label="sticky table , responsive table"
            className={classes.table}
          >
            <TableHead>
              <StyledTableRow>
                <TableCell
                  style={{
                    minWidth: 100,
                  }}
                >
                  ID
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell>Event Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {data.event.length === 0 && <h1>No events</h1>}

              {Array.isArray(data.event) &&
                data.event.map((row, index) => (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <TableCell>{row.id}</TableCell>

                    <TableCell>
                      <Avatar
                        width="52px"
                        height="52px"
                        src={row.event_thumbnail_url}
                      ></Avatar>
                    </TableCell>
                    <TableCell>{row.event_name}</TableCell>

                    <TableCell>
                      {row.event_date_time.substring(0, 10)}
                    </TableCell>
                    <TableCell>{row.event_location}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        // color="warning"
                        // variant="contained"
                        fontWeight="bold"
                        onClick={() => navigate(`/event/${row.id}`)}
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
          count={data?.event_aggregate.aggregate.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default Events;
