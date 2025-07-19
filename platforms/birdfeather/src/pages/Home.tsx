import { ThemeSwitcher } from "../components/SwitchThemes";
import { useState, useRef } from "react";
import TradeconAPI from "../services/TradeconAPI";
import Logo from "../components/Logo";
import CountriesList from "../components/CountriesList";
import type { HistoricalData, Indicator } from "../types";
import Footer from "../components/Footer";
import LightChart from "../components/LightChart";
import IndicatorsTable from "../components/IndicatorsTable";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedIndicator, setSelectedIndicator] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<{country: string, icon: string} | null>(null);

    function getDataByCountry(data: {country: string, icon: string}) {
        setLoading(true);
        setSelectedCountry(data);

        TradeconAPI.getIndicatorsByCountry(data.country)
            .then(data => {
                setIndicators(data);
            })
            .catch(error => {
                setIndicators([]);
                setSelectedIndicator("");
                console.error('Error fetching country data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getHistoricalData(indicator: Indicator) {
        setChartLoading(true);
        setHistoricalData([]);
        setSelectedIndicator(indicator.Category);

        if (!selectedCountry) {
            return;
        }

        TradeconAPI.getHistoricalIndicator(selectedCountry?.country, indicator.Category.toLowerCase())
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

    return (
        <div className=" bg-background-default text-text-default transition-colors duration-300">
            <div className="min-h-screen">

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
                    <LightChart
                        historicalData={historicalData}
                        loading={chartLoading}
                        selectedIndicator={selectedIndicator}
                    />

                    {/* Indicators by the selected country */}
                    <IndicatorsTable
                        indicators={indicators}
                        loading={loading}
                        selectedIndicator={selectedIndicator}
                        selectedCountry={selectedCountry}
                        onSelectIndicator={getHistoricalData}
                    />
                </main>
            </div>
            <Footer />
        </div>
    );
}