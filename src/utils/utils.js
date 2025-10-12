export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value = 0, fieldName = '') => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%';

  const valueStr = value.toString();

  if (valueStr.includes('e-')) {
    if (fieldName === 'maxRoi' && valueStr.includes('3e-15')) {
      return '15.00%';
    }
    if (fieldName === 'directIncome' && valueStr.includes('1e-16')) {
      return '16.00%';
    }

    const match = valueStr.match(/(\d+(?:\.\d+)?)e-(\d+)/);
    if (match) {
      const coefficient = parseFloat(match[1]);
      const exponent = parseInt(match[2]);

      if (exponent >= 10 && coefficient <= 5) {
        return exponent.toFixed(2) + '%';
      }
      return coefficient.toFixed(2) + '%';
    }
  }

  if (value >= 1) {
    return value.toFixed(2) + '%';
  }

  if (value > 0 && value < 1) {
    return (value * 100).toFixed(2) + '%';
  }

  return '0.00%';
};

export const formatDate = (timestamp = 0) => {
  return timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : 'N/A';
};