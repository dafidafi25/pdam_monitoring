import {
  Typography,
  TableRow,
  Box,
  TextField,
  Grid,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../store/authentication";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRouter } from "next/router";
import { Switch } from "@material-ui/core";
import Swal from "sweetalert2";
import axios from "axios";
import getEnvironment from "../../store/getEnvironment";

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

export default function Home1({ name, price, id, status }) {
  const { user, setUser } = useContext(UserContext);
  const [debit, setDebit] = useState(0);
  const [currStatus, setCurrStatus] = useState(
    parseInt(status) == 1 ? true : false
  );
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const getDeviceData = async (id) => {
      var today = new Date();
      var date =
        today.getFullYear() +
        "." +
        (today.getMonth() + 1) +
        "." +
        today.getDate();

      const { baseApi } = await getEnvironment();

      const device = await axios.get(`${baseApi}/device/data/${id}`, {
        params: {
          startMonth: date,
          endMonth: date,
        },
      });
      const data = device.data.detail ? device.data.detail : 0;
      if (data.length > 0) {
        setDebit(data[0].measurement);
      } else {
        setDebit(0);
      }
      //
    };

    getDeviceData(id);
  }, [id]);

  const router = useRouter();

  const handleValveChange = (e) => {
    console.log(e.target.checked);
    setCurrStatus(!e.target.checked);
    setValve(!e.target.checked);
  };

  const setValve = async (trigger) => {
    const { baseApi } = await getEnvironment();

    Swal.fire({
      title: "Updating Device",
      didOpen: () => {
        Swal.showLoading();
      },
    });
    await axios.post(`${baseApi}/device/update/status/${id}`, {
      status: trigger == true ? 1 : 0,
    });

    Swal.close();
  };

  return (
    <Box
      variant="outlined"
      sx={{
        backgroundColor: "white",
        maxWidth: 300,
        borderRadius: 2,
        paddingTop: 2,
        marginX: 1,
        paddingX: 2,
        marginY: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignContent="center"
        spacing={2}
      >
        <SettingsIcon
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => {
            Swal.fire({
              title: "Loading Data",
              didOpen: () => {
                Swal.showLoading();
              },
            });

            location.href = "/detail?id=" + id;
          }}
          style={{ color: isHover ? "1976D2" : "AA9E9E" }}
        />
        <Typography align="center" fontWeight={300}>
          {name}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "flex",
          marginY: 1,
          justifyContent: "center",
          direction: "column",
        }}
      >
        <Grid>
          <div>Biaya</div>
        </Grid>
        <Grid sx={{ marginLeft: 3 }}>
          <div>:</div>
        </Grid>
        <Grid sx={{ marginLeft: 3 }}>
          <div>Rp. {price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</div>
        </Grid>
        <div></div>
      </Box>
      <Grid
        container
        justifyContent={"center"}
        direction="column"
        alignItems="center"
        my={3}
      >
        <InvertColorsOutlinedIcon color="primary" sx={{ fontSize: 80 }} />
        <Switch checked={!currStatus} onChange={handleValveChange} />
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        spacing={2}
      >
        <TextField
          rows={6}
          InputProps={{
            readOnly: true,
            endAdornment: "L",
          }}
          value={Math.round(debit / 10) / 100}
          size="small"
          fullWidth
        />
      </Stack>
    </Box>
  );
}
