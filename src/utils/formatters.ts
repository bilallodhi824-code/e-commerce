/**
 * Currency, number and date formatters for BeShopable
 */

export const formatPrice = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
};

export const formatDiscount = (discount: number): string => {
  return `-${discount}%`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateString;
};
