import { ethers } from "ethers"
import SingleMarketAdlHandler from "../abis/SingleMarketAdlHandler.json"
import { getContract } from "../config/contracts.config"
import { BITLAYER_TESTNET } from "../config/chains.config"
import { getProvider } from "../config/providers.config"
import env from "../../env.json"

export const adlUpdate = async (market: string, isLong: boolean) => {

    const wallet = new ethers.Wallet(env.PRIVATE_KEY, new ethers.providers.JsonRpcProvider(getProvider(BITLAYER_TESTNET)));

    const singleMarketAdlHandler: ethers.Contract = new ethers.Contract(
        getContract(BITLAYER_TESTNET, "SingleMarketAdlHandler"), 
        SingleMarketAdlHandler.abi,
        wallet
    )

    const tx = await singleMarketAdlHandler.simulateUpdateAdlState(market, isLong, {primaryTokens: [], primaryPrices: []})
    const receipt = await tx.wait(5)
    console.log("receipt", receipt)

}