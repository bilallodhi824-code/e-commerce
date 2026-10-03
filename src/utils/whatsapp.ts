/**
 * Centralized WhatsApp helper & contact configuration
 * Primary Business Number: 03001129959 (+92 300 1129959)
 */

export const WHATSAPP_RAW_NUMBER = '03001129959';
export const WHATSAPP_INTL_NUMBER = '923001129959';
export const WHATSAPP_DISPLAY_NUMBER = '+92 300 1129959';

export const getWhatsAppUrl = (customMessage?: string): string => {
  const defaultText =
    customMessage ||
    'Hello BeShopable Customer Support! I would like to inquire about products and delivery.';
  return `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent(defaultText)}`;
};

export const getProductWhatsAppUrl = (
  productTitle: string,
  productId: string,
  price: number,
  selectedColor?: string,
  selectedSize?: string,
  skuCode?: string
): string => {
  const lines = [
    '[*OFFICIAL ORDER & VERIFICATION INQUIRY*]',
    '',
    `Hello BeShopable, I would like to confirm availability for:`,
    `*${productTitle}*`,
    `Catalog ID: ${skuCode || productId}`,
    `Price: Rs. ${price.toLocaleString('en-PK')}`
  ];

  if (selectedColor) lines.push(`Selected Shade/Color: ${selectedColor}`);
  if (selectedSize) lines.push(`Selected Size/Cut: ${selectedSize}`);

  lines.push('');
  lines.push('Payment Method: Cash on Delivery (COD) with Open-Parcel Inspection Guarantee.');
  lines.push('Kindly confirm order dispatch timing. Thank you!');

  return `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
};
