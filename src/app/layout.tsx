import "./globals.css";

import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import AuthProvider from "@/context/AuthContext";

export const metadata = {
  title: "trackify",
  description: "Document and discover artist tracklists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}