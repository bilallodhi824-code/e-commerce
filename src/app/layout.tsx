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
import { InventoryProvider } from '@/context/InventoryContext';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://beshopable.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BeShopable | Direct Sourced & Markaz Verified Wholesale Store',
    template: '%s | BeShopable Wholesale',
  },
  description: 'Pakistan’s premier wholesale platform for authentic unstitched lawn, handcrafted pure leather Peshawari chappals, luxury bridal bedding, artisanal attar, and smart lifestyle essentials with open-parcel Cash on Delivery nationwide.',
  keywords: [
    'beshopable',
    'markaz wholesale',
    'wholesale store pakistan',
    'unstitched lawn suits',
    'baroque lawn collection',
    'peshawari chappal genuine leather',
    'bridal bedding linen',
    'cambodian oudh attar',
    'cash on delivery pakistan',
    'open parcel delivery',
    'direct factory sourcing',
  ],
  authors: [{ name: 'BeShopable Commerce' }],
  creator: 'BeShopable Wholesale',
  publisher: 'BeShopable Logistics & Sourcing Network',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BeShopable | Direct Sourced & Markaz Verified Wholesale Store',
    description: 'Direct mill prices, 100% verified Pakistani artisanal products, and nationwide Cash on Delivery with open-parcel check.',
    url: siteUrl,
    siteName: 'BeShopable',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeShopable | Pakistan Direct Sourced Wholesale',
    description: 'Wholesale prices for authentic Pakistani lawn, pure leather shoes, luxury home textiles, and smart electronics.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${siteUrl}/#organization`,
                  name: 'BeShopable',
                  url: siteUrl,
                  logo: `${siteUrl}/favicon.ico`,
                  description: 'Pakistan’s direct-sourced and Markaz-verified wholesale e-commerce platform.',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+92-300-1129959',
                    contactType: 'customer service',
                    areaServed: 'PK',
                    availableLanguage: ['en', 'ur'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${siteUrl}/#website`,
                  url: siteUrl,
                  name: 'BeShopable',
                  publisher: {
                    '@id': `${siteUrl}/#organization`,
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/products?search={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans" suppressHydrationWarning>
        <SplashScreen />
        <AuthProvider>
          <InventoryProvider>
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
          </InventoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
