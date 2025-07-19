import { ThemeSwitcher } from "../components/SwitchThemes";
import { useState } from "react";
import countries from "../data/listofcountries.json";
import TradeconAPI from "../services/TradeconAPI";

// Define the type for indicator data
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
    [key: string]: any; // For any other properties
}

export default function Home() {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [loading, setLoading] = useState(false);

    function getDataByCountry(country: string) {
        setLoading(true);
        setSelectedCountry(country);
        
        TradeconAPI.getIndicatorsByCountry(country)
            .then(data => {
                console.log('Country Data:', data);
                setIndicators(data);
            })
            .catch(error => {
                console.error('Error fetching country data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Format date from ISO string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
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

                        <div className="flex justify-between mt-4">
                            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </button>
                            <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg flex items-center">
                                Next
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

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
                                            <tr key={index} className="hover:bg-primary/5">
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