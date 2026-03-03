import "./globals.css";
import AuthSessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import CustomThemeProvider from "@/components/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <AuthSessionProvider>
            <CustomThemeProvider>
              <Navbar />
              <main
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  padding: "24px 16px",
                  minHeight: "calc(100vh - 64px)",
                }}
              >
                {children}
              </main>
            </CustomThemeProvider>
          </AuthSessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

