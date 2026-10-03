import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// 1. Markaz / Wholesale Verified Sourcing Seal
export const IconMarkazVerified: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 2L15.09 5.26L19.5 5.74L19.82 10.21L23 13.36L20.18 16.85L20.82 21.32L16.41 21.95L13.5 24L10.59 21.95L6.18 21.32L6.82 16.85L4 13.36L7.18 10.21L7.5 5.74L11.91 5.26L12 2Z"
      fill="currentColor"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 12.5L10.8 14.8L15.5 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Cash on Delivery (COD) Nationwide Icon
export const IconCashOnDelivery: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="2" y="5" width="20" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="11.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5.5 8.5H5.51" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18.5 14.5H18.51" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M7 19.5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 22H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 3. Open Box Inspection Before Payment Guarantee
export const IconParcelInspection: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3.5 7.5L12 3L20.5 7.5L12 12L3.5 7.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 7.5V16.5L12 21V12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.5 7.5V13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.1" />
    <path d="M20 20L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 4. Precision Geometric Flash Sale Icon
export const IconFlashSale: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M13 2L3.5 13.5H11.5L9.5 22L20.5 9.5H13.5L15 2H13Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// 5. Luxury Perforated Voucher Ticket
export const IconVoucherTicket: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3 8.5C4.38 8.5 5.5 7.38 5.5 6H18.5C18.5 7.38 19.62 8.5 21 8.5V15.5C19.62 15.5 18.5 16.62 18.5 18H5.5C5.5 16.62 4.38 15.5 3 15.5V8.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 7V17" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 2" strokeLinecap="round" />
    <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// 6. Direct Factory / Artisan Mill Sourcing
export const IconDirectFactory: React.FC<IconProps> = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3 21H21M4 21V10L10 14V10L16 14V3H20V21"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M7 16V17M7 12V13M17 7V8M17 11V12M17 15V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 7. Women's Unstitched Lawn & Festive Wear
export const IconLawnSuits: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M9 3L4 6L6.5 10L9 8V21H15V8L17.5 10L20 6L15 3C15 5 9 5 9 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 8. Men's Eastern Wear & Shalwar Kameez Fabric
export const IconMensEastern: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M4 6L9 3H15L20 6L18 10L15 8.5V21H9V8.5L6 10L4 6Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 3V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="7" r="0.75" fill="currentColor" />
    <circle cx="12" cy="9.5" r="0.75" fill="currentColor" />
  </svg>
);

// 9. Luxury Bedding & Home Textiles
export const IconBeddingLinen: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3 7H21V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 12H21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <rect x="5.5" y="4" width="5.5" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="13" y="4" width="5.5" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

// 10. Concentrated Attar & Fragrance Decanter
export const IconAttarOudh: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="10" y="2" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 5V8" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M6 10C6 8.89543 6.89543 8 8 8H16C17.1046 8 18 8.89543 18 10V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V10Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" />
  </svg>
);

// 11. Handcrafted Leather & Footwear (Kaptaan Chappal / Leather)
export const IconLeatherCraft: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M3 18C3 16.5 4.5 15 7 15H17C19.5 15 21 16.5 21 18V19.5C21 20.3284 20.3284 21 19.5 21H4.5C3.67157 21 3 20.3284 3 19.5V18Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M6 15L10 6C10.5 4.5 12 4 13.5 4.5C15 5 15.5 6.5 15 8L12.5 15"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 10H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 12. Smart Wearables & Tech
export const IconSmartTech: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <rect x="7" y="6" width="10" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 6V2.5C9 2.22386 9.22386 2 9.5 2H14.5C14.7761 2 15 2.22386 15 2.5V6" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 18V21.5C9 21.7761 9.22386 22 9.5 22H14.5C14.7761 22 15 21.7761 15 21.5V18" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

// 13. Kitchen Appliances & Home Tools
export const IconKitchenPro: React.FC<IconProps> = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M5 4H19V7C19 10.866 15.866 14 12 14C8.13401 14 5 10.866 5 7V4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M12 14V20M8 20H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 2H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// 14. Reseller Wholesale Profit Tag
export const IconResellerMargin: React.FC<IconProps> = ({ className = 'w-4 h-4', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M20.59 13.41L13.42 20.58C13.04 20.95 12.53 21.16 12 21.16C11.47 21.16 10.96 20.95 10.59 20.58L2.41 12.41C2.15 12.15 2 11.79 2 11.41V4C2 2.9 2.9 2 4 2H11.41C11.79 2 12.15 2.15 12.41 2.41L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="7" r="1.5" fill="currentColor" />
  </svg>
);
