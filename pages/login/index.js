import React, { useContext } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import Image from "next/image";
import { UserContext } from "../../store/authentication";
import Link from "next/link";
import Input from "../../components/login/Input";

const logo_small = require("../../public/logo_small.jpeg");

export default function Login() {
  return (
    <Grid
      container
      padding={3}
      align="center"
      justify="center"
      direction="column"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        width: 400,
      }}
    >
      <Grid item>
        <Typography paddingBottom={2} variant="h4">
          Login Page Tugas PDAM Monitoring
        </Typography>
      </Grid>
      <Grid item>
        <Image alt="Logo_login" src={logo_small} width={200} height={200} />
      </Grid>
      <Grid item>
        <Input />
      </Grid>
    </Grid>
  );
}
