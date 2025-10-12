// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useWallet } from './WalletContext';

// export interface TransactionRecord {
//   id: string;
//   type: 'withdrawal' | 'investment' | 'referral_reward';
//   amount: string;
//   fee: string;
//   netAmount: string;
//   txHash: string;
//   status: 'completed' | 'pending' | 'failed';
//   date: string;
//   timestamp: number;
//   contributionIndex?: number;
//   packageType?: string;
// }

// interface TransactionHistoryContextType {
//   transactions: TransactionRecord[];
//   addTransaction: (transaction: Omit<TransactionRecord, 'id' | 'timestamp'>) => void;
//   getWithdrawalHistory: () => TransactionRecord[];
//   getInvestmentHistory: () => TransactionRecord[];
//   getTotalWithdrawals: () => { count: number; amount: number; fees: number };
//   clearHistory: () => void;
//   isLoading: boolean;
// }

// const TransactionHistoryContext = createContext<TransactionHistoryContextType | undefined>(undefined);

// export const useTransactionHistory = () => {
//   const context = useContext(TransactionHistoryContext);
//   if (!context) {
//     throw new Error('useTransactionHistory must be used within a TransactionHistoryProvider');
//   }
//   return context;
// };

// interface TransactionHistoryProviderProps {
//   children: ReactNode;
// }

// export const TransactionHistoryProvider: React.FC<TransactionHistoryProviderProps> = ({ children }) => {
//   const wallet = useWallet();
//   const address = wallet.account;
  
//   const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Load transaction history from localStorage
//   useEffect(() => {
//     if (address) {
//       const storageKey = `transaction_history_${address}`;
//       const storedHistory = localStorage.getItem(storageKey);
//       if (storedHistory) {
//         try {
//           const parsedHistory = JSON.parse(storedHistory);
//           setTransactions(parsedHistory);
//         } catch (error) {
//           console.error('Error loading transaction history:', error);
//           setTransactions([]);
//         }
//       }
//     }
//   }, [address]);

//   // Save transaction history to localStorage
//   useEffect(() => {
//     if (address && transactions.length > 0) {
//       const storageKey = `transaction_history_${address}`;
//       localStorage.setItem(storageKey, JSON.stringify(transactions));
//     }
//   }, [address, transactions]);

//   const addTransaction = (transaction: Omit<TransactionRecord, 'id' | 'timestamp'>) => {
//     setIsLoading(true);
//     const newTransaction: TransactionRecord = {
//       ...transaction,
//       id: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
//       timestamp: Date.now(),
//     };

//     setTransactions(prev => [newTransaction, ...prev]);
//     setIsLoading(false);
//   };

//   const getWithdrawalHistory = () => {
//     return transactions.filter(tx => tx.type === 'withdrawal');
//   };

//   const getInvestmentHistory = () => {
//     return transactions.filter(tx => tx.type === 'investment');
//   };

//   const getTotalWithdrawals = () => {
//     const withdrawals = getWithdrawalHistory();
//     const totalAmount = withdrawals.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
//     const totalFees = withdrawals.reduce((sum, tx) => sum + parseFloat(tx.fee), 0);
    
//     return {
//       count: withdrawals.length,
//       amount: totalAmount,
//       fees: totalFees
//     };
//   };

//   const clearHistory = () => {
//     setTransactions([]);
//     if (address) {
//       const storageKey = `transaction_history_${address}`;
//       localStorage.removeItem(storageKey);
//     }
//   };

//   const value: TransactionHistoryContextType = {
//     transactions,
//     addTransaction,
//     getWithdrawalHistory,
//     getInvestmentHistory,
//     getTotalWithdrawals,
//     clearHistory,
//     isLoading,
//   };

//   return (
//     <TransactionHistoryContext.Provider value={value}>
//       {children}
//     </TransactionHistoryContext.Provider>
//   );
// };
