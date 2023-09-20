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
        src="https://umami-sepia.vercel.app/script.js"
        data-website-id="ed667ccd-6ef9-4998-bc96-010bbc03a0e0"
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
