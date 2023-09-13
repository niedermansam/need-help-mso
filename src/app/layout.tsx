
import "../styles/globals.css";
import NavBar from "./components/Nav";
import { Providers } from "./providers";

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
      <body>
        <Providers>
          <NavBar />
          {children}</Providers>
      </body>
    </html>
  );
}
