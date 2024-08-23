import { ARBITRUM_SEPOLIA, BITLAYER_TESTNET, IMOLA } from "./chains.config";

export const PROVIDERS: { [chain: string]: string } = {
    [ARBITRUM_SEPOLIA]: "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
    [IMOLA]: "https://mevm.devnet.imola.movementlabs.xyz/",
    [BITLAYER_TESTNET]: "https://testnet-rpc.bitlayer-rpc.com"
}


export function getProvider(chain: string): string {
  if (!PROVIDERS[chain]) {
    throw new Error(`Unknown chainId ${chain}`);
  }

  return PROVIDERS[chain];
}