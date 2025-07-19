// import axios
import axios from 'axios';


const apiKey = import.meta.env.VITE_TRADEECONOMICS_API_KEY;

export default class TradeconAPI {

    static async getIndicatorsByCountry(country: string) {
        const url = 'https://api.tradingeconomics.com/country/' + country + "";
        const headers = { 'Authorization': `${apiKey}` };
        const response = await axios.get(url, { headers });
        return response.data;
    }

    static async getHistoricalIndicator(country: string, indicator: string) {
        const url = `https://api.tradingeconomics.com/historical/country/${country}/indicator/${indicator}`;
        const headers = { 'Authorization': `${apiKey}` };
        const response = await axios.get(url, { headers });
        return response.data;
    }
}