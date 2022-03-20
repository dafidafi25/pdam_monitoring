import React, { useContext } from "react";
import { Grid, Box, TextField, Button } from "@mui/material";
import { UserContext } from "../../store/authentication";
import { useRouter } from "next/router";

const loginData = [
  {
    id: "admin",
    pass: 123,
    role: "admin",
  },
  {
    id: "alif",
    pass: 123,
    role: "user",
  },
];

export default function Input() {
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();
  return (
    <React.Fragment>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          const { username, password } = e.target;

          const indexArr = loginData.findIndex(
            ({ id }) => id == username.value
          );
          if (indexArr == -1) return;
          console.log(loginData[indexArr].pass == password.value);
          if (loginData[indexArr].pass != password.value) return;
          console.log("masok");
          const userData = {
            username: username.value,
            password: password.value,
            role: loginData[indexArr].role,
          };
          setUser(userData);
          router.push({ pathname: "/" });
        }}
      >
        <Grid container spacing={2} direction="column">
          {" "}
          <Grid item>
            <TextField
              margin="dense"
              label="Username"
              variant="outlined"
              fullWidth
              name="username"
            />
          </Grid>
          <Grid item>
            <TextField
              margin="dense"
              label="Password"
              variant="outlined"
              fullWidth
              sx={{ borderRadius: "50%" }}
              name="password"
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
}
