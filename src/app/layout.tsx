import "../styles/globals.css";
import NavBar from "@/components/Nav";
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
        src="https://analytics.needhelpmissoula.org/script.js"
        data-website-id="5654ddf8-3858-4e37-88a5-4f0873970aa4"
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
