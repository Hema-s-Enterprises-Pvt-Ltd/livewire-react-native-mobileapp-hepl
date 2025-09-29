import React, { createContext, useState, useContext } from 'react';

// Create a context for loading state
const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

// Custom hook to use loading context
export const useLoading = () => useContext(LoadingContext);
