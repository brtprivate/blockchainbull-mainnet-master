import { useState, useEffect } from "react";
import { formatUnits } from "viem";
import { dwcContractInteractions } from "../services/contractService";
import { MAINNET_CHAIN_ID } from "../services/contractService";

const useMLMData = (wallet, chainId, switchChain, setError, setIsLoading) => {
  const [mlmData, setMlmData] = useState({
    totalInvestment: 0,
    referrerBonus: 0,
    isRegistered: false,
    stakeCount: 0,
    usdtBalance: 0, // Changed to usdtBalance, removed usdcBalance
    totalUsers: 0,
    directIncome: 0,
    contractPercent: 0,
    maxRoi: 0,
    contractBalance: 0,
    directBusiness: 0,
    referrer: "",
    totalWithdrawn: 0,
    levelIncome: 0,
  });
  const [stakes, setStakes] = useState([]);
  const [notRegistered, setNotRegistered] = useState(false);

  const packages = [
    {
      name: "Starter Node",
      index: 1,
      functionName: "buyStarterNode",
      features: ["Basic ROI", "Entry Level", "Referral Bonus"],
    },
    {
      name: "Basic Block",
      index: 2,
      functionName: "buyBasicBlock",
      features: ["Enhanced ROI", "Basic Benefits", "Higher Referral Bonus"],
    },
    {
      name: "Growth Link",
      index: 3,
      functionName: "buyGrowthLink",
      features: ["Premium ROI", "Growth Benefits", "Premium Referral Bonus"],
    },
    {
      name: "Silver Matrix",
      index: 4,
      functionName: "buySilverMatrix",
      features: ["Silver ROI", "Silver Benefits", "Elite Referral Bonus"],
    },
    {
      name: "Turbo Chain",
      index: 5,
      functionName: "buyTurboChain",
      features: ["Turbo ROI", "Turbo Benefits", "Maximum Referral Bonus"],
    },
    {
      name: "Pro Ledger",
      index: 6,
      functionName: "buyProLedger",
      features: ["Pro ROI", "Pro Benefits", "Pro Referral Bonus"],
    },
    {
      name: "Power Mesh",
      index: 7,
      functionName: "buyPowerMesh",
      features: ["Power ROI", "Power Benefits", "Power Referral Bonus"],
    },
    {
      name: "Elite Nexus",
      index: 8,
      functionName: "buyEliteNexus",
      features: ["Elite ROI", "Elite Benefits", "Elite Referral Bonus"],
    },
    {
      name: "Prime Vault",
      index: 9,
      functionName: "buyPrimeVault",
      features: ["Prime ROI", "Prime Benefits", "Prime Referral Bonus"],
    },
    {
      name: "Ultra Sync",
      index: 10,
      functionName: "buyUltraSync",
      features: ["Ultra ROI", "Ultra Benefits", "Ultra Referral Bonus"],
    },
    {
      name: "Quantum Tier",
      index: 11,
      functionName: "buyQuantumTier",
      features: ["Quantum ROI", "Quantum Benefits", "Quantum Referral Bonus"],
    },
    {
      name: "Vertex Plus",
      index: 12,
      functionName: "buyVertexPlus",
      features: ["Vertex ROI", "Vertex Benefits", "Vertex Referral Bonus"],
    },
    {
      name: "Apex Pro",
      index: 13,
      functionName: "buyApexPro",
      features: ["Apex ROI", "Apex Benefits", "Apex Referral Bonus"],
    },
    {
      name: "Titan Max",
      index: 14,
      functionName: "buyTitanMax",
      features: ["Titan ROI", "Titan Benefits", "Titan Referral Bonus"],
    },
    {
      name: "Infinity Club",
      index: 15,
      functionName: "buyInfinityClub",
      features: ["Infinity ROI", "Infinity Benefits", "Infinity Referral Bonus"],
    },
  ];

  const fetchMlmData = async () => {
    if (!wallet.isConnected || !wallet.account) {
      setError("Wallet not connected. Please connect your wallet.");
      return;
    }

    if (chainId !== MAINNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: MAINNET_CHAIN_ID });
      } catch (error) {
        setError("Please switch to BSC Mainnet.");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError("");

      let userRecord;
      try {
        userRecord = await dwcContractInteractions.getUserRecord(
          wallet.account
        );
      } catch (error) {
        console.warn(
          "User record not found, user may not be registered:",
          error
        );
        userRecord = {
          totalInvestment: 0n,
          directBusiness: 0n,
          referrer: "0x0000000000000000000000000000000000000000",
          referrerBonus: 0n,
          levelIncome: 0n,
          totalWithdrawn: 0n,
          isRegistered: false,
          stakeCount: 0n,
        };
      }

      const [usdtBalanceRaw, directIncome, contractPercent, maxRoi, contractBalanceRaw, totalUsersRaw] =
        await Promise.all([
          dwcContractInteractions.getUSDCBalance(wallet.account), // Changed to getUSDCBalance for testnet
          dwcContractInteractions.getDirectIncome(),
          dwcContractInteractions.getContractPercent(),
          dwcContractInteractions.getMaxRoi(),
          dwcContractInteractions.getContractBalance(),
          dwcContractInteractions.getUsersLength(),
        ]);

      const stakeRecords = [];

      setNotRegistered(userRecord.referrer === '0x0000000000000000000000000000000000000000');

      console.log("🔎 Checking user stake records...");
      console.log("User registered:", userRecord.isRegistered);
      console.log("User stake count:", userRecord.stakeCount);

      console.log("userRecord", userRecord);
      if (userRecord.referrer !== '0x0000000000000000000000000000000000000000' && Number(userRecord.stakeCount) > 0) {
        for (let i = 0; i < Number(userRecord.stakeCount); i++) {
          console.log(`\n📌 Processing stake #${i}...`);
          try {
            const stake = await dwcContractInteractions.getStakeRecord(
              wallet.account,
              BigInt(i)
            );
            console.log("✅ Stake record fetched:", stake);

            // Adjust packageIndex to account for 1-based indexing
            const adjustedPackageIndex = Number(stake.packageIndex);
            console.log("📦 Adjusted package index:", adjustedPackageIndex);

            // Validate package index
            if (adjustedPackageIndex < 1 || adjustedPackageIndex > 15) {
              console.error(`Invalid package index: ${adjustedPackageIndex}`);
              continue;
            }

            const packagePrice = await dwcContractInteractions.getPackagePrice(
              BigInt(adjustedPackageIndex)
            );
            if (!packagePrice) {
              console.error(`No package price for index ${adjustedPackageIndex}`);
              continue;
            }
            console.log("💰 Package price (raw):", packagePrice.toString());

            const roiPercent = await dwcContractInteractions.getRoiPercent(
              BigInt(adjustedPackageIndex)
            );
            if (!roiPercent) {
              console.error(`No ROI percent for index ${adjustedPackageIndex}`);
              continue;
            }
            console.log("📈 ROI Percent:", roiPercent.toString());

            const claimable = await dwcContractInteractions.calculateClaimAble(
              wallet.account,
              BigInt(i)
            );
            
            console.log("🎯 Claimable amount (raw):", claimable.toString());

            // Find the package with the adjusted index
            const packageInfo = packages.find(
              (pkg) => pkg.index === adjustedPackageIndex
            );
            console.log("📦 Matched package info:", packageInfo);

            const formattedStake = {
              index: i,
              packageIndex: adjustedPackageIndex,
              packageName: packageInfo?.name || `Package ${adjustedPackageIndex}`,
              packagePrice: parseFloat(formatUnits(packagePrice, 18)),
              roiPercent: Number(roiPercent),
              lastClaimTime: Number(stake.lasClaimTime), // Kept as-is due to contract ABI
              rewardClaimed: parseFloat(formatUnits(stake.rewardClaimed, 18)),
              claimable: parseFloat(formatUnits(claimable, 18)),
            };

            console.log("📊 Final formatted stake:", formattedStake);
            stakeRecords.push(formattedStake);
          } catch (e) {
            console.error(`❌ Error fetching stake #${i}:`, e);
          }
        }
      } else {
        console.log("⚠️ User not registered or no stakes found.");
      }
      console.log(
        "✅ All stakes processed. Total records:",
        stakeRecords.length
      );
      setStakes(stakeRecords);

      setMlmData({
        totalInvestment: parseFloat(
          formatUnits(userRecord.totalInvestment, 18)
        ),
        referrerBonus: parseFloat(formatUnits(userRecord.referrerBonus, 18)),
        isRegistered: userRecord.isRegistered,
        stakeCount: Number(userRecord.stakeCount),
        usdtBalance: parseFloat(formatUnits(usdtBalanceRaw, 18)), // Changed to usdtBalance
        totalUsers: Number(totalUsersRaw),
        directIncome: parseFloat(formatUnits(directIncome, 18)),
        contractPercent: Number(contractPercent),
        maxRoi: parseFloat(formatUnits(maxRoi, 18)),
        contractBalance: parseFloat(formatUnits(contractBalanceRaw, 18)),
        directBusiness: parseFloat(formatUnits(userRecord.directBusiness, 18)),
        referrer: userRecord.referrer,
        totalWithdrawn: parseFloat(formatUnits(userRecord.totalWithdrawn, 18)),
        levelIncome: parseFloat(formatUnits(userRecord.levelIncome, 18)),
      });
    } catch (error) {
      console.error("Error fetching MLM data:", error);
      setError("Failed to fetch MLM data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      fetchMlmData();
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  // Auto-refresh every 30 seconds to update claimable rewards
  useEffect(() => {
    if (wallet.isConnected && wallet.account) {
      const interval = setInterval(() => {
        fetchMlmData();
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [wallet.isConnected, wallet.account, chainId]);

  return { mlmData, stakes, fetchMlmData, notRegistered };
};

export default useMLMData;