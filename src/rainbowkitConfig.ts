import { configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export { chains };
