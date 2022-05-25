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
    name: "Biaya (IDR)",
  },

  {
    name: "Total Biaya (IDR)",
  },
];

function getUniqueDate(dateList) {
  let uniqueData = [];
  for (const date of dateList) {
    let check = date.split(".");
    check = check[0] + "." + check[1] + "." + "01";
    if (!uniqueData.includes(check)) {
      uniqueData.push(check);
    }
  }
  return uniqueData;
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const { baseApi } = await getEnvironment();

  const device = await axios.get(`${baseApi}/devices/get/${id}`);

  const data = await axios.get(`${baseApi}/data/list/`, {
    params: {
      id: id,
    },
  });

  const validateDates = data.data;
  let notTransactions = [];
  let transaction = [];

  for (const validateDate of validateDates) {
    const { DATE } = validateDate;
    const parseDate = DATE.split(".");
    const updatedDATE = parseDate[2] + "." + parseDate[1] + "." + parseDate[0];
    const check = await axios.post(`${baseApi}/transaction`, {
      id: id,
      date: DATE,
    });

    check.data.length == 0
      ? notTransactions.push(updatedDATE)
      : transaction.push(updatedDATE);
  }
  notTransactions = getUniqueDate(notTransactions);
  let tableNotTransactions = [];
  for (const notTransaction of notTransactions) {
    const data = await axios.get(`${baseApi}/device/data/${id}`, {
      params: { startMonth: notTransaction, endMonth: notTransaction },
    });

    tableNotTransactions.push(data.data.detail[0]);
  }

  const tableTransaction = await axios.get(`${baseApi}/transaction/list`, {
    params: { id: id },
  });

  const totalTable = [...tableTransaction.data, ...tableNotTransactions];

  return {
    props: {
      device: device.data.device,
      baseApi: baseApi,
      detail: totalTable,
      dataList: [],
    },
  };
}
let username = "";
let role = "";

if (typeof window !== "undefined") {
  username = localStorage.getItem("username");
  role = localStorage.getItem("role");
}

export default function Home(props) {
  const { id, name } = props.device;
  const [price, setPrice] = useState(props.device.price);
  const [rows, setRows] = useState(props.detail);
  const [currPrice, setCurrPrice] = useState(price);
  const [newPrice, setNewPrice] = useState();
  const user = {
    username: username,
    role: role,
  };

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
      text: `Ganti biaya air menjadi ${newPrice} /L`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
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
            location.reload();
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
      {user.role == "admin" && (
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
            /L
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ borderRadius: 2, width: 150 }}
          >
            Ubah Harga
          </Button>
        </Grid>
      )}

      <CardContent>
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

                  <TableCell>
                    <Typography sx={{ color: "white" }}>Status</Typography>
                  </TableCell>
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
                      {item.status_transaksi == undefined &&
                        Math.round(item.measurement / 10) / 100}
                      {item.status_transaksi != undefined && item.measurement}
                    </TableCell>
                    <TableCell>
                      Rp.
                      {item.status_transaksi == undefined &&
                        parseInt(price)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                      {item.status_transaksi != undefined &&
                        parseInt(item.price)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                    </TableCell>
                    <TableCell>
                      Rp.
                      {item.status_transaksi == undefined &&
                        (
                          parseFloat(Math.round(item.measurement / 10) / 100) *
                          price
                        )
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                      {item.status_transaksi != undefined &&
                        (parseFloat(item.measurement) * item.price)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                      ,-
                    </TableCell>
                    {user.role == "user" &&
                      item.status_transaksi != undefined && (
                        <TableCell>
                          {item.status_transaksi == 1 ? "Lunas" : "Belum Lunas"}
                        </TableCell>
                      )}

                    {user.role == "user" &&
                      item.status_transaksi == undefined && (
                        <TableCell>{"Proses"}</TableCell>
                      )}

                    {user.role == "admin" &&
                      item.status_transaksi == undefined && (
                        <TableCell>
                          <Button
                            sx={{ minWidth: 125 }}
                            color="primary"
                            variant="contained"
                            onClick={() => {
                              axios
                                .post(`${props.baseApi}/transaksi/set`, {
                                  date: item.date,
                                  measurement:
                                    Math.round(item.measurement / 10) / 100,
                                  price: price,
                                  device_id: id,
                                  status_transaksi: 0,
                                })
                                .then(() => location.reload());
                            }}
                          >
                            Simpan Transaksi
                          </Button>
                        </TableCell>
                      )}
                    {user.role == "admin" &&
                      item.status_transaksi != undefined && (
                        <TableCell>
                          <Button
                            sx={{ minWidth: 125 }}
                            color={
                              item.status_transaksi == 1 ? "primary" : "error"
                            }
                            variant="contained"
                            onClick={() => {
                              if (item.status_transaksi == 1) return;

                              axios
                                .get(`${props.baseApi}/transaksi/update`, {
                                  params: { transaksi_id: item.transaksi_id },
                                })
                                .then(() => location.reload());
                            }}
                          >
                            {item.status_transaksi == 1
                              ? "Lunas"
                              : "Belum Lunas"}
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

function getMonthName(date) {
  const month_index_start = date.indexOf(".");
  const month_index_end = date.indexOf(".", month_index_start + 1);
  const month_string = date.substring(month_index_start + 1, month_index_end);
  const year = date.substring(month_index_end + 1);
  return MONTH[parseInt(month_string) - 1] + " " + year;
}
