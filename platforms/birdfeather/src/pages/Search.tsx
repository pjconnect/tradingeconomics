import React from "react";
import SearchAnything from "../components/SearchAnything";

const Search: React.FC = () => {
    return (
        <main className="container mx-auto py-8 px-4">
            {/* Search Section */}
            <SearchAnything />

            {/* Cross-Origin not Auth */}
            <p className="text-center text-accent">
                Sorry, the search function is not working currently.
            </p>
            <p className="text-center text-red-400 text-sm uppercase">Error Type: CORS</p>
        </main>
    );
};

export default Search;
