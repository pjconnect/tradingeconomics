import React, { useState } from 'react';
import SearchAnything from '../components/SearchAnything';

const Search: React.FC = () => {
    return (
        <main className="container mx-auto py-8 px-4">
            {/* Search Section */}
            <SearchAnything />

            {/* Results Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Search Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Results will be displayed here */}
                </div>
            </div>
        </main>

    );
};

export default Search;