import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { config } from '../config/web3modal';
import {
  dwcContractInteractions,
  DWC_CONTRACT_ADDRESS,
  DWC_ABI,
  MAINNET_CHAIN_ID
} from '../services/contractService';
import { formatUnits } from 'viem';

interface MLMContextType {
  address: string | null;
  isConnected: boolean;
  isMLMRegistered: boolean;
  isLoading: boolean;
  isCorrectNetwork: boolean;
  registerMLM: (referrerAddress?: string) => Promise<boolean>;
  checkMLMRegistration: () => Promise<boolean>;
  getDirectReferrals: () => Promise<string[]>;
  getDirectReferralCount: () => Promise<number>;
  getReferrer: () => Promise<string>;
  getTotalRegistered: () => Promise<number>;
}

const MLMContext = createContext<MLMContextType | undefined>(undefined);

interface MLMProviderProps {
  children: ReactNode;
}

export const MLMProvider: React.FC<MLMProviderProps> = ({ children }) => {
  const { address, isConnected, chain } = useAccount();
  const [isMLMRegistered, setIsMLMRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isCorrectNetwork = chain?.id === MAINNET_CHAIN_ID;

  const checkMLMRegistration = async (): Promise<boolean> => {
    if (!address || !isCorrectNetwork) {
      console.log('checkMLMRegistration: No address or wrong network');
      setIsMLMRegistered(false);
      return false;
    }

    try {
      setIsLoading(true);
      console.log('checkMLMRegistration: Checking user record for', address);
      const userRecord = await dwcContractInteractions.getUserRecord(address as `0x${string}`);
      console.log('checkMLMRegistration: User record:', userRecord);
      setIsMLMRegistered(userRecord.referrer !== '0x0000000000000000000000000000000000000000');
      return userRecord.referrer !== '0x0000000000000000000000000000000000000000';
    } catch (error: any) {
      console.error('checkMLMRegistration: Error checking MLM registration:', error);
      console.error('checkMLMRegistration: Error details:', {
        message: error.message,
        code: error.code,
        data: error.data
      });
      setIsMLMRegistered(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterMLM = async (referrerAddress?: string): Promise<boolean> => {
    if (!address || !isCorrectNetwork) {
      throw new Error('Wallet not connected or wrong network. Please connect your wallet and switch to BSC Testnet.');
    }

    const refAddress = referrerAddress || '0xA841371376190547E54c8Fa72B0e684191E756c7';
    
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(refAddress)) {
      throw new Error('Invalid referrer address format. Please provide a valid Ethereum address.');
    }

    try {
      setIsLoading(true);
      console.log('Starting registration process with referrer:', refAddress);

      // Check if user already exists
      const userRecord = await dwcContractInteractions.getUserRecord(address as `0x${string}`);
      if (userRecord.isRegistered) {
        throw new Error('Address is already registered');
      }

      // Check if referrer exists (if not default)
      if (refAddress !== '0xA841371376190547E54c8Fa72B0e684191E756c7') {
        const referrerRecord = await dwcContractInteractions.getUserRecord(refAddress as `0x${string}`);
        if (!referrerRecord.isRegistered) {
          throw new Error('Invalid referrer address: Referrer must be registered');
        }
      }

      const hash = await dwcContractInteractions.registration(refAddress as `0x${string}`, address as `0x${string}`);
      console.log('Registration transaction submitted. Hash:', hash);

      setTimeout(async () => {
        try {
          await checkMLMRegistration();
          console.log('Registration status checked after transaction');
        } catch (checkError) {
          console.error('Error checking registration status after transaction:', checkError);
        }
      }, 5000);

      return true;
    } catch (error: any) {
      console.error('Error registering MLM:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        data: error.data,
        shortMessage: error.shortMessage,
        details: error.details
      });

      if (error.message?.includes('user rejected')) {
        throw new Error('Transaction was rejected by user. Please approve the transaction to complete registration.');
      } else if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient funds for gas fees. Ensure you have enough balance.');
      } else if (error.message?.includes('already registered')) {
        throw new Error('This wallet address is already registered in the system.');
      } else {
        throw new Error(`Registration failed: ${error.message || 'Unknown error occurred. Please try again.'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDirectReferrals = async (): Promise<string[]> => {
    if (!address || !isCorrectNetwork || !isMLMRegistered) return [];

    try {
      const referrals: string[] = [];
      const userRecord = await dwcContractInteractions.getUserRecord(address as `0x${string}`);
      if (Array.isArray(userRecord.referrals) && userRecord.referrals.length > 0) {
        for (const referral of userRecord.referrals) {
          if (referral !== '0x0000000000000000000000000000000000000000') {
            referrals.push(referral);
          }
        }
      }
      return referrals;
    } catch (error) {
      console.error('Error getting direct referrals:', error);
      return [];
    }
  };

  const handleGetDirectReferralCount = async (): Promise<number> => {
    if (!address || !isCorrectNetwork || !isMLMRegistered) return 0;

    try {
      const referrals = await handleGetDirectReferrals();
      return referrals.length;
    } catch (error) {
      console.error('Error getting direct referral count:', error);
      return 0;
    }
  };

  const handleGetReferrer = async (): Promise<string> => {
    if (!address || !isCorrectNetwork || !isMLMRegistered) return '';

    try {
      const userRecord = await dwcContractInteractions.getUserRecord(address as `0x${string}`);
      return userRecord.referrer || '';
    } catch (error) {
      console.error('Error getting referrer:', error);
      return '';
    }
  };

  const handleGetTotalRegistered = async (): Promise<number> => {
    try {
      let totalUsers = 0;
      for (let i = 0; i < 1000; i++) { // Limited to prevent infinite loop
        try {
          const user = await dwcContractInteractions.getUniqueUsers(BigInt(i));
          if (user === '0x0000000000000000000000000000000000000000') break;
          totalUsers++;
        } catch (error) {
          console.warn(`Error fetching user at index ${i}:`, error);
          break;
        }
      }
      return totalUsers;
    } catch (error) {
      console.error('Error getting total registered:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (isConnected && address && isCorrectNetwork) {
      checkMLMRegistration();
    } else {
      setIsMLMRegistered(false);
    }
  }, [isConnected, address, isCorrectNetwork]);

  const value: MLMContextType = {
    address: address ?? null,
    isConnected,
    isMLMRegistered,
    isLoading,
    isCorrectNetwork,
    registerMLM: handleRegisterMLM,
    checkMLMRegistration,
    getDirectReferrals: handleGetDirectReferrals,
    getDirectReferralCount: handleGetDirectReferralCount,
    getReferrer: handleGetReferrer,
    getTotalRegistered: handleGetTotalRegistered,
  };

  return (
    <MLMContext.Provider value={value}>
      {children}
    </MLMContext.Provider>
  );
};

export const useMLM = (): MLMContextType => {
  const context = useContext(MLMContext);
  if (context === undefined) {
    throw new Error('useMLM must be used within an MLMProvider');
  }
  return context;
};