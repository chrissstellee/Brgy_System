'use client'; 

import '@rainbow-me/rainbowkit/styles.css'; 
import { ReactNode } from 'react'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // For managing server state and async data
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig, http} from 'wagmi'; // Wagmi for React hooks and Ethereum integration
import { baseSepolia } from 'wagmi/chains'; // EVM-compatible testnet chain

// Create the Wagmi configuration object
const config = getDefaultConfig({
  appName: 'Barangay System', 
  projectId: '5dff023d198e3e39a72563f898592dca', // WalletConnect project ID (should be stored in .env for security)
  chains: [baseSepolia], // Supported chains (in this case, Base Sepolia testnet)
  transports: {
    [baseSepolia.id]: http(), // Set up HTTP transport for chain interaction
  },
});

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Providers component wraps the app with necessary context providers
export default function Providers({ children }: { children: ReactNode }) {
  return (
    // Provides context for React Query (for fetching and caching data)
    <QueryClientProvider client={queryClient}>
      {/* Provides context for Wagmi (for Ethereum-related hooks) */}
      <WagmiConfig config={config}>
        {/* Provides UI components and context for wallet connection via RainbowKit */}
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#1A3A6D',
            accentColorForeground: '#ffffff',
            borderRadius: 'medium',
            fontStack: 'rounded',
            overlayBlur: 'small',
          })}
        >
          {children} {/* Render all child components inside the provider context */}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
