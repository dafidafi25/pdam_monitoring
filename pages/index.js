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
  Select,
  MenuItem,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { UserContext } from "../store/authentication";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#1976D2",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  timeOfMonth,
  currentMonthlyUsage,
  currentUsage,
  totalPrice
) {
  return {
    timeOfMonth,
    currentMonthlyUsage,
    currentUsage,
    totalPrice,
  };
}

const rows = [
  createData("August", 1500, 2000, 12000),
  createData("July", 500, 1500, 4000),
];

const thead = [
  {
    name: "Waktu",
  },
  {
    name: "Pemakaian (Liter)",
  },
  {
    name: "Total Meteran (Liter)",
  },
  {
    name: "Total Biaya (IDR)",
  },
];

export default function Home() {
  const { user, setUser } = useContext(UserContext);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: "flex",
            marginY: 3,
            justifyContent: "center",
          }}
        >
          <Box>
            <div>Nama Pengguna</div>
            <div>Alamat</div>
            <div>Meteran Saat ini</div>
            <div>ID Pengguna</div>
          </Box>
          <Box sx={{ marginLeft: 3 }}>
            <div>:</div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
          </Box>
          <Box sx={{ marginLeft: 3 }}>
            <div>Alif</div>
            <div>Surabaya</div>
            <div>3500</div>
            <div>Alif25</div>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginY: 3,
            justifyContent: "space-between",
          }}
        >
          <div>
            <Stack>
              <div> Search : </div>
              <TextField
                variant="outlined"
                size="small"
                id="filter tabel"
                placeholder="example (August)"
              ></TextField>
            </Stack>
          </div>
        </Box>{" "}
        <div style={{ width: "100%", marginBottom: 20 }}>
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
                  {user.role == "admin" && (
                    <TableCell>
                      <Typography sx={{ color: "white" }}>Action</Typography>
                    </TableCell>
                  )}
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
                      {row.timeOfMonth}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.currentMonthlyUsage}
                    </TableCell>
                    <TableCell>{row.currentUsage}</TableCell>
                    <TableCell>
                      Rp.
                      {row.totalPrice
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                      ,-
                    </TableCell>
                    {user.role == "admin" && (
                      <TableCell>
                        <Button color="primary" variant="contained">
                          On
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            Show
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              sx={{ marginX: 3 }}
              defaultValue={5}
              size="small"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>{" "}
            data of xxx data
          </div>
          <Pagination onChange={() => console.log("tes")} count={10} />
        </Box>
      </CardContent>
    </Card>
  );
}
