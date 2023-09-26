import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Axios from "axios";
import { AuthProvider } from "@/context/auth";
import AuthContext from "@/context/AuthContext";

const oepnSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "연습1",
    template: "연습2 | %s",
  },
  description: "연습3",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
  Axios.defaults.withCredentials = true;

  return (
    <html lang="ko" className={oepnSans.className}>
      <body className="w-full flex flex-col overflow-auto mx-auto bg-gray-200">
        <AuthProvider>
          <header className="sticky top-0 bg-white z-10 border-b">
            <div className="max-w-screen-xl mx-auto">
              <Navbar />
            </div>
          </header>
          <main className="w-full flex justify-center md:max-w-screen-xl mx-auto flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
