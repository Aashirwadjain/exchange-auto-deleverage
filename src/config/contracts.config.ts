import { ARBITRUM_SEPOLIA, BITLAYER_TESTNET, IMOLA } from "./chains.config";

export const CONTRACTS: { [chain: string]: { [contractName: string]: string } } = {

  [ARBITRUM_SEPOLIA]: {
    DataStore : "0x7D71Dc4F74524Cdd9d858fFB17Af0BD47d660b0D",
    SingleMarketGlobalReader : "0x6B7224Bb2c59E30A906C3b629BEEA7365c848c51",
  },

  [IMOLA]: {
    DataStore: "0xeAB59d23C59083C0c378106eCac055E809638Da4",
    MarketReader: "0x05F3DBc00Cc52B663E1CA6D5e0874450884E035B", 
    PositionReader: "0x6715159Ce9D9E010dbA35CaF8073308F2184BcC6",
    ReferralStorage: "0xD38982c478f50EE874564bFEA6599DC5A2088DcD",
    multicallAddress: "0xAE64496d98b0a012445B429D0330cE7ff218D75e", 
    SingleMarketGlobalReader: "0x3e28BC462d8Ae3Dfb53C7f48cb1f88a7F9586d91"
  },

  [BITLAYER_TESTNET]: {
    DataStore: "0x669D920c9cD990Aa62B3acC561480282b385c645",
    MarketReader: "0xf040c9a3045b555808c104C60E94ED3003a372c9", 
    PositionReader: "0x1Fc29A719aF4Da1c73aD898D3F0E5D2f6527315e", 
    ReferralStorage: "0xd4000663a52a1108Eb847d48F02da2e60fD10DD4", 
    MulticallAddress: "0x8f457da1b853b9436B4311D914c3D08100599F57", 
    SingleMarketLiquidator: "0x9ae8817C22246380A871bed5c8E51A4Bc6BE6b74", 
    SingleMarketAdlHandler: "0x7a6731B679512A8284f7D45AEb9c13b4DabD7946",
    SingleMarketGlobalReader: "0x3CEe271604Cf177FeF64dba907Da7219fD71253C",
    DynamicMarketGlobalReader: "0xB77CcF8871b1f2D27ffAf095c9E99239faA9BF50",
  },

};

export function getContract(chain: string, contractName: string): string {
  if (!CONTRACTS[chain]) {
    throw new Error(`Unknown chain ${chain}`);
  }

  if (!CONTRACTS[chain][contractName]) {
    throw new Error(`Unknown contract "${contractName}" for chainId ${chain}`);
  }

  return CONTRACTS[chain][contractName];
}