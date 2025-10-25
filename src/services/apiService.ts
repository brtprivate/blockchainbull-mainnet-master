import axios from 'axios';

const API_BASE_URL = 'https://db.blockchainbull.io/api'; // Always use production API

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Don't send cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);

    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('API server is not running. Some features may not work.');
      // Don't throw error, just log warning
      return Promise.resolve({ data: { success: false, message: 'API server unavailable' } });
    }

    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      console.warn('Network error. Please check your connection.');
      return Promise.resolve({ data: { success: false, message: 'Network error' } });
    }

    // Handle CSP blocked requests
    if (error.message?.includes('blocked:csp') || error.message?.includes('CSP')) {
      console.warn('Request blocked by Content Security Policy. Please check CSP settings.');
      return Promise.resolve({ data: { success: false, message: 'CSP blocked request' } });
    }

    return Promise.reject(error);
  }
);

export interface UserRegistration {
  address: string;
  referrerAddress: string;
  registrationDate?: string;
}

export interface InvestmentRecord {
  userAddress: string;
  amount: number;
  packageIndex: number;
  transactionHash: string;
  timestamp: string;
}

export interface ReferralData {
  level: number;
  count: number;
  addresses: string[];
  totalInvestment: number;
  totalEarnings: number;
}

export interface UserStats {
  totalReferrals: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  level4Count: number;
  level5Count: number;
  level6Count: number;
  level7Count: number;
  level8Count: number;
  level9Count: number;
  level10Count: number;
  totalInvestment: number;
  totalEarnings: number;
  totalCommission: number;
  registrationDate: string | null;
  userExists: boolean;
}

class ApiService {
  /**
   * Register a new user with referrer
   */
  async registerUser(address: string, referrerAddress: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/users/register', {
        address: address.toLowerCase(),
        referrerAddress: referrerAddress.toLowerCase(),
        registrationDate: new Date().toISOString()
      });

      if (response.data.success) {
        console.log(`User ${address} registered successfully with referrer ${referrerAddress}`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error registering user:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to register user');
    }
  }

  /**
   * Record user investment
   */
  async recordInvestment(
    userAddress: string,
    amount: number,
    packageIndex: number,
    transactionHash: string
  ): Promise<boolean> {
    try {
      const response = await apiClient.post('/investments/record', {
        userAddress: userAddress.toLowerCase(),
        amount,
        packageIndex,
        transactionHash,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        console.log(`Investment recorded for ${userAddress}: ${amount} USDC`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error recording investment:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to record investment');
    }
  }

  /**
   * Get user referral statistics
   */
  async getUserReferralStats(address: string): Promise<UserStats> {
    try {
      const response = await apiClient.get(`/referrals/stats/${address.toLowerCase()}`);
      const data = response.data.data;

      return {
        totalReferrals: data.totalReferrals || 0,
        level1Count: data.level1Count || 0,
        level2Count: data.level2Count || 0,
        level3Count: data.level3Count || 0,
        level4Count: data.level4Count || 0,
        level5Count: data.level5Count || 0,
        level6Count: data.level6Count || 0,
        level7Count: data.level7Count || 0,
        level8Count: data.level8Count || 0,
        level9Count: data.level9Count || 0,
        level10Count: data.level10Count || 0,
        totalInvestment: data.totalInvestment || 0,
        totalEarnings: data.totalEarnings || 0,
        totalCommission: data.totalCommission || 0,
        registrationDate: data.registrationDate,
        userExists: data.userExists || false
      };
    } catch (error: any) {
      console.error('Error fetching user stats:', error.response?.data || error.message);
      // Return fallback data instead of throwing error
      return {
        totalReferrals: 0,
        level1Count: 0,
        level2Count: 0,
        level3Count: 0,
        level4Count: 0,
        level5Count: 0,
        level6Count: 0,
        level7Count: 0,
        level8Count: 0,
        level9Count: 0,
        level10Count: 0,
        totalInvestment: 0,
        totalEarnings: 0,
        totalCommission: 0,
        registrationDate: null,
        userExists: false
      };
    }
  }

  /**
   * Get level-wise referral data
   */
  async getLevelWiseReferrals(address: string): Promise<ReferralData[]> {
    try {
      const response = await apiClient.get(`/referrals/level-wise/${address.toLowerCase()}`);
      const data = response.data.data;

      // Transform the API response into the expected array format
      const levelWiseArray: ReferralData[] = [];

      for (let i = 1; i <= 10; i++) {
        const levelKey = `level${i}`;
        const levelData = data[levelKey];

        if (levelData) {
          // Extract addresses from referrals
          const addresses = levelData.referrals.map((referral: any) => referral.referredAddress);

          // Calculate total investment and earnings from referrals
          const totalInvestment = levelData.referrals.reduce((sum: number, referral: any) => {
            return sum + (referral.investmentAmount || 0);
          }, 0);

          const totalEarnings = levelData.referrals.reduce((sum: number, referral: any) => {
            return sum + (referral.commissionEarned || 0);
          }, 0);

          levelWiseArray.push({
            level: i,
            count: levelData.count || 0,
            addresses: addresses,
            totalInvestment: totalInvestment,
            totalEarnings: totalEarnings
          });
        } else {
          // Add empty level data
          levelWiseArray.push({
            level: i,
            count: 0,
            addresses: [],
            totalInvestment: 0,
            totalEarnings: 0
          });
        }
      }

      return levelWiseArray;
    } catch (error: any) {
      console.error('Error fetching level-wise referrals:', error.response?.data || error.message);
      // Return empty array instead of throwing error
      return [];
    }
  }

  /**
   * Get user investments
   */
  async getUserInvestments(address: string): Promise<InvestmentRecord[]> {
    try {
      const response = await apiClient.get(`/investments/user/${address.toLowerCase()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user investments:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user investments');
    }
  }

  /**
   * Get all referrals for a user (all levels)
   */
  async getAllReferrals(address: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/referrals/all/${address.toLowerCase()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching all referrals:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch all referrals');
    }
  }

  /**
   * Update referral commission
   */
  async updateReferralCommission(
    referrerAddress: string,
    referredAddress: string,
    commission: number,
    level: number
  ): Promise<boolean> {
    try {
      const response = await apiClient.put('/referrals/commission', {
        referrerAddress: referrerAddress.toLowerCase(),
        referredAddress: referredAddress.toLowerCase(),
        commission,
        level
      });

      if (response.data.success) {
        console.log(`Commission updated for ${referrerAddress} -> ${referredAddress}: ${commission} USDC`);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error updating commission:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update commission');
    }
  }

  /**
   * Check if user is registered
   */
  async isUserRegistered(address: string): Promise<boolean> {
    try {
      const response = await apiClient.get(`/users/check/${address.toLowerCase()}`);
      return response.data.registered;
    } catch (error: any) {
      console.error('Error checking user registration:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Get user details
   */
  async getUserDetails(address: string): Promise<any> {
    try {
      const response = await apiClient.get(`/users/${address.toLowerCase()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
