import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillConnect — Local skills. Local jobs. Local money.",
  description:
    "SkillConnect connects trusted local skilled workers — plumbers, electricians, carpenters, painters and more — with clients in Chatsworth, Durban.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        {/* South African flag stripe */}
        <div className="flex h-1.5 w-full">
          <div className="flex-1 bg-[#007A4D]" />
          <div className="flex-1 bg-[#FFB612]" />
          <div className="flex-1 bg-[#DE3831]" />
          <div className="flex-1 bg-[#002395]" />
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-white border-b border-gray-100" />
        </div>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
