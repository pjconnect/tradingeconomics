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

    static async search(searchParam: string, options: {
        sources?: string[],
        perPage?: number,
        page?: number
    } = {}) {
        const {
            sources = ['wb', 'fred', 'comtrade'],
            perPage = 50,
            page = 0
        } = options;

        const sourcesString = sources.join(',');
        const timestamp = Date.now();
        const url = `https://brains.tradingeconomics.com/v2/search/${sourcesString}?q=${encodeURIComponent(searchParam)}&pp=${perPage}&p=${page}&_=${timestamp}&stance=2`;

        const headers = { 'Authorization': `${apiKey}` };
        const response = await axios.get(url, { headers });
        return response.data;
    }

}