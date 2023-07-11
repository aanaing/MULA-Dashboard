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
  Typography,
  Table,
  TableHead,
  TableBody,
  styled,
  TableCell,
  TableRow,
} from "@mui/material";
import { useLazyQuery, useQuery } from "@apollo/client";
// import { USERS } from "../../gql/users";
import SideBarContext from "../../context/SideBarContext";
import { ALL_RESELLER } from "../../gql/reseller";

const Resellers = () => {
  const { setNav } = useContext(SideBarContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [reseller, setReseller] = useState("");
  const [loadReseller, resultReseller] = useLazyQuery(ALL_RESELLER);

  useEffect(() => {
    loadReseller({
      variables: { limit: rowsPerPage, offset: offset },
      fetchPolicy: "network-only",
    });
  }, [loadReseller, rowsPerPage, offset]);

  useEffect(() => {
    if (resultReseller.data) {
      setReseller(resultReseller.data.reseller);
      setCount(resultReseller.data?.reseller_aggregate.aggregate.count);
    }
  }, [resultReseller]);

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
      // backgroundColor: "#f1f3f5",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (!reseller) {
    return;
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
            <span>Reseller</span>
          </Breadcrumbs>
        </div>
        {/* search
        <div>
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
              //   value={search}
              //   onChange={handleSearch}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              //   color="warning"
              sx={{ p: "10px" }}
              aria-label="directions"
              //value={search}
              //onClick={handleSearch}
            >
              <DirectionsIcon />
            </IconButton>
          </Paper>
        </div> */}
        {/* add */}
        <Button
          variant="contained"
          sx={{
            px: 3,
            py: 1,
          }}
          color="secondary"
          onClick={() => navigate("/create_reseller")}
        >
          Add
        </Button>
      </div>

      {/* <Box
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
          sx={{
            maxHeight: "60vh",
            Width: "100px",
            border: "1px groove rgba(0,0,0,0.2)",
          }}
        >
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
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  User Name
                </TableCell>

                <TableCell style={{ minWidth: 100, fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {reseller.length === 0 && <h1>No Reseller</h1>}
              {Array.isArray(reseller) &&
                reseller.map((row, index) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {row.reseller_user ? row.reseller_user.fullname : ""}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{ color: "white", p: 1, mr: 1 }}
                        onClick={() => navigate(`/reseller/${row.id}`)}
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
          //   onPageChange={handleChangePage}
          //   onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box> */}

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
                    minWidth: 100,
                    fontWeight: "bold",
                  }}
                >
                  ID
                </TableCell>
                <TableCell style={{ minWidth: 70, fontWeight: "bold" }}>
                  User Name
                </TableCell>

                <TableCell style={{ minWidth: 100, fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </StyledTableRow>
            </TableHead>
            {reseller.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    <Typography variant="h6" color="error">
                      No Reseller Data
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {reseller &&
                  reseller.map((row, index) => (
                    <StyledTableRow hover role="checkbox" tabIndex={-1}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        {" "}
                        {row.reseller_user ? row.reseller_user.fullname : ""}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{ color: "white", p: 1, mr: 1 }}
                          onClick={() => navigate(`/reseller/${row.id}`)}
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

export default Resellers;
