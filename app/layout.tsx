import ActiveStatus from "./components/ActiveStatus";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Intel Messenger",
  description: "Intel Messenger",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log = console.warn = console.error = () => {};
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
