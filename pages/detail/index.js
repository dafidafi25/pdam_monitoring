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
  FormControl,
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

const thead = [
  {
    name: "Waktu",
  },
  {
    name: "Pemakaian (Liter)",
  },

  {
    name: "Total Biaya (IDR)",
  },
];

export async function getServerSideProps(context) {
  const { id } = context.query;
  const { baseApi } = await getEnvironment();
  console.log(`${baseApi}/devices/get/${id}`);

  const device = await axios.get(`${baseApi}/devices/get/${id}`, {
    params: {
      startMonth: "01-1-2021",
      endMonth: "01-1-2022",
    },
  });
  console.log(device.data);
  return {
    props: {
      device: device.data.device ? device.data.device : [],
      baseApi: baseApi,
      detail: device.data.detail ? device.data.detail : [],
    },
  };
}

export default function Home(props) {
  const { id, name } = props.device;
  const [price, setPrice] = useState(props.device.price);
  const [rows, setRows] = useState(props.detail);
  const [currPrice, setCurrPrice] = useState(price);
  const [newPrice, setNewPrice] = useState();
  const [startMonth, setStartMonth] = useState(1);
  const [startYear, setStartYear] = useState("2021");
  const [endMonth, setEndMonth] = useState(1);
  const [endYear, setEndyear] = useState("2022");

  const { user, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  async function getDiveDetailPage(startDate, endDate) {
    const device = await axios.get(`${props.baseApi}/devices/get/${id}`, {
      params: {
        startMonth: startDate,
        endMonth: endDate,
      },
    });
    setPrice(device.data.device.price);
    setRows(device.data.detail);
  }

  useEffect(() => {
    Swal.close();
  }, []);

  useEffect(() => {
    const startDate = startYear + "-" + startMonth + "-" + "01";
    const endDate = endYear + "-" + endMonth + "-" + "01";

    getDiveDetailPage(startDate, endDate);
  }, [startMonth, startYear, endMonth, endYear]);

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
            setPrice(newPrice);
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
        <Stack spacing={2} direction="row" sx={{ marginY: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              placeholder="example (August)"
              value={startMonth}
              onChange={(e) => {
                e.preventDefault();
                setStartMonth(e.target.value);
              }}
            >
              {MONTH.map((item, index) => {
                return (
                  <MenuItem value={index + 1} key={index}>
                    {" "}
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              placeholder="example (August)"
              value={startYear}
              onChange={(e) => {
                e.preventDefault();
                setStartYear(e.target.value);
              }}
            >
              {YEAR.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {" "}
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        <Stack spacing={2} direction="row" sx={{ marginY: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              placeholder="example (August)"
              value={endMonth}
              onChange={(e) => {
                e.preventDefault();
                setEndMonth(e.target.value);
              }}
            >
              {MONTH.map((item, index) => {
                return (
                  <MenuItem value={index + 1} key={index}>
                    {" "}
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              variant="outlined"
              size="small"
              placeholder="example (August)"
              value={endYear}
              onChange={(e) => {
                e.preventDefault();
                setEndyear(e.target.value);
              }}
            >
              {YEAR.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {" "}
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
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
                {rows.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getMonthName(item.date)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.measurement}
                    </TableCell>
                    <TableCell>
                      Rp.
                      {(parseFloat(item.measurement) * price)
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
      </CardContent>
    </Card>
  );
}
const MONTH = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const YEAR = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];

function getMonthName(date) {
  const month_index_start = date.indexOf(".");
  const month_index_end = date.indexOf(".", month_index_start + 1);
  const month_string = date.substring(month_index_start + 1, month_index_end);
  const year = date.substring(month_index_end + 1);
  return MONTH[parseInt(month_string) - 1] + " " + year;
}
