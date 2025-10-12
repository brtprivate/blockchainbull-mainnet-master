// Utility functions for formatting numbers and amounts

/**
 * Format BigInt to readable string with limited decimal places
 * @param amount - BigInt amount to format
 * @param decimals - Number of decimals in the BigInt (default: 18)
 * @param maxDecimals - Maximum decimal places to show (default: 2)
 * @returns Formatted string
 */
export const formatAmount = (amount: bigint, decimals: number = 18, maxDecimals: number = 2): string => {
  if (amount === 0n) {
    return '0';
  }

  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;

  if (remainder === 0n) {
    return quotient.toString();
  }

  // Convert remainder to decimal string
  const remainderStr = remainder.toString().padStart(decimals, '0');
  
  // Limit to maxDecimals places
  const limitedRemainder = remainderStr.substring(0, maxDecimals);
  
  // Remove trailing zeros
  const trimmedRemainder = limitedRemainder.replace(/0+$/, '');

  if (trimmedRemainder === '') {
    return quotient.toString();
  }

  return `${quotient}.${trimmedRemainder}`;
};

/**
 * Format number with commas and limited decimal places
 * @param value - Number or string to format
 * @param maxDecimals - Maximum decimal places (default: 2)
 * @returns Formatted string with commas
 */
export const formatNumber = (value: number | string, maxDecimals: number = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return '0';
  }

  // Format with commas and limit decimals
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

/**
 * Format BigInt amount with commas and USDT suffix
 * @param amount - BigInt amount to format
 * @param decimals - Number of decimals in the BigInt (default: 18)
 * @param maxDecimals - Maximum decimal places to show (default: 2)
 * @returns Formatted string with USDT suffix
 */
export const formatUSDT = (amount: bigint, decimals: number = 18, maxDecimals: number = 2): string => {
  const formatted = formatAmount(amount, decimals, maxDecimals);
  const withCommas = formatNumber(formatted, maxDecimals);
  return `${withCommas} USDT`;
};

/**
 * Format investment range display
 * @param minAmount - Minimum amount (BigInt)
 * @param maxAmount - Maximum amount (BigInt)
 * @param decimals - Number of decimals (default: 18)
 * @returns Formatted range string
 */
export const formatInvestmentRange = (minAmount: bigint, maxAmount: bigint, decimals: number = 18): string => {
  const min = formatNumber(formatAmount(minAmount, decimals, 2), 2);
  const max = formatNumber(formatAmount(maxAmount, decimals, 2), 2);
  return `${min} - ${max} USDT`;
};

/**
 * Format percentage with limited decimal places
 * @param value - Percentage value
 * @param maxDecimals - Maximum decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | bigint, maxDecimals: number = 2): string => {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return `${formatNumber(num, maxDecimals)}%`;
};

/**
 * Truncate address for display
 * @param address - Wallet address
 * @param startChars - Characters to show at start (default: 6)
 * @param endChars - Characters to show at end (default: 4)
 * @returns Truncated address
 */
export const truncateAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Format time ago from timestamp
 * @param timestamp - Unix timestamp
 * @returns Human readable time ago string
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - (timestamp * 1000); // Convert to milliseconds
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Format date from timestamp
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
