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
import { useLazyQuery } from "@apollo/client";
// import { USERS } from "../../gql/users";
import SideBarContext from "../../context/SideBarContext";

const Index = () => {
  const { setNav } = useContext(SideBarContext);
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(null);
  //   const [loadUsers, result] = useLazyQuery(USERS);

  //   useEffect(() => {
  //     setNav("");
  //     loadUsers({
  //       variables: { limit: rowsPerPage, offset: offset, search: `%${search}%` },
  //     });
  //   }, [loadUsers, offset, rowsPerPage, search]);

  //   useEffect(() => {
  //     if (result.data) {
  //       //console.log(result.data);
  //       setUsers(result.data.users);
  //       setCount(Number(result.data?.users_aggregate.aggregate.count));
  //     }
  //   }, [result]);

  //console.log(result);
  //   const handleChangePage = (event, newPage) => {
  //     setPage(newPage);
  //     setOffset(rowsPerPage * newPage);
  //   };

  //   const handleChangeRowsPerPage = (event) => {
  //     setRowsPerPage(+event.target.value);
  //     setPage(0);
  //   };

  //   const handleSearch = (e) => {
  //     setSearch(document.getElementById("search-by-phone").value);
  //   };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      //   backgroundColor: theme.palette.grey[100],
      //   backgroundColor: theme.palette.primary.light,
      //   color: theme.palette.common.black,
      fontSize: 10,
      fontWeight: "bold",
      minWidth: 70,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
      //backgroundColor: theme.palette.common.white,
      //   color: theme.palette.common.black,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  //   if (!users) {
  //     ///console.log(users);
  //     return (
  //       <div className="loading">
  //         <em>Loading...</em>
  //       </div>
  //     );
  //   }

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
          <Breadcrumbs
            aria-label="breadcrumb"
            fontWeight="bold"
            fontSize="1.2rem"
          >
            <Link to="/" className="dashboard">
              Dashboard
            </Link>
            <span>Users</span>
          </Breadcrumbs>
        </div>
        {/* search */}
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
            {/* Search Box */}

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
        </div>
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
                <StyledTableCell
                  style={{
                    minWidth: 100,
                    fontWeight: "bold",
                  }}
                >
                  ID
                </StyledTableCell>
                <StyledTableCell style={{ minWidth: 70 }}>Name</StyledTableCell>
                <StyledTableCell style={{ minWidth: 70 }}>
                  Phone
                </StyledTableCell>
                <StyledTableCell style={{ minWidth: 70 }}>
                  Created At
                </StyledTableCell>
                <StyledTableCell style={{ minWidth: 70 }}>
                  Updated At
                </StyledTableCell>
                <StyledTableCell style={{ minWidth: 100 }}>
                  Actions
                </StyledTableCell>
              </StyledTableRow>
            </TableHead>

            <TableBody>
              {/* {users.map((row, index) => ( */}
              <StyledTableRow hover role="checkbox" tabIndex={-1}>
                <StyledTableCell>1</StyledTableCell>
                <StyledTableCell>2</StyledTableCell>
                <StyledTableCell>3</StyledTableCell>
                <StyledTableCell>4</StyledTableCell>
                <StyledTableCell>5</StyledTableCell>
                <StyledTableCell>
                  <Button
                    size="small"
                    // color={row.disabled ? "success" : "error"}
                  ></Button>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    // color="warning"
                    // variant="contained"
                    fontWeight="bold"
                    // onClick={() => navigate(`/user/${row.id}`)}
                  >
                    Detail
                  </Button>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow hover role="checkbox" tabIndex={-1}>
                <StyledTableCell>1</StyledTableCell>
                <StyledTableCell>2</StyledTableCell>
                <StyledTableCell>3</StyledTableCell>
                <StyledTableCell>4</StyledTableCell>
                <StyledTableCell>5</StyledTableCell>
                <StyledTableCell>
                  <Button
                    size="small"
                    // color={row.disabled ? "success" : "error"}
                  ></Button>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    // color="warning"
                    // variant="contained"
                    fontWeight="bold"
                    // onClick={() => navigate(`/user/${row.id}`)}
                  >
                    Detail
                  </Button>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow hover role="checkbox" tabIndex={-1}>
                <StyledTableCell>1</StyledTableCell>
                <StyledTableCell>2</StyledTableCell>
                <StyledTableCell>3</StyledTableCell>
                <StyledTableCell>4</StyledTableCell>
                <StyledTableCell>5</StyledTableCell>
                <StyledTableCell>
                  <Button
                    size="small"
                    // color={row.disabled ? "success" : "error"}
                  ></Button>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    // color="warning"
                    // variant="contained"
                    fontWeight="bold"
                    // onClick={() => navigate(`/user/${row.id}`)}
                  >
                    Detail
                  </Button>
                </StyledTableCell>
              </StyledTableRow>

              <StyledTableRow hover role="checkbox" tabIndex={-1}>
                <StyledTableCell>1</StyledTableCell>
                <StyledTableCell>2</StyledTableCell>
                <StyledTableCell>3</StyledTableCell>
                <StyledTableCell>4</StyledTableCell>
                <StyledTableCell>5</StyledTableCell>
                <StyledTableCell>
                  <Button
                    size="small"
                    // color={row.disabled ? "success" : "error"}
                  ></Button>
                  <Button
                    size="small"
                    sx={{ color: "red" }}
                    // color="warning"
                    // variant="contained"
                    fontWeight="bold"
                    // onClick={() => navigate(`/user/${row.id}`)}
                  >
                    Detail
                  </Button>
                </StyledTableCell>
              </StyledTableRow>

              {/* ))} */}
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
      </Box>
    </div>
  );
};

export default Index;
