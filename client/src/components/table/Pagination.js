import React, { useState, useEffect, useCallback } from "react";

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import "./styles.css";

const defaultButton = props => <li {...props}>{props.children}</li>;

const Pagination = ({PageButtonComponent = defaultButton, pageCount, currentPage, isLoading, canPreviousPage, previousPage, canNextPage, nextPage, onPageChange}) => {
    const [activePage, setActivePage] = useState(currentPage);
    const [visiblePages, setVisiblePages] = useState([]);

    const getVisiblePages = useCallback((page, total) => {
        if (total < 7) {
            return filterPages([1, 2, 3, 4, 5, 6], total);
        } else {
            if (page % 5 >= 0 && page > 4 && page + 2 < total) {
                return [1, page - 1, page, page + 1, total];
            } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
                return [1, total - 3, total - 2, total - 1, total];
            } else {
                return [1, 2, 3, 4, 5, total];
            }
        }
    }, []);

    const filterPages = (visiblePages, totalPages) => {
        return visiblePages.filter(page => page <= totalPages);
    };

    const changePage = (page) => {
        if (page === activePage) {
            return;
        }

        const _visiblePages = getVisiblePages(page, pageCount);

        setVisiblePages(filterPages(_visiblePages, pageCount));

        onPageChange(page);
        setActivePage(page);
    }

    useEffect(() => {
        if(currentPage > pageCount - 1)
            changePage(0);

        setVisiblePages(getVisiblePages(null, pageCount))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCount]);

    useEffect(() => {
        if(currentPage !== activePage)
            setActivePage(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div className="pagination:container">
            <ul style={{gridTemplateColumns: `repeat(${visiblePages.length + 4}, 1fr)`}}>
                <PageButtonComponent
                    className="pagination:number"
                    onClick={() => {
                        if (!canPreviousPage || isLoading) return;
                        changePage(0);
                    }}
                    disabled={!canPreviousPage || isLoading}
                    style={{color: !canPreviousPage || isLoading ? 'lightgray' : null}}
                >
                    <KeyboardDoubleArrowLeftIcon/>
                </PageButtonComponent>
                <PageButtonComponent
                    className="pagination:number"
                    onClick={() => {
                        if (!canPreviousPage || isLoading) return;
                        previousPage();
                    }}
                    disabled={!canPreviousPage || isLoading}
                    style={{color: !canPreviousPage || isLoading ? 'lightgray' : null}}
                >
                    <KeyboardArrowLeftIcon/>
                </PageButtonComponent>
                {visiblePages.map((page, index, array) => {
                    return (
                        <PageButtonComponent
                            key={page}
                            className={
                                activePage === index
                                    ? "pagination:number pagination:active"
                                    : "pagination:number"
                            }
                            onClick={(e) => changePage(index)}
                        >
                            {array[index - 1] + 2 < page ? `...${page}` : page}
                        </PageButtonComponent>
                    );
                })}
                <PageButtonComponent
                    className="pagination:number"
                    onClick={() => {
                        if (!canNextPage || isLoading) return;
                        nextPage();
                    }}
                    disabled={!canNextPage || isLoading}
                    style={{color: !canNextPage || isLoading ? 'lightgray' : null}}
                >
                    <KeyboardArrowRightIcon/>
                </PageButtonComponent>
                <PageButtonComponent
                    className="pagination:number"
                    onClick={() => {
                        if (!canNextPage || isLoading) return;
                        changePage(pageCount - 1);
                    }}
                    disabled={!canNextPage || isLoading}
                    style={{color: !canNextPage || isLoading ? 'lightgray' : null}}
                >
                    <KeyboardDoubleArrowRightIcon/>
                </PageButtonComponent>
            </ul>
        </div>
    );
}

export default Pagination;