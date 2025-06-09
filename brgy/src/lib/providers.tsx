'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiConfig, http } from 'wagmi';
import { baseSepolia} from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Barangay System',
  projectId: '5dff023d198e3e39a72563f898592dca', // Replace with your actual WC project ID
  chains: [ baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// 🆕 Create a QueryClient instance
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider
                  theme={lightTheme({
            accentColor: '#1A3A6D', // your brand green
            accentColorForeground: '#ffffff',
            borderRadius: 'medium',
            fontStack: 'rounded',
            overlayBlur: 'small',
          })}
        >{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
