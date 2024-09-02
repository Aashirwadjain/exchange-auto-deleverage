import { BigNumber, ethers } from "ethers";
import { getIndexTokenForMarket, getPositionKeys, getPositionsInfo } from "./handlers/positions.handlers"
import { getPrice, priceData } from "./helpers/price.helpers";
import { sleep } from "./utils/utils";
import { adlUpdate } from "./handlers/adl.handlers";

async function main() {

    try {

        // Get Price
        getPrice();

        // Get All Position Keys
        const positionKeys: string[] | undefined = await getPositionKeys(0, 20);

        if(!positionKeys) {
            throw new Error("unable to fetch position keys");
        }

        const positionData: { [key: string]: any } = {} 

        for(const positionKey of positionKeys) {
            const positionInfoList = await getPositionsInfo([positionKey])

            if(!positionInfoList) {
                throw new Error("unable to fetch position info");
            }

            positionData[positionKey] = positionInfoList[0]
        }

        // console.log("position data: ", positionData)

        const adlPositionByMarket: { [market: string]: { [direction: string]: any[] } } = {}

        // Creating ADL struct
        for(const positionKey of positionKeys) {

            const positionInfo = positionData[positionKey]

            const indexToken = await getIndexTokenForMarket(positionInfo.addresses.market)
            console.log("indexToken: ", indexToken)

            if(!indexToken) {
                throw new Error("unable to fetch index token");
            }

            if(!priceData[indexToken]) {
                continue;
            }

            const currentPrice = BigNumber.from(priceData[indexToken].maxPrice)
            console.log("current price", currentPrice)

            const entryPrice = BigNumber.from(positionInfo.numbers.sizeInUsd.div(positionInfo.numbers.sizeInTokens).toString())
            console.log("--entryPrice: ", entryPrice.toString())
            console.log("currentPrice: ", currentPrice.toString())

            if(positionInfo.flags.isLong && currentPrice.gt(BigNumber.from(entryPrice))) {
                const percentage = parseInt(currentPrice.sub(entryPrice).div(entryPrice).toString()) / 100
                console.log("percentage: ", percentage)

                if(percentage >= 95) {
                    // console.log(adlPositionByMarket[positionInfo.addresses.market])
                    adlPositionByMarket[positionInfo.addresses.market] === undefined ? 
                        adlPositionByMarket[positionInfo.addresses.market] = {
                            ["long"]: [{ ...positionInfo, positionKey, percentage }]
                        } : 
                        adlPositionByMarket[positionInfo.addresses.market]["long"] === undefined ?
                            adlPositionByMarket[positionInfo.addresses.market]["long"] = [{ ...positionInfo, positionKey, percentage }] :
                            adlPositionByMarket[positionInfo.addresses.market]["long"].push({ ...positionInfo, positionKey, percentage })
                }
            }
            else if(!positionInfo.flags.isLong && currentPrice.lt(BigNumber.from(entryPrice))) {
                const percentage = parseInt(entryPrice.sub(currentPrice).div(entryPrice).toString()) / 100
                console.log("percentage: ", percentage)

                if(percentage >= 95) {
                    // console.log(adlPositionByMarket[positionInfo.addresses.market])
                    adlPositionByMarket[positionInfo.addresses.market] === undefined ? 
                        adlPositionByMarket[positionInfo.addresses.market] = {
                            ["short"]: [{ ...positionInfo, positionKey, percentage }]
                        } : 
                        adlPositionByMarket[positionInfo.addresses.market]["short"] === undefined ?
                            adlPositionByMarket[positionInfo.addresses.market]["short"] = [{ ...positionInfo, positionKey, percentage }] :
                            adlPositionByMarket[positionInfo.addresses.market]["short"].push({ ...positionInfo, positionKey, percentage })
                }
            }
        }

        // console.dir(adlPositionByMarket, {depth: 4})

        // Sorting 
        for(const market of Object.keys(adlPositionByMarket)) {
            // console.log("markets: ", market)

            if(adlPositionByMarket[market]["long"]) {
                adlPositionByMarket[market]["long"].sort((pos1, pos2) => {
                    return pos2.percentage - pos1.percentage
                })
            }

            if(adlPositionByMarket[market]["short"]) {
                adlPositionByMarket[market]["short"].sort((pos1, pos2) => {
                    return pos2.percentage - pos1.percentage
                })
            }
        }
        
        for(const market of Object.keys(adlPositionByMarket)) {
            await adlUpdate(market, false);
        }
        
    } catch (error) {
        console.error("error occured: ", error)
    }

}

main()

