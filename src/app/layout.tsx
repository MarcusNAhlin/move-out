import '@mantine/core/styles.css';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MoveOut",
  description: "Keep track of your boxes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <head>
          <ColorSchemeScript />
          <link rel="shortcut icon" href="/favicon.svg" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} body`}>
          {/* <MantineProvider
            withNormalizeCSS
            theme={{ colorScheme: 'dark', }}
            >{children}</MantineProvider> */}

        <MantineProvider theme={theme} defaultColorScheme="dark">
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              marginTop: "10vh",
              alignItems: "center",
              textAlign: "center",
              overflowX: "hidden",
            }}
          >
            {children}
          </div>
        </MantineProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
