// Simple Web3Modal Trust Wallet Priority
let isInitialized = false;

export const customizeWeb3Modal = () => {
  if (isInitialized) return;
  isInitialized = true;

  console.log('🔧 Starting Web3Modal customization...');

  const observer = new MutationObserver(() => {
    const modal = document.querySelector('w3m-modal');
    if (modal) {
      setTimeout(customizeModalContent, 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setTimeout(customizeModalContent, 100);
};

const customizeModalContent = () => {
  try {
    const modal = document.querySelector('w3m-modal');
    if (!modal) return;

    // console.log('✅ Modal found, applying Trust Wallet priority...');

    // Check if mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // console.log('📱 Mobile device:', isMobile);

    // Simple Trust Wallet priority
    const trustWalletButton = modal.querySelector('wui-wallet-button[data-wallet-id="4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0"]');

    if (trustWalletButton) {
      const parent = trustWalletButton.parentElement;
      if (parent) {
        parent.insertBefore(trustWalletButton, parent.firstChild);
        // console.log('🎯 Trust Wallet moved to first position');

        // Add mobile-specific click handler for Trust Wallet
        if (isMobile) {
          trustWalletButton.addEventListener('click', () => {
            // console.log('🔗 Trust Wallet clicked on mobile');
            // Let the default behavior handle the connection
          });
        }
      }
    }

    // Apply additional customizations
    reorderWallets();
    forceWalletLayout();
    addCustomStyling();
  } catch (error) {
    console.error('❌ Customization error:', error);
  }
};

// Auto-start customization when module is imported
if (typeof window !== 'undefined') {
  customizeWeb3Modal();

  document.addEventListener('click', () => {
    setTimeout(customizeWeb3Modal, 100);
  });
}

const reorderWallets = () => {
  const trustWalletId = '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0';
  const metaMaskId = 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96';
  const coinbaseId = 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa';

  // Find all wallet buttons
  const allWalletButtons = document.querySelectorAll('w3m-modal wui-wallet-button');
  const trustWalletButton = document.querySelector(`w3m-modal wui-wallet-button[data-wallet-id="${trustWalletId}"]`);
  const metaMaskButton = document.querySelector(`w3m-modal wui-wallet-button[data-wallet-id="${metaMaskId}"]`);
  const coinbaseButton = document.querySelector(`w3m-modal wui-wallet-button[data-wallet-id="${coinbaseId}"]`);

  // console.log('Found wallets:', {
  //   total: allWalletButtons.length,
  //   trustWallet: !!trustWalletButton,
  //   metaMask: !!metaMaskButton,
  //   coinbase: !!coinbaseButton
  // });

  // FORCE Trust Wallet styling
  if (trustWalletButton) {
    const parent = trustWalletButton.parentElement;
    if (parent) {
      // Move Trust Wallet to the beginning
      parent.insertBefore(trustWalletButton, parent.firstChild);

      // Apply AGGRESSIVE styling
      (trustWalletButton as HTMLElement).style.order = '-9999';
      (trustWalletButton as HTMLElement).style.border = '3px solid #FFA000';
      (trustWalletButton as HTMLElement).style.background = 'linear-gradient(135deg, #FFA000 0%, #FF8F00 100%)';
      (trustWalletButton as HTMLElement).style.transform = 'scale(1.1)';
      (trustWalletButton as HTMLElement).style.boxShadow = '0 8px 25px rgba(255, 160, 0, 0.6)';
      (trustWalletButton as HTMLElement).style.margin = '12px 8px';
      (trustWalletButton as HTMLElement).style.width = 'calc(100% - 16px)';
      (trustWalletButton as HTMLElement).style.minHeight = '70px';
      (trustWalletButton as HTMLElement).style.borderRadius = '12px';
      (trustWalletButton as HTMLElement).style.zIndex = '999';
      (trustWalletButton as HTMLElement).style.position = 'relative';

      // Force text color
      const trustText = trustWalletButton.querySelector('wui-text');
      if (trustText) {
        (trustText as HTMLElement).style.color = 'white';
        (trustText as HTMLElement).style.fontWeight = 'bold';
      }
    }
  }

  // Style MetaMask and Coinbase
  if (metaMaskButton) {
    (metaMaskButton as HTMLElement).style.order = '-500';
    (metaMaskButton as HTMLElement).style.margin = '8px';
    (metaMaskButton as HTMLElement).style.width = 'calc(100% - 16px)';
  }

  if (coinbaseButton) {
    (coinbaseButton as HTMLElement).style.order = '-400';
    (coinbaseButton as HTMLElement).style.margin = '8px';
    (coinbaseButton as HTMLElement).style.width = 'calc(100% - 16px)';
  }

  // Hide unwanted wallets (keep only our 3 main ones)
  allWalletButtons.forEach(button => {
    const walletId = button.getAttribute('data-wallet-id');
    if (walletId && ![trustWalletId, metaMaskId, coinbaseId].includes(walletId)) {
      (button as HTMLElement).style.display = 'none';
      (button as HTMLElement).style.visibility = 'hidden';
      (button as HTMLElement).style.opacity = '0';
      (button as HTMLElement).style.height = '0';
      (button as HTMLElement).style.overflow = 'hidden';
      (button as HTMLElement).style.position = 'absolute';
      (button as HTMLElement).style.left = '-9999px';
    }
  });

  // REAL MOBILE DEVICE: Extra aggressive hiding
  // if (isMobileDevice()) {
  //   console.log('📱 Real mobile device detected - applying mobile-specific customizations');

  //   // Force hide email/social elements more aggressively
  //   const mobileHideSelectors = [
  //     'wui-email-input',
  //     'wui-social-login-list',
  //     'wui-onramp-widget',
  //     '[data-testid*="email"]',
  //     '[data-testid*="social"]',
  //     '[data-testid*="onramp"]'
  //   ];

  //   mobileHideSelectors.forEach(selector => {
  //     const elements = document.querySelectorAll(`w3m-modal ${selector}`);
  //     elements.forEach(el => {
  //       (el as HTMLElement).remove(); // Completely remove from DOM
  //     });
  //   });
  // }
};

const forceWalletLayout = () => {
  // Force wallet container to be column layout
  const walletContainers = document.querySelectorAll('w3m-modal wui-flex, w3m-modal wui-grid');
  walletContainers.forEach(container => {
    const hasWalletButton = container.querySelector('wui-wallet-button');
    if (hasWalletButton) {
      (container as HTMLElement).style.display = 'flex';
      (container as HTMLElement).style.flexDirection = 'column';
      (container as HTMLElement).style.alignItems = 'center';
      (container as HTMLElement).style.width = '100%';
      (container as HTMLElement).style.gap = '8px';
    }
  });
};

const addCustomStyling = () => {
  // Add custom CSS if not already added
  if (!document.getElementById('web3modal-custom-styles')) {
    const style = document.createElement('style');
    style.id = 'web3modal-custom-styles';
    style.textContent = `
      /* FORCE Trust Wallet to be HUGE on mobile */
      @media (max-width: 768px) {
        w3m-modal wui-wallet-button[data-wallet-id="4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0"] {
          order: -9999 !important;
          border: 4px solid #FFA000 !important;
          background: linear-gradient(135deg, #FFA000 0%, #FF8F00 100%) !important;
          transform: scale(1.2) !important;
          box-shadow: 0 12px 40px rgba(255, 160, 0, 0.7) !important;
          margin: 16px 8px !important;
          width: calc(100% - 16px) !important;
          min-height: 80px !important;
          border-radius: 16px !important;
          z-index: 9999 !important;
          position: relative !important;
        }

        /* Hide ALL other wallets on mobile */
        w3m-modal wui-wallet-button:not([data-wallet-id="4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
          left: -9999px !important;
        }
      }

      /* Hide email/social completely */
      w3m-modal [data-testid*="email"],
      w3m-modal [data-testid*="social"],
      w3m-modal [data-testid*="onramp"],
      w3m-modal wui-email-input,
      w3m-modal wui-social-login-list,
      w3m-modal wui-onramp-widget {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }
};

// Auto-start customization when module is imported
if (typeof window !== 'undefined') {
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', customizeWeb3Modal);
  }

  // Run when modal opens (listen for clicks on connect buttons)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target && (target.textContent?.includes('Connect') || target.closest('w3m-modal'))) {
      setTimeout(customizeWeb3Modal, 100);
    }
  });
}
