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
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Modal,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../store/authentication";
import Swal from "sweetalert2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import getEnvironment from "../../store/getEnvironment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 5,
  zIndex: 1,
};

const StyledTableRow = styled(TableRow)(() => ({
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

export async function getServerSideProps(context) {
  const { id } = context.query;
  const { baseApi } = await getEnvironment();

  const device = await axios.get(`${baseApi}/devices/get/${id}`);

  return {
    props: { device: device.data, baseApi: baseApi },
    // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { id, name, price } = props.device;
  const [currPrice, setCurrPrice] = useState(price);
  const [newPrice, setNewPrice] = useState();

  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Swal.close();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePriceChange = async () => {
    setOpen(false);
    Swal.fire({
      title: "Cek Kembali !!",
      text: `Ganti biaya air menjadi ${newPrice} /mL`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: "Loading Data",
          didOpen: () => {
            Swal.showLoading();
          },
        });

        axios
          .get(`${props.baseApi}/device/update/price/${id}`, {
            params: { price: newPrice },
          })
          .then((res) => {
            Swal.close();
            setCurrPrice(newPrice);
            Swal.fire("Saved!", "", "success");
          })
          .catch((err) => console.error(err));
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
        setNewPrice(0);
      }
    });
  };

  return (
    <Card variant="outlined">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Masukan Harga Baru
          </Typography>
          <TextField
            label="harga"
            type="number"
            placeholder="10000"
            onChange={(e) => setNewPrice(e.target.value)}
          ></TextField>
          <Stack direction="row">
            <Button onClick={handlePriceChange}> Simpan</Button>
            <Button onClick={handleClose} color="error">
              {" "}
              Batal
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        mx={4}
        mt={4}
      >
        <Typography variant="h5">
          Harga Sekarang : Rp.{" "}
          {parseInt(currPrice)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
          /mL
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ borderRadius: 2, width: 150 }}
        >
          Ubah Harga
        </Button>
      </Grid>

      <CardContent>
        <Box
          sx={{
            display: "flex",
            marginY: 1,
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Accordion sx={{ width: 200, borderBottom: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Filter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                variant="outlined"
                size="small"
                placeholder="example (August)"
              ></TextField>
            </AccordionDetails>
          </Accordion>
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
