import {styled, TableCell, tableCellClasses, TableRow} from "@mui/material";
import {makeStyles} from "@mui/styles";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        fontSize: 10,
        fontWeight: "bold",
        minWidth: 70,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

const ModalStyled = {
    width: "95%",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const useStyles = makeStyles({
    cardImage: {
        width: "250px",
        height: "300px"
    }
});

export { StyledTableRow, StyledTableCell, ModalStyled, useStyles }