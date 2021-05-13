import axios from "axios";


export async function currentEthPriceInUSD() {


    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

    return data.ethereum.usd;
}

export async function coinPriceDataInUsd(coin: string, days: number, interval: string) {
    const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`);

    
    console.log("axios retrb");
    
    console.log(data);
    return  data.prices;
}