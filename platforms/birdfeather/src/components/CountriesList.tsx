import { useState } from "react";
import countries from "../data/listofcountries.json";

export default function CountriesList({ onClick }: { onClick: (country: string) => void }) {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    return (
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
                            onClick={() => { setSelectedCountry(country.name); onClick(country.name); }}
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
    );
}
