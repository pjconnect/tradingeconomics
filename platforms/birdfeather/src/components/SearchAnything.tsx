import { useState, useEffect, useRef } from "react";
import TradeconAPI from "../services/TradeconAPI";

export default function SearchAnything() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear previous timer on each searchTerm change
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Only search if there's a search term
        if (searchTerm.trim()) {
            // Set a new timer
            debounceTimerRef.current = setTimeout(async () => {
                const data = await TradeconAPI.search(searchTerm);
                console.log('Search Results:', data);
                setResults(data);
            }, 2000); // 2 seconds delay
        } else {
            setResults([]);
        }

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm]);

    return (
        <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-3xl text-center font-normal">Search Anything</h2>
            <input
                type="text"
                value={searchTerm}
                className="my-5 py-4 px-4 w-full pr-10 bg-primary text-default decoration-default border border-accent rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
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
