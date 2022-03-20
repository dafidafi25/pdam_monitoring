import {
  Typography,
  Pagination,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Input,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#1976D2",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24),
  createData("Ice cream sandwich", 237, 9.0, 37),
  createData("Eclair", 262, 16.0, 24),
  createData("Cupcake", 305, 3.7, 67),
  createData("Gingerbread", 356, 16.0, 49),
];

const thead = [
  {
    name: "Pemakaian Bulan Ini",
  },
  {
    name: "Meteran Bulan Ini",
  },
  {
    name: "Total Pemakaian",
  },
  {
    name: "Total Biaya",
  },
];

export default function Home() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            marginY: 3,
            justifyContent: "space-between",
          }}
        >
          <div>twes</div>
          <div>
            <label html-for="filter">wa</label>
            <Input id="filter tabel"></Input>
          </div>
        </Box>{" "}
        <div style={{ height: 400, width: "100%" }}>
          {" "}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <TableCell>
                    <Typography sx={{ color: "white" }}> No</Typography>
                  </TableCell>
                  {thead.map((item) => {
                    return (
                      <TableCell key={item.name}>
                        <Typography sx={{ color: "white" }}>
                          {" "}
                          {item.name}
                        </Typography>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Typography sx={{ color: "white" }}> Button</Typography>
                  </TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>{row.fat}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                    <TableCell>
                      <Button>wewe</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Pagination onChange={() => console.log("tes")} count={10} />
      </CardContent>
    </Card>
  );
}
