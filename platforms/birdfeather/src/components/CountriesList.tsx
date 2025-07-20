import { useState } from "react";
import countries from "../data/listofcountries.json";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function CountriesList({ onClick }: { onClick: (data: { country: string, icon: string }) => void }) {
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    
    // Filter countries based on search term
    const filteredCountries = countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                <div className="w-full md:w-1/3 p-4">
                    <h2 className="text-2xl">Select a Country</h2>
                    <p className="text-sm opacity-60">Choose a country to view its economic indicators</p>
                </div>
                <div className="relative w-full md:w-2/5 min-w-[240px]">
                    <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 px-4 w-full pr-10 bg-primary text-default decoration-default border border-accent rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="relative">
                <button
                    className="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md bg-primary z-10 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onClick={() => {
                        const container = document.getElementById('countries-container');
                        container?.scrollBy({ left: -200, behavior: 'smooth' });
                    }}
                    aria-label="Scroll left"
                >
                    <FaAngleLeft className="text-default" />
                </button>

                <button
                    className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md bg-primary z-10 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onClick={() => {
                        const container = document.getElementById('countries-container');
                        container?.scrollBy({ left: 200, behavior: 'smooth' });
                    }}
                    aria-label="Scroll right"
                >
                    <FaAngleRight className="text-default" />
                </button>

                <div
                    id="countries-container"
                    className="flex overflow-x-auto mx-2 py-2 gap-4 scrollbar-hide snap-x snap-mandatory"
                >
                    {filteredCountries.map((country, index) => (
                        <div
                            onClick={() => { setSelectedCountry(country.name); onClick({ country: country.name, icon: country.emoji }); }}
                            key={index}
                            className={`cursor-pointer hover:bg-secondary/50 bg-primary  flex-shrink-0 w-48 p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow snap-start ${selectedCountry === country.name ? 'bg-primary' : 'bg-card'}`}
                        >
                            <img src={country.image} alt={country.name} className="w-16 h-16 mx-auto mb-2" />
                            <div className="text-center">
                                <h3 className="text-nowrap font-medium">{country.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
                </div>
            </div>
        </section>
    );
}
