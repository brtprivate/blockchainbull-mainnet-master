import { useState, useEffect } from 'react';
import { dwcContractInteractions, getRoiPercent } from '../services/contractService';

const usePackageDetails = () => {
  const [packageDetails, setPackageDetails] = useState([]);

  const packages = [
    { name: 'Starter Node', index: 1, functionName: 'buyStarterNode', price: 100, roiPercent: 1, features: ['Basic ROI', 'Entry Level', 'Referral Bonus'] },
    { name: 'Basic Block', index: 2, functionName: 'buyBasicBlock', price: 200, roiPercent: 1, features: ['Enhanced ROI', 'Basic Benefits', 'Higher Referral Bonus'] },
    { name: 'Growth Link', index: 3, functionName: 'buyGrowthLink', price: 300, roiPercent: 1, features: ['Premium ROI', 'Growth Benefits', 'Premium Referral Bonus'] },
    { name: 'Silver Matrix', index: 4, functionName: 'buySilverMatrix', price: 400, roiPercent: 1, features: ['Silver ROI', 'Silver Benefits', 'Elite Referral Bonus'] },
    { name: 'Turbo Chain', index: 5, functionName: 'buyTurboChain', price: 500, roiPercent: 1, features: ['Turbo ROI', 'Turbo Benefits', 'Maximum Referral Bonus'] },
    { name: 'Pro Ledger', index: 6, functionName: 'buyProLedger', price: 600, roiPercent: 1, features: ['Pro ROI', 'Pro Benefits', 'Pro Referral Bonus'] },
    { name: 'Power Mesh', index: 7, functionName: 'buyPowerMesh', price: 700, roiPercent: 1, features: ['Power ROI', 'Power Benefits', 'Power Referral Bonus'] },
    { name: 'Elite Nexus', index: 8, functionName: 'buyEliteNexus', price: 800, roiPercent: 1, features: ['Elite ROI', 'Elite Benefits', 'Elite Referral Bonus'] },
    { name: 'Prime Vault', index: 9, functionName: 'buyPrimeVault', price: 900, roiPercent: 1, features: ['Prime ROI', 'Prime Benefits', 'Prime Referral Bonus'] },
    { name: 'Ultra Sync', index: 10, functionName: 'buyUltraSync', price: 1000, roiPercent: 1, features: ['Ultra ROI', 'Ultra Benefits', 'Ultra Referral Bonus'] },
    { name: 'Quantum Tier', index: 11, functionName: 'buyQuantumTier', price: 2000, roiPercent: 1, features: ['Quantum ROI', 'Quantum Benefits', 'Quantum Referral Bonus'] },
    { name: 'Vertex Plus', index: 12, functionName: 'buyVertexPlus', price: 3000, roiPercent: 1, features: ['Vertex ROI', 'Vertex Benefits', 'Vertex Referral Bonus'] },
    { name: 'Apex Pro', index: 13, functionName: 'buyApexPro', price: 4000, roiPercent: 1, features: ['Apex ROI', 'Apex Benefits', 'Apex Referral Bonus'] },
    { name: 'Titan Max', index: 14, functionName: 'buyTitanMax', price: 5000, roiPercent: 1, features: ['Titan ROI', 'Titan Benefits', 'Titan Referral Bonus'] },
    { name: 'Infinity Club', index: 15, functionName: 'buyInfinityClub', price: 10000, roiPercent: 1, features: ['Infinity ROI', 'Infinity Benefits', 'Infinity Referral Bonus'] },
  ];

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const percents = [];
        for (let i = 1; i <= 15; i++) {
          const percent = await getRoiPercent(BigInt(i));
          percents[i] = percent.toString();
        }
        const updatedPackages = packages.map(pkg => ({
          ...pkg,
          roiPercent: Number(percents[pkg.index]) / 10 || pkg.roiPercent, // Adjusted divider based on contract (percentDivider=10000, but ROI display as percent/100 for 0.55%)
        }));
        setPackageDetails(updatedPackages);
      } catch (error) {
        console.error('Error fetching ROI percents:', error);
        setPackageDetails(packages);
      }
    };

    fetchPackageDetails();
  }, []);

  return { packageDetails, packages };
};

export default usePackageDetails;