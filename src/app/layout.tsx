import "../styles/globals.css";
import NavBar from "./_components/Nav";
import { Providers } from "./providers";
import  Script  from "next/script";

export const metadata = {
  title: "Need Help Missoula",
  //description: "Desc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <Script
          async
          defer
          data-website-id="02fa300e-06b5-43d0-a7e7-002ff7deb11e"
          src="https://umami-sepia.vercel.app/umami.js"
        ></Script>
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
