import { Inter } from "next/font/google";
import "../styles/globals.css";
import 'boxicons/css/boxicons.min.css';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Hugot App"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
