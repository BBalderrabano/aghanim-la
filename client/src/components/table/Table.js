import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import { usePromiseTracker } from "react-promise-tracker";
import PropTypes from "prop-types";

import { TextField, InputAdornment } from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";

import Pagination from "./Pagination";
import ActionsFormatter from "./ActionsFormatter";
import { defaultColumn } from "./EditableCell";
import useAuth from "../../hooks/useAuth";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const { t } = useTranslation(["common"]);

  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  return (
    <>
      <TextField
        label={t("searchrecords", [count])}
        variant="outlined"
        className="form-control"
        value={value || ""}
        onChange={(e) => {
          e.preventDefault();
          setValue(e.target.value);
          setGlobalFilter(e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{
          marginTop: "10px",
        }}
      />
    </>
  );
}

const Table = ({ columns, data, updateData, deleteData, actions }) => {
  const { t } = useTranslation(["common"]);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const [editingRow, setEditingRow] = useState(null);

  const [updatedData, setUpdatedData] = useState(null);

  const { promiseInProgress: isLoading } = usePromiseTracker();

  const updateMyData = (_id, columnName, value) => {
    setUpdatedData({ ...updatedData, [columnName]: value });
  };

  const editRow = (_id, data) => {
    setEditingRow(_id);
    setUpdatedData(data);
  };

  const cancelEditRow = useCallback(() => {
    setEditingRow(null);
    setUpdatedData(null);
  }, []);

  const saveUpdatedRow = (rowIndex) => {
    const isEqual = require("react-fast-compare");

    if (!isEqual(updatedData, memoizedData[rowIndex])) {
      updateData(updatedData);
    } else {
      cancelEditRow();
    }
  };

  const deleteRow = (_id) => {
    deleteData(_id);
  };

  const defaultPropGetter = () => ({});

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    gotoPage,
    setGlobalFilter,
    preGlobalFilteredRows,
    prepareRow,
    getRowProps = defaultPropGetter,
    state,
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      defaultColumn,
      updateMyData,
      editingRow,
      setEditingRow,
      initialState: {
        pageSize: 5,
        pageIndex: 0,
      },
      resetPagination: false,
      autoResetPage: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const { globalFilter, sortBy, pageIndex } = state;

  useEffect(() => {
    if (editingRow) {
      cancelEditRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  useEffect(() => {
    if (editingRow) {
      cancelEditRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter]);

  return (
    <div className="react-bootstrap-table">
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="table table-bordered" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("label")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <KeyboardArrowUpIcon />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                );
              })}
              {actions ? <th>Actions</th> : null}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(page.length > 0 &&
            page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps(getRowProps(row))}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                  {actions ? (
                    <td>
                      <ActionsFormatter
                        row={row}
                        onEditRow={editRow}
                        onCancelEdit={cancelEditRow}
                        onDeleteRow={deleteRow}
                        onSaveRow={saveUpdatedRow}
                        isLoading={isLoading}
                        editingRow={editingRow}
                      />
                    </td>
                  ) : null}
                </tr>
              );
            })) || (
            <tr>
              <td colSpan={columns.length + actions}>{t("nodisplaydata")}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        pageCount={pageCount}
        currentPage={pageIndex}
        onPageChange={(n) => {
          cancelEditRow();
          gotoPage(n);
        }}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        nextPage={nextPage}
        isLoading={isLoading}
      />
    </div>
  );
};

Table.defaultProps = {
  actions: false,
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  updateData: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  actions: PropTypes.bool,
};

export default Table;
