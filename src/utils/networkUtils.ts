import { switchChain } from '@wagmi/core';
import { config } from '../config/web3modal';
import { bsc } from 'wagmi/chains';
import { NETWORK_CONFIG } from '../config';

/**
 * Utility functions for network management and validation
 */

/**
 * Check if the current network is the correct one
 */
export const isCorrectNetwork = (chainId?: number): boolean => {
  return chainId === NETWORK_CONFIG.chainId;
};

/**
 * Switch to the correct network (BSC Mainnet)
 */
export const switchToCorrectNetwork = async (): Promise<boolean> => {
  try {
    await switchChain(config, { chainId: NETWORK_CONFIG.chainId });
    return true;
  } catch (error) {
    console.error('Error switching network:', error);
    return false;
  }
};

/**
 * Add BSC Mainnet to wallet if not already present
 */
export const addBSCToWallet = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      return false;
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
          chainName: NETWORK_CONFIG.name,
          nativeCurrency: NETWORK_CONFIG.nativeCurrency,
          rpcUrls: [NETWORK_CONFIG.rpcUrl],
          blockExplorerUrls: [NETWORK_CONFIG.explorerUrl],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Error adding BSC to wallet:', error);
    return false;
  }
};

/**
 * Validate network connection and switch if necessary
 */
export const validateNetwork = async (currentChainId?: number): Promise<boolean> => {
  if (isCorrectNetwork(currentChainId)) {
    return true;
  }

  try {
    // Try to switch network first
    const switched = await switchToCorrectNetwork();
    if (switched) {
      return true;
    }

    // If switching fails, try to add the network
    return await addBSCToWallet();
  } catch (error) {
    console.error('Error validating network:', error);
    return false;
  }
};

/**
 * Get network name from chain ID
 */
export const getNetworkName = (chainId?: number): string => {
  switch (chainId) {
    case 1:
      return 'Ethereum Mainnet';
    case 56:
      return 'BSC Mainnet';
    case 97:
      return 'BSC Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Polygon Mumbai';
    default:
      return `Unknown Network (${chainId})`;
  }
};

/**
 * Format error messages for network issues
 */
export const formatNetworkError = (error: any): string => {
  if (error?.message?.includes('User rejected')) {
    return 'Transaction was rejected by user';
  }
  
  if (error?.message?.includes('gasLimit') || error?.message?.includes('Cannot destructure')) {
    return 'Network configuration error. Please ensure you are connected to BSC Mainnet.';
  }
  
  if (error?.message?.includes('insufficient funds')) {
    return 'Insufficient funds for transaction. Please ensure you have enough BNB for gas fees.';
  }
  
  return error?.message || 'Unknown network error occurred';
};
