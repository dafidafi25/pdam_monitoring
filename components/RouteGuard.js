import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { UserContext } from "../store/authentication";
import getLocalStorage from "../store/getLocalStorage";
export { RouteGuard };

let data = {};
if (typeof window !== "undefined") {
  data = localStorage.getItem("username");
}
function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState(data);

  useEffect(() => {
    authCheck(router.asPath);
    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/login"];
    const path = url.split("?")[0];
    if (user == undefined && !publicPaths.includes(path)) {
      setAuthorized(false);
      location.href = "/login";
    } else {
      setAuthorized(true);
    }
  }

  return authorized && children;
}
