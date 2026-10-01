import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartWishlistProvider } from "@/context/CartWishlistContext";
import MobileBottomNav from "@/components/MobileBottomNav";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Suratbazar | Surat's Finest Handcrafted Sarees & Silk Emporium",
  description: "Discover timeless Banarasi, Kanjeevaram, Paithani, Organza, and festive wedding drapes directly from Surat's premier silk treasury.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF7F2] text-[#1F1815] selection:bg-[#E8C574] selection:text-[#2A170F] pb-16 lg:pb-0">
        <CartWishlistProvider>
          {children}
          {/* Fixed Mobile Bottom Navigation Tab (Hidden on Desktop) */}
          <MobileBottomNav />
        </CartWishlistProvider>
      </body>
    </html>
  );
}
