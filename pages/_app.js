import "../styles/globals.css";
import Layout from "../components/layout/Navbar/Navbar";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { UserContext } from "../store/authentication";
import { useMemo, useState } from "react";
import { RouteGuard } from "../components/RouteGuard";

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {router.pathname != "/login" && <Layout />}
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Box>
    </UserContext.Provider>
  );
}

const authenticated = () => {};
