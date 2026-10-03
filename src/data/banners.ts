export interface ShopableBanner {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export const BESHOPABLE_BANNERS: ShopableBanner[] = [
  {
    id: 'banner-lawn-festive',
    eyebrow: 'Direct Wholesale Sourcing',
    title: 'Luxury Swiss Lawn & Festive 3-Piece Collections',
    subtitle: 'Sourced straight from Faisalabad and Lahore master looms. Intricate schiffli embroidery, pure crinkle chiffon dupattas, and guaranteed colorfast fabric.',
    badge: 'Markaz Exclusive Drops',
    image: '/products/mkz-01-baroque-lawn.jpg',
    ctaText: 'Explore Lawn Collections',
    ctaLink: '/products?category=womens-unstitched-pret'
  },
  {
    id: 'banner-kaptaan-leather',
    eyebrow: 'Heritage Craftsmanship',
    title: 'Authentic Charsadda Kaptaan Pure Leather Chappal',
    subtitle: 'Hand-crafted from 100% full-grain cowhide with heavy-duty tire rubber grip soles. Open-parcel inspection allowed upon nationwide delivery.',
    badge: 'Artisan Sourced',
    image: '/products/mkz-18-kaptaan-chappal.jpg',
    ctaText: 'Shop Handcrafted Footwear',
    ctaLink: '/products?category=leather-footwear'
  },
  {
    id: 'banner-luxury-bedding',
    eyebrow: 'Boutique Home Textiles',
    title: '7-Piece Quilted Velvet Bridal Bedding Suites',
    subtitle: 'Heavy 350 GSM microfiber fill with wrinkle-free ruffle fitted sheets. Delivered in luxury leatherette travel bags with cash on delivery nationwide.',
    badge: 'Export Quality',
    image: '/products/mkz-09-bridal-velvet-bedding.jpg',
    ctaText: 'Discover Home Linen',
    ctaLink: '/products?category=bedding-home-linen'
  }
];
