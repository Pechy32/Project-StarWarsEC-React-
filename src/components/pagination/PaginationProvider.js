import React, { createContext, useContext, useState, useEffect } from 'react';

const PaginationContext = createContext();

export const PaginationProvider = ({ children, items, pageSizeOptions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0].name);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * pageSize;
    const displayedItems = items.slice(startIndex, endIndex);

    const pageCount = Math.ceil(items.length / pageSize);

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);
        setPageSize(newPageSize);
        setCurrentPage(1);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setCurrentPage(1); 
    }, [items]);

    return (
        <PaginationContext.Provider value={{
            currentPage,
            pageSize,
            displayedItems,
            pageCount,
            handlePageSizeChange,
            handlePageChange,
            pageSizeOptions,
        }}>
            {children}
        </PaginationContext.Provider>
    );
};

export const usePagination = () => useContext(PaginationContext);