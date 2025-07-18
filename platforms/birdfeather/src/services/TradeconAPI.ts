export default class TradeconAPI {
 
 
    static async getTradeconData() {
        try {
            const response = await fetch('https://api.tradecon.com/data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Tradecon data:', error);
            throw error;
        }
    }
}