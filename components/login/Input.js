import React, { useContext } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { UserContext } from "../../store/authentication";
import { useRouter } from "next/router";

export default function Input() {
  const { user, setUser } = useContext(UserContext);

  const router = useRouter();
  return (
    <React.Fragment>
      <Grid container spacing={2} direction="column">
        <Grid item>
          <TextField
            margin="dense"
            label="Username"
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item>
          <TextField
            margin="dense"
            label="Password"
            variant="outlined"
            fullWidth
            sx={{ borderRadius: "50%" }}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              setUser(true);
              router.push("/");
            }}
            variant="contained"
            fullWidth
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
