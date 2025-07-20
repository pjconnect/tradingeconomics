import { Fragment, useState } from "react";
import type { Indicator } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface IndicatorsTableProps {
    indicators: Indicator[];
    loading: boolean;
    selectedIndicator: string;
    selectedCountry: { country: string; icon: string } | null;
    onSelectIndicator: (indicator: Indicator) => void;
}

export default function IndicatorsTable({
    indicators,
    loading,
    selectedIndicator,
    selectedCountry,
    onSelectIndicator,
}: IndicatorsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    
    // Format date from ISO string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Filter indicators based on search term
    const filteredIndicators = indicators.filter(indicator => 
        indicator.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.CategoryGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function TableTitle({ title }: { title: string }) {
        return (
            <h2 className="text-2xl p-4">
                {selectedCountry ? `${selectedCountry.icon} ${selectedCountry.country}` : ""}{" "}
                <span className="opacity-80 font-thin">: {title}</span>{" "}
            </h2>
        );
    }

    if (!selectedCountry) {
        return <Fragment />;
    }

    return (
        <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <div className="w-full md:w-1/3">
                    <TableTitle title={"Economic Indicators"} />
                </div>
                <div className="relative w-full md:w-2/5 min-w-[240px]">
                    <input
                        type="text"
                        placeholder="Search indicators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 px-4 w-full pr-10 bg-primary text-default decoration-default border border-accent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-40">
                    <LoadingSpinner />
                </div>
            )}

            {!loading && !indicators.length && selectedCountry && (
                <div className="text-center p-8 bg-card rounded-lg">
                    <p>No indicators found for {selectedCountry.country}</p>
                </div>
            )}

            {!loading && indicators.length > 0 && filteredIndicators.length === 0 && (
                <div className="text-center p-8 bg-card rounded-lg">
                    <p>No matching indicators found for "{searchTerm}"</p>
                </div>
            )}

            {!loading && filteredIndicators.length > 0 && (
                <div className="border border-accent w-full max-h-[calc(100vh-200px)] overflow-auto shadow-md">
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
                            {filteredIndicators.map((indicator, index) => (
                                <tr
                                    key={index}
                                    onClick={() => onSelectIndicator(indicator)}
                                    className={`bg-primary hover:bg-primary/5 cursor-pointer ${selectedIndicator === indicator.Category ? "bg-primary/10" : ""
                                        }`}
                                >
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{indicator.Category}</div>
                                        <div className="text-sm text-muted">{indicator.CategoryGroup}</div>
                                    </td>
                                    <td className="py-3 px-4 font-medium">{indicator.LatestValue}</td>
                                    <td className="py-3 px-4">{formatDate(indicator.LatestValueDate)}</td>
                                    <td className="py-3 px-4">
                                        {indicator.PreviousValue}
                                        <div className="text-xs text-muted">
                                            {formatDate(indicator.PreviousValueDate)}
                                        </div>
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
    );
}