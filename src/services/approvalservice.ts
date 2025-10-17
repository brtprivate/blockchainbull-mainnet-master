/**
 * USDT (Tether USD) BEP-20 Token Contract Interface
 * BSC Mainnet Contract Address: 0x55d398326f99059fF775485246999027B3197955
 * Token Tracker: BEP-20: USDT (Tether USD)
 * SPDX-License-Identifier: MIT
 */

import { readContract, writeContract } from "@wagmi/core";
import { config } from "../config/web3modal";
import type { Address } from "viem";
import { bsc } from "wagmi/chains";

// https://bscscan.com/address/0x55d398326f99059fF775485246999027B3197955#writeContract
// USDT Contract configuration - BSC Mainnet
export const USDT_CONTRACT_ADDRESS =
  "0x55d398326f99059fF775485246999027B3197955" as Address;
export const BSC_MAINNET_CHAIN_ID = 56;

// Keep USDC exports for backward compatibility
export const USDC_CONTRACT_ADDRESS = USDT_CONTRACT_ADDRESS;
export const BSC_TESTNET_CHAIN_ID = BSC_MAINNET_CHAIN_ID;

// USDC Contract ABI
export const USDC_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// USDC Contract interaction functions
export const usdcContractInteractions = {
  /**
   * Approve USDC spending for a specified address
   * @param spender - Address allowed to spend USDC
   * @param amount - Amount to approve (in wei)
   * @param account - Wallet address to send the transaction from
   * @returns Transaction hash
   */
  async approveUSDC(
    spender: Address,
    amount: bigint,
    account: Address
  ): Promise<string> {
    try {
      console.log(`Approving ${amount.toString()} wei USDT for ${spender}`);

      const txHash = await writeContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "approve",
        args: [spender, amount],
        chain: bsc,
        account: account,
      });

      console.log("USDT approval transaction hash:", txHash);
      return txHash;
    } catch (error: any) {
      console.error(`Error approving USDT: ${error.message || error}`);
      throw new Error(
        `Failed to approve USDT: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get USDC balance for an address
   * @param account - Wallet address
   * @returns USDC balance in wei
   */
  async getUSDCBalance(account: Address): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "balanceOf",
        args: [account],
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as bigint;
    } catch (error: any) {
      console.error(`Error fetching USDC balance: ${error.message || error}`);
      throw new Error(
        `Failed to fetch USDC balance: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Transfer USDC to another address
   * @param to - Recipient address
   * @param amount - Amount to transfer (in wei)
   * @param account - Wallet address to send the transaction from
   * @returns Transaction hash
   */
  async transferUSDC(
    to: Address,
    amount: bigint,
    account: Address
  ): Promise<string> {
    try {
      console.log(`Transferring ${amount} USDC to ${to}`);

      const txHash = await writeContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "transfer",
        args: [to, amount],
        chain: bsc,
        account: account,
      });

      console.log("USDC transfer transaction hash:", txHash);
      return txHash;
    } catch (error: any) {
      console.error(`Error transferring USDC: ${error.message || error}`);
      throw new Error(
        `Failed to transfer USDC: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Transfer USDC from one address to another using allowance
   * @param from - Source address
   * @param to - Recipient address
   * @param amount - Amount to transfer (in wei)
   * @param account - Wallet address to send the transaction from
   * @returns Transaction hash
   */
  async transferFromUSDC(
    from: Address,
    to: Address,
    amount: bigint,
    account: Address
  ): Promise<string> {
    try {
      console.log(`Transferring ${amount} USDC from ${from} to ${to}`);

      const txHash = await writeContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "transferFrom",
        args: [from, to, amount],
        chain: bsc,
        account: account,
      });

      console.log("USDC transferFrom transaction hash:", txHash);
      return txHash;
    } catch (error: any) {
      console.error(`Error in transferFrom USDC: ${error.message || error}`);
      throw new Error(
        `Failed to transferFrom USDC: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get allowance of a spender for an owner's USDC
   * @param owner - Owner address
   * @param spender - Spender address
   * @returns Allowance amount in wei
   */
  async getAllowance(owner: Address, spender: Address): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "allowance",
        args: [owner, spender],
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as bigint;
    } catch (error: any) {
      console.error(`Error fetching allowance: ${error.message || error}`);
      throw new Error(
        `Failed to fetch allowance: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get total supply of USDC
   * @returns Total supply in wei
   */
  async getTotalSupply(): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "totalSupply",
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as bigint;
    } catch (error: any) {
      console.error(`Error fetching total supply: ${error.message || error}`);
      throw new Error(
        `Failed to fetch total supply: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get token name
   * @returns Token name (USDC)
   */
  async getName(): Promise<string> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "name",
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as string;
    } catch (error: any) {
      console.error(`Error fetching token name: ${error.message || error}`);
      throw new Error(
        `Failed to fetch token name: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get token symbol
   * @returns Token symbol (USDC)
   */
  async getSymbol(): Promise<string> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "symbol",
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as string;
    } catch (error: any) {
      console.error(`Error fetching token symbol: ${error.message || error}`);
      throw new Error(
        `Failed to fetch token symbol: ${error.message || "Unknown error"}`
      );
    }
  },

  /**
   * Get token decimals
   * @returns Number of decimals (18)
   */
  async getDecimals(): Promise<number> {
    try {
      return (await readContract(config, {
        abi: USDC_ABI,
        address: USDC_CONTRACT_ADDRESS,
        functionName: "decimals",
        chainId: BSC_MAINNET_CHAIN_ID,
      })) as number;
    } catch (error: any) {
      console.error(`Error fetching decimals: ${error.message || error}`);
      throw new Error(
        `Failed to fetch decimals: ${error.message || "Unknown error"}`
      );
    }
  },
};

// Export individual functions for convenience
export const {
  approveUSDC,
  getUSDCBalance,
  transferUSDC,
  transferFromUSDC,
  getAllowance,
  getTotalSupply,
  getName,
  getSymbol,
  getDecimals,
} = usdcContractInteractions;

// Export as contractInteractions for backward compatibility
export const contractInteractions = {
  approve: usdcContractInteractions.approveUSDC,
  getBalance: usdcContractInteractions.getUSDCBalance,
  transfer: usdcContractInteractions.transferUSDC,
  transferFrom: usdcContractInteractions.transferFromUSDC,
  getAllowance: usdcContractInteractions.getAllowance,
  getTotalSupply: usdcContractInteractions.getTotalSupply,
  getName: usdcContractInteractions.getName,
  getSymbol: usdcContractInteractions.getSymbol,
  getDecimals: usdcContractInteractions.getDecimals,
};