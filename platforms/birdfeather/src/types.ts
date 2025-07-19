
export interface Indicator {
    Country: string;
    Category: string;
    Title: string;
    LatestValueDate: string;
    LatestValue: number;
    PreviousValue: number;
    PreviousValueDate: string;
    Unit: string;
    CategoryGroup: string;
    Frequency: string;
    Source: string;
    URL: string;
    HistoricalDataSymbol?: string;
    [key: string]: any; // For any other properties
}


export interface HistoricalData {
    Country: string;
    Category: string;
    DateTime: string;
    Value: number;
    Frequency: string;
}