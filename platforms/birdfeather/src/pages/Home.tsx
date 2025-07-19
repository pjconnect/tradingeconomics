import { ThemeSwitcher } from "../components/SwitchThemes";
import { useState, useRef, useEffect } from "react";
import countries from "../data/listofcountries.json";
import TradeconAPI from "../services/TradeconAPI";
import { createChart, ColorType, LineSeries } from 'lightweight-charts';

// Define the types for indicator data
interface Indicator {
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

interface HistoricalData {
    Country: string;
    Category: string;
    DateTime: string;
    Value: number;
    Frequency: string;
}

export default function Home() {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [selectedIndicator, setSelectedIndicator] = useState<string>("");
    const [chartLoading, setChartLoading] = useState(false);
    
    const chartContainerRef = useRef<HTMLDivElement>(null);
    
    function getDataByCountry(country: string) {
        setLoading(true);
        setSelectedCountry(country);
        setHistoricalData([]);
        setSelectedIndicator("");
        
        TradeconAPI.getIndicatorsByCountry(country)
            .then(data => {
                setIndicators(data);
            })
            .catch(error => {
                console.error('Error fetching country data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getHistoricalData(indicator: Indicator) {
        setChartLoading(true);
        setSelectedIndicator(indicator.Category);
        
        TradeconAPI.getHistoricalIndicator(selectedCountry, indicator.Category.toLowerCase())
            .then(data => {
                console.log('Historical Data:', data);
                setHistoricalData(data);
            })
            .catch(error => {
                console.error('Error fetching historical data:', error);
            })
            .finally(() => {
                setChartLoading(false);
            });
    }

    // Format date from ISO string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };
    
    // Initialize and update chart when historical data changes
    useEffect(() => {
        if (!historicalData.length || !chartContainerRef.current) return;

        chartContainerRef.current.innerHTML = ''; // Clear previous chart
        
        const chartOptions = {
            width: chartContainerRef.current.clientWidth,
            height: 400,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(33, 56, 77, 1)',
            },
            grid: {
                vertLines: {
                    color: 'rgba(197, 203, 206, 0.4)',
                },
                horzLines: {
                    color: 'rgba(197, 203, 206, 0.4)',
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(197, 203, 206, 1)',
            },
        };
        
        // Create chart instance
        const chart = createChart(chartContainerRef.current, chartOptions) as any;
        if(chart=== null) {
            return;
        }

        // Format data for the chart
        const formattedData = historicalData.map(item => ({
            time: item.DateTime.split('T')[0], // Format: YYYY-MM-DD
            value: item.Value
        }));
        
        // Add line series to the chart
        const lineSeries = chart?.addSeries?.(LineSeries);
        
        // Set the data
        lineSeries.setData(formattedData);
        
    }, [historicalData]);

    return (
        <div className="min-h-screen bg-background-default text-text-default transition-colors duration-300">
            <header className="bg-primary p-4 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Birdfeather</h1>
                    <ThemeSwitcher />
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">
                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Indices by Countries</h2>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search countries..."
                                className="py-2 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                            {countries.map((country, index) => (
                                <div 
                                    onClick={() => getDataByCountry(country.name)} 
                                    key={index} 
                                    className={`cursor-pointer flex-shrink-0 w-48 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${selectedCountry === country.name ? 'bg-primary/10 border-primary' : 'bg-card'}`}
                                >
                                    <img src={country.image} alt={country.name} className="w-16 h-16 mx-auto mb-2" />
                                    <div className="text-center">
                                        <h3 className="font-medium">{country.name}</h3>
                                        <p className="text-sm text-muted">{country.code}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Historical Data Chart Section */}
                {selectedIndicator && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedIndicator} Historical Data for {selectedCountry}
                        </h2>
                        
                        {chartLoading && (
                            <div className="flex justify-center items-center h-80">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {!chartLoading && historicalData.length > 0 && (
                            <div className="bg-card p-4 rounded-lg shadow-md">
                                <div ref={chartContainerRef} className="w-full h-[400px]"></div>
                            </div>
                        )} 

                        {!chartLoading && historicalData.length === 0 && (
                            <div className="text-center p-8 bg-card rounded-lg">
                                <p>No historical data available for {selectedIndicator}</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Indicators Table Section */}
                {selectedCountry && (
                    <section className="mb-8 max-h-[500px] overflow-auto">
                        <h2 className="text-2xl font-bold mb-4">Indicators for {selectedCountry}</h2>
                        
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : indicators.length > 0 ? (
                            <div className="overflow-x-auto shadow-md rounded-lg">
                                <table className="min-w-full bg-card">
                                    <thead className="bg-primary/10">
                                        <tr>
                                            <th className="py-3 px-4 text-left font-medium">Category</th>
                                            <th className="py-3 px-4 text-left font-medium">Latest Value</th>
                                            <th className="py-3 px-4 text-left font-medium">Date</th>
                                            <th className="py-3 px-4 text-left font-medium">Previous Value</th>
                                            <th className="py-3 px-4 text-left font-medium">Unit</th>
                                            <th className="py-3 px-4 text-left font-medium">Frequency</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {indicators.map((indicator, index) => (
                                            <tr 
                                                key={index} 
                                                onClick={() => getHistoricalData(indicator)} 
                                                className={`hover:bg-primary/5 cursor-pointer ${selectedIndicator === indicator.Category ? 'bg-primary/10' : ''}`}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="font-medium">{indicator.Category}</div>
                                                    <div className="text-sm text-muted">{indicator.CategoryGroup}</div>
                                                </td>
                                                <td className="py-3 px-4 font-medium">
                                                    {indicator.LatestValue}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatDate(indicator.LatestValueDate)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {indicator.PreviousValue}
                                                    <div className="text-xs text-muted">{formatDate(indicator.PreviousValueDate)}</div>
                                                </td>
                                                <td className="py-3 px-4">{indicator.Unit}</td>
                                                <td className="py-3 px-4">{indicator.Frequency}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-card rounded-lg">
                                <p>No indicators found for {selectedCountry}</p>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}