import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "./Fonts/WEB/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "./Fonts/WEB/fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "./Fonts/WEB/fonts/Satoshi-Bold.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
})


export const metadata: Metadata = {
  title: "Dream House Sale",
  description: "Dream House Sale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} font-sans bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
