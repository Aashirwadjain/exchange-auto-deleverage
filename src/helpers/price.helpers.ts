import axios from "axios"
import { sleep } from "../utils/utils"

type Price = {
    tokenAddress: string,
    tokenSymbol: string,
    minPrice: string,
    maxPrice: string,
    updatedAt: number,
    priceDecimals: number
}

export const getPrice = async () => {

    try {
        while(true) {
            const res = await axios.get("http://54.180.247.27:8080/prices/tickers")

            if(!res.data) {
                throw new Error("unable to fetch price data")
            }

            for(const price of res.data) {
                priceData[price.tokenAddress] = price
            }

            await sleep(500)
        }
    } catch (error) {
        console.error("error occured: ", error)
    }
    
}

export const priceData: { [key: string]: Price } = {}