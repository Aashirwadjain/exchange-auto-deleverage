import axios from "axios"

export const getPrice = async () => {
    const res = await axios.get("http://54.180.247.27:8082/prices/tickers");
    const price = res.data;
    console.log("price: ", price);
}
