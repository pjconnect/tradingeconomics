import { ThemeSwitcher } from "../components/SwitchThemes";
import { useState, useRef, useEffect } from "react";
import TradeconAPI from "../services/TradeconAPI";
import { createChart, ColorType, LineSeries } from 'lightweight-charts';
import Logo from "../components/Logo";
import CountriesList from "../components/CountriesList";
import type { HistoricalData, Indicator } from "../types";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedIndicator, setSelectedIndicator] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const chartContainerRef = useRef<HTMLDivElement>(null);

    function getDataByCountry(country: string) {
        setLoading(true);
        setSelectedCountry(country);

        TradeconAPI.getIndicatorsByCountry(country)
            .then(data => {
                setIndicators(data);
            })
            .catch(error => {
                setIndicators([]);
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
        if (chart === null) {
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
            <header className="bg-primary p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <Logo />
                    <ThemeSwitcher />
                </div>
            </header>

            <main className="container mx-auto py-8 px-4">

                {/* Countries List Section */}
                <CountriesList onClick={getDataByCountry} />
                
                {/* Historical Data Chart */}
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

                {/* Indicators by the selected country */}
                {selectedCountry && (
                    <section className="mb-8 max-h-[500px] overflow-auto">
                        <h2 className="text-2xl font-bold mb-4">Indicators for {selectedCountry}</h2>

                        {loading && (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {!loading && !indicators.length && (
                            <div className="text-center p-8 bg-card rounded-lg">
                                <p>No indicators found for {selectedCountry}</p>
                            </div>
                        )}

                        {!loading && indicators.length > 0 && (
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
                        )}

                    </section>
                )}
            </main>
        </div>
    );
}