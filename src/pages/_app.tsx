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

ReactModal.setAppElement("#__next");

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Script
        src="https://umami-sepia.vercel.app/umami.js"
        data-website-id={"ef3e6196-b4b5-4103-8bc2-68db63433e81"}
        id="umami-script"
        async
        defer
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
