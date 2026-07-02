import type { Metadata } from "next";
import { CartDrawer } from "../components/cart/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "HeliPhone Aurora",
  description: "Dai san pham HeliPhone Aurora voi thiet ke cao cap, camera AI va hieu nang flagship."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
