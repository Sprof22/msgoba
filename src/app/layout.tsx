import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MSG Class of 2012 | In God Our Strength",
  description: "The official digital home of Mount Saint Gabriel's Secondary School Class of 2012.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
