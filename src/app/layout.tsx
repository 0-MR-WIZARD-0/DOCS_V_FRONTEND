import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ReduxProvider from "@/store/ReduxProvider";
import AuthInit from "./providers/AuthInit";
import AdminGuard from "./AdminGuard";

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
          <ReduxProvider>
            <AuthInit/>
            <Header/>
              <AdminGuard>
                {children}
              </AdminGuard>
            <Footer/>
          </ReduxProvider>
      </body>
    </html>
  );
}
