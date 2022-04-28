import { TableRow, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { UserContext } from "../store/authentication";
import InvertColorsOutlinedIcon from "@mui/icons-material/InvertColorsOutlined";
import Home1 from "../components/dashboard/user";
import axios from "axios";
import getEnvironment from "../store/getEnvironment";
import Swal from "sweetalert2";

export async function getServerSideProps() {
  const { baseApi } = await getEnvironment();
  const devices = await axios.get(`${baseApi}/devices/list`);

  return {
    props: { devices: devices.data }, // will be passed to the page component as props
  };
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#1976D2",
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Home({ devices }) {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    Swal.close();
  }, []);

  return (
    <>
      <Grid container>
        {devices.map((item) => {
          return (
            <Home1
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              status={item.status}
            />
          );
        })}
      </Grid>
    </>
  );
}
