import axios from "axios"

export const getPrice = async () => {
    const price = await axios.get("http://54.180.247.27:8082/prices/tickers");
    console.log("price: ", price);
}
