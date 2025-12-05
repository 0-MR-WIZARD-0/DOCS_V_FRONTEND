import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Диссертационный совет",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/png"/>
      </head>
      <body>
        <Header/>
          {children}
        <Footer/>
      </body>
    </html>
  );
}
