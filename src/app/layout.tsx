import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const metadata: Metadata = {
  title: 'BeShopable | Direct Sourced & Markaz Verified Wholesale Store',
  description: 'Authentic Eastern lawn collections, pure leather footwear, luxury bedding, and smart lifestyle gear. Nationwide Cash on Delivery with open-parcel inspection.',
  keywords: 'beshopable, markaz app, wholesale pakistan, unstitched lawn, peshawari chappal, bridal bedding, cash on delivery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
        <SplashScreen />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <CartDrawer />
              <AuthModal />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-20 md:pb-8">
                {children}
              </main>
              <Footer />
              <MobileBottomNav />
              <WhatsAppButton />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
