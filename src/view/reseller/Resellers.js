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
  console.log("reseller ", reseller);
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
            onClick={() => navigate("/create_reseller")}
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
              <TableRow>
                <StyledTableCell
                  style={{
                    minWidth: 100,
                    fontWeight: "bold",
                  }}
                >
                  ID
                </StyledTableCell>
                <StyledTableCell style={{ minWidth: 70 }}>
                  User Name
                </StyledTableCell>

                <StyledTableCell style={{ minWidth: 100 }}>
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reseller.length === 0 && <h1>No Reseller</h1>}
              {Array.isArray(reseller) &&
                reseller.map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <StyledTableCell>{row.id}</StyledTableCell>
                    <StyledTableCell>
                      {row.reseller_user ? row.reseller_user.fullname : ""}
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        fontWeight="bold"
                        onClick={() => navigate(`/reseller/${row.id}`)}
                      >
                        Detail
                      </Button>
                    </StyledTableCell>
                  </TableRow>
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
      </Box>
    </div>
  );
};

export default Resellers;
