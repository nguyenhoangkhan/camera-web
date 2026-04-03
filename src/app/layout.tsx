import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/providers/Providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Canon Store',
    default: 'Canon Camera E-commerce & Rental System',
  },
  description: 'Chuyên cung cấp các dòng máy ảnh Canon chuyên nghiệp mua và thuê toàn quốc.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-outfit">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
