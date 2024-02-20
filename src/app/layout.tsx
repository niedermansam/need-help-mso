import "../styles/globals.css";
import NavBar from "@/components/Nav";
import { Providers } from "../components/providers";
import Script from "next/script";
import { env } from "@/env.mjs";

export const metadata = {
  title: "Need Help Missoula",
  description:
    "A directory of resources for people who need a hand in Missoula and Western Montana",

  openGraph: {
    title: "Need Help Missoula",
    description:
      "A directory of resources for people who need a hand in Missoula and Western Montana.",
    url: "https://www.needhelpmissoula.org/",
    siteName: "needhelpmissoula.org",
    images: [
      {
        url: "/img/logo.png",
        width: 202,
        height: 192,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
  {env.NODE_ENV === "production" && <Script
    async
    src="https://analytics.needhelpmissoula.org/script.js"
    data-website-id="5654ddf8-3858-4e37-88a5-4f0873970aa4"
  ></Script>}
      <body className="bg-stone-50">
        <Providers>
          <NavBar />
          <main className=" bg-stone-50">
            <div className="px-4 py-6 sm:px-8 md:px-12">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
