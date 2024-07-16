import React from 'react';
import { usePagination } from './PaginationProvider';
import Pagination from 'react-bootstrap/Pagination';

const PaginatingComponent = ({ children, carouselMode }) => {
    const {
        currentPage,
        pageSize,
        displayedItems,
        pageCount,
        handlePageSizeChange,
        handlePageChange,
        pageSizeOptions,
    } = usePagination();

    const getPageItems = () => {
        const items = [];
        const maxPagesToShow = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(pageCount, startPage + maxPagesToShow - 1);



        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }



        if (startPage > 1) {
            items.push(
                <Pagination.First key="first" onClick={() => handlePageChange(1)} />
            );
        }

        if (currentPage > 1) {
            items.push(
                <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />
            );
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        if (currentPage < pageCount) {
            items.push(
                <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />
            );
        }

        if (endPage < pageCount) {
            items.push(
                <Pagination.Last key="last" onClick={() => handlePageChange(pageCount)} />
            );
        }

        return items;
    };

    return (
        <>
            {children(displayedItems)}
            <div className="pagination-container">
                <select onChange={handlePageSizeChange} value={pageSize} className='page-size-select'>
                    {pageSizeOptions.map(option => (
                        <option key={option._id} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
                <Pagination>{getPageItems()}</Pagination>
            </div>
            {!carouselMode && (
                <div className="pagination-buttons">
                    <button
                        className="pagination-button previous"
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="pagination-button next"
                        onClick={() => handlePageChange(Math.min(currentPage + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                        Next
                    </button>
                </div>
            )}
            {carouselMode && (
                <>
                    <button
                        className="carousel-button previous"
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    >
                    </button>
                    <button
                        className="carousel-button next"
                        onClick={() => handlePageChange(Math.min(currentPage + 1, pageCount))}
                        disabled={currentPage === pageCount}
                    >
                    </button>
                </>
            )}
        </>
    );
};

export default PaginatingComponent;