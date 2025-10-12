const { ethers } = require('ethers');

// The problematic address
const problematicAddress = '0x7eDbcb1df05E09cceB74cb4239b3856B33a292bF';

// Try to get the correct checksum by converting to lowercase first
try {
  // Convert to lowercase and then get the checksum
  const lowercaseAddress = problematicAddress.toLowerCase();
  const checksumAddress = ethers.getAddress(lowercaseAddress);
  console.log(`Original: ${problematicAddress}`);
  console.log(`Lowercase: ${lowercaseAddress}`);
  console.log(`Correct Checksum: ${checksumAddress}`);
} catch (error) {
  console.error(`Error with address:`, error.message);
}

// Also try with a completely new address
console.log("\nTrying with a new address:");
try {
  // Create a new address with the same numbers but different format
  const newAddress = '0x7edbcb1df05e09cceb74cb4239b3856b33a292bf';
  const checksumAddress = ethers.getAddress(newAddress);
  console.log(`New Address: ${newAddress}`);
  console.log(`Correct Checksum: ${checksumAddress}`);
} catch (error) {
  console.error(`Error with new address:`, error.message);
}
