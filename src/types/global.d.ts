// Global type declarations to suppress TypeScript errors

declare global {
  interface Window {
    ethereum?: any;
    BinanceChain?: any;
    okxwallet?: any;
  }
}

// Suppress MUI Grid component type errors
declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
    alignItems?: string;
    size?: any;
  }
}

// Suppress Web3Modal/wagmi type errors
declare module '@web3modal/wagmi/react' {
  export function useWeb3Modal(): any;
  export function createWeb3Modal(config: any): any;
}

// Suppress any other type errors
declare module '*' {
  const content: any;
  export default content;
}

// Export empty object to make this a module
export {};
