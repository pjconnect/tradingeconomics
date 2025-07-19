import { useState } from "react";
import TradeconAPI from "../services/TradeconAPI";

export default function SearchAnything() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async () => {
        const data = await TradeconAPI.search(searchTerm);
        setResults(data);
    };

    return (
        <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-2xl font-semibold">Search Anything</h2>
            <input
                type="text"
                value={searchTerm}
                className="py-2 px-4 w-full pr-10 bg-primary text-default decoration-default border border-accent rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {results.map((result) => (
                    <li key={result.id}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
}
