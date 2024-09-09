import { ethers, BigNumber } from "ethers"
import { hashData, hashString } from "../utils/utils"
import DataStore from "../abis/DataStore.json"
import { BITLAYER_TESTNET } from "../config/chains.config"
import { getProvider } from "../config/providers.config"
import { getContract } from "../config/contracts.config"
import SingleMarketGlobalReader from "../abis/SingleMarketGlobalReader.json"

export async function getPositionKeys(start : number, end : number) {

    try {

        const dataStore: ethers.Contract = new ethers.Contract(
            getContract(BITLAYER_TESTNET, "DataStore"), 
            DataStore.abi, 
            new ethers.providers.JsonRpcProvider(getProvider(BITLAYER_TESTNET))
        );

        const positionKeys: string[] = await dataStore.getBytes32ValuesAt(hashString("POSITION_LIST"), start, end)

        return positionKeys
        
    } catch (error) {
        console.error("error occured: ", error)
    }

}

export async function getPositionsInfo(positionKeys: string[]) {

    try {

        const positionInfoList = []

        for(const positionKey of positionKeys) {

            const singleMarketGlobalReader: ethers.Contract = new ethers.Contract(
                getContract(BITLAYER_TESTNET, "SingleMarketGlobalReader"), 
                SingleMarketGlobalReader.abi, 
                new ethers.providers.JsonRpcProvider(getProvider(BITLAYER_TESTNET))
            );

            const positionInfo = await singleMarketGlobalReader.getSingleMarketPosition(getContract(BITLAYER_TESTNET, "DataStore"), positionKey)
            positionInfoList.push(positionInfo)

        }

        return positionInfoList
        
    } catch (error) {
        console.error("error occured: ", error)
    }

}

export async function getIndexTokenForMarket(market: string) {

    try {

        const dataStore: ethers.Contract = new ethers.Contract(
            getContract(BITLAYER_TESTNET, "DataStore"), 
            DataStore.abi, 
            new ethers.providers.JsonRpcProvider(getProvider(BITLAYER_TESTNET))
        );

        const indexToken: string = await dataStore.getAddress(hashData(["bytes32", "address"], [hashString("INDEX_TOKEN"), market]));

        return indexToken

    } catch (error) {
        console.error("error occured: ", error)
    }

}
