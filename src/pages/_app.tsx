import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { api } from "../utils/api";

import "../styles/globals.css";
import ReactModal from "react-modal";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Router } from "next/router";
import LoadingPage from "../components/LoadingPage";

ReactModal.setAppElement("#__next");

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <SessionProvider session={session}>
      <Script
        src="https://umami-sepia.vercel.app/umami.js"
        data-website-id={"ef3e6196-b4b5-4103-8bc2-68db63433e81"}
        id="umami-script"
        async
        defer
      />
      {loading ? <LoadingPage /> : <Component {...pageProps} />}
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
