import { apiService } from './apiService';
import { dwcContractInteractions } from './contractService';
import { formatUnits } from 'viem';

export interface InvestmentTrackingData {
  userAddress: string;
  amount: number;
  packageIndex: number;
  transactionHash: string;
  timestamp: string;
}

class InvestmentTracker {
  /**
   * Track user registration and store in database
   */
  async trackUserRegistration(userAddress: string, referrerAddress: string): Promise<boolean> {
    try {
      console.log(`Tracking user registration: ${userAddress} with referrer: ${referrerAddress}`);
      
      // Call API to register user in database
      const success = await apiService.registerUser(userAddress, referrerAddress);
      
      if (success) {
        console.log(`✅ User ${userAddress} registered successfully in database`);
        return true;
      } else {
        console.error(`❌ Failed to register user ${userAddress} in database`);
        return false;
      }
    } catch (error) {
      console.error('Error tracking user registration:', error);
      return false;
    }
  }

  /**
   * Track user investment and store in database
   */
  async trackUserInvestment(
    userAddress: string,
    amount: number,
    packageIndex: number,
    transactionHash: string
  ): Promise<boolean> {
    try {
      console.log(`Tracking user investment: ${userAddress} - ${amount} USDC for package ${packageIndex}`);
      
      // Call API to record investment in database
      const success = await apiService.recordInvestment(
        userAddress,
        amount,
        packageIndex,
        transactionHash
      );
      
      if (success) {
        console.log(`✅ Investment tracked successfully for ${userAddress}`);
        
        // Update referral commissions for all levels
        await this.updateReferralCommissions(userAddress, amount);
        
        return true;
      } else {
        console.error(`❌ Failed to track investment for ${userAddress}`);
        return false;
      }
    } catch (error) {
      console.error('Error tracking user investment:', error);
      return false;
    }
  }

  /**
   * Update referral commissions for all levels
   */
  private async updateReferralCommissions(userAddress: string, investmentAmount: number): Promise<void> {
    try {
      // Get user's referrer chain (up to 10 levels)
      const referrerChain = await this.getReferrerChain(userAddress);
      
      // Calculate and update commissions for each level
      for (let level = 1; level <= referrerChain.length && level <= 10; level++) {
        const referrerAddress = referrerChain[level - 1];
        if (referrerAddress && referrerAddress !== '0x0000000000000000000000000000000000000000') {
          // Calculate commission based on level
          const commissionRate = this.getCommissionRate(level);
          const commission = investmentAmount * commissionRate;
          
          // Update commission in database
          await apiService.updateReferralCommission(
            referrerAddress,
            userAddress,
            commission,
            level
          );
          
          console.log(`✅ Updated commission for ${referrerAddress} (Level ${level}): ${commission} USDC`);
        }
      }
    } catch (error) {
      console.error('Error updating referral commissions:', error);
    }
  }

  /**
   * Get referrer chain for a user (up to 10 levels)
   */
  private async getReferrerChain(userAddress: string): Promise<string[]> {
    const referrerChain: string[] = [];
    let currentAddress = userAddress;
    
    for (let level = 1; level <= 10; level++) {
      try {
        const userRecord = await dwcContractInteractions.getUserRecord(currentAddress);
        if (userRecord.referrer && userRecord.referrer !== '0x0000000000000000000000000000000000000000') {
          referrerChain.push(userRecord.referrer);
          currentAddress = userRecord.referrer;
        } else {
          break;
        }
      } catch (error) {
        console.warn(`Error fetching referrer for level ${level}:`, error);
        break;
      }
    }
    
    return referrerChain;
  }

  /**
   * Get commission rate for a specific level
   */
  private getCommissionRate(level: number): number {
    // Commission rates for different levels (as percentages)
    const commissionRates: { [key: number]: number } = {
      1: 0.10,  // 10% for level 1
      2: 0.05,  // 5% for level 2
      3: 0.03,  // 3% for level 3
      4: 0.02,  // 2% for level 4
      5: 0.02,  // 2% for level 5
      6: 0.01,  // 1% for level 6
      7: 0.01,  // 1% for level 7
      8: 0.01,  // 1% for level 8
      9: 0.01,  // 1% for level 9
      10: 0.01, // 1% for level 10
    };
    
    return commissionRates[level] || 0;
  }

  /**
   * Get user's investment history
   */
  async getUserInvestmentHistory(userAddress: string): Promise<InvestmentTrackingData[]> {
    try {
      return await apiService.getUserInvestments(userAddress);
    } catch (error) {
      console.error('Error fetching user investment history:', error);
      return [];
    }
  }

  /**
   * Get user's referral statistics
   */
  async getUserReferralStats(userAddress: string) {
    try {
      return await apiService.getUserReferralStats(userAddress);
    } catch (error) {
      console.error('Error fetching user referral stats:', error);
      return null;
    }
  }

  /**
   * Get level-wise referral data
   */
  async getLevelWiseReferrals(userAddress: string) {
    try {
      return await apiService.getLevelWiseReferrals(userAddress);
    } catch (error) {
      console.error('Error fetching level-wise referrals:', error);
      return [];
    }
  }

  /**
   * Check if user is registered in database
   */
  async isUserRegistered(userAddress: string): Promise<boolean> {
    try {
      return await apiService.isUserRegistered(userAddress);
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  }
}

export const investmentTracker = new InvestmentTracker();
export default investmentTracker;

