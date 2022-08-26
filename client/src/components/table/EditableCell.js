import React, { useState, useEffect, memo } from 'react';
import { usePromiseTracker } from "react-promise-tracker";

import PropTypes from "prop-types";

import Switch from "react-bootstrap/Switch";
import Select from 'react-select';
import NumericInput from '../NumericInput';

export const EditableCell = memo(({
    value: initialValue,
    column: { displayDataType, editDataType, selectData, id: columnName, isEditable = true, format },
    editingRow,
    updateMyData,
    row
}) => {
    const { promiseInProgress: isLoading } = usePromiseTracker();

    const _id = row.original._id;

    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
        setValue(e.value ?? e.target.value);
    }

    const onBlur = () => {
        if (value !== undefined && value !== null)
            updateMyData(_id, columnName, value);
        else
            setValue(initialValue);
    };

    const onToggle = () => {
        setValue(prevState => (!prevState));
    }

    useEffect(() => {
        setValue(Array.isArray(initialValue) ? initialValue.sort() : initialValue);
    }, [initialValue]);

    const checkForSymbolsOrNumbers = (e) => {
        if (!isSpecialKey(e.keyCode)) {
            if (/[0-9]/.test(e.key) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e.key)) {  // eslint-disable-line
                e.preventDefault();
            }
        }
    }

    const isSpecialKey = (keyCode) => {
        return keyCode == 8 || keyCode == 46 || keyCode == 37 || keyCode == 39;
    }

    let returnObj = null;

    if (_id === editingRow && isEditable) {
        //IsEditing
        switch (editDataType) {
            case 'number':
                returnObj = <NumericInput
                    disabled={isLoading}
                    className="editable-field"
                    placeholder={initialValue}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur} />;
                break;
            case 'switch':
                returnObj =
                    <Switch
                        checked={value}
                        onChange={onToggle}
                        onBlur={onBlur}
                        disabled={isLoading}
                    />;
                break;
            case 'select':
                const selectStyles = {
                    control: (provided) => ({
                        ...provided,
                        height: '100%'
                    }),
                    container: (provided) => ({
                        ...provided,
                        height: '100%'
                    })
                };

                const isEqual = require("react-fast-compare");

                returnObj =
                    <Select
                        isDisabled={isLoading}
                        placeholder={selectData.placeholder}
                        options={selectData.options}
                        defaultValue={
                            selectData.options.filter(option =>
                                isEqual(Array.isArray(option.value) && !isNaN(option.value) ? option.value.sort() : option.value, value))
                        }
                        menuPlacement="auto"
                        onChange={onChange}
                        onBlur={onBlur}
                        styles={selectStyles} />
                break;
            default:
                returnObj =
                    <textarea
                        disabled={isLoading}
                        placeholder={initialValue}
                        className="editable-field"
                        value={value}
                        onKeyDown={(e) => checkForSymbolsOrNumbers(e)}
                        onChange={onChange}
                        onBlur={onBlur} />;
                break;
        }
    } else {
        switch (displayDataType) {
            case 'switch':
                returnObj = <><Switch checked={initialValue} disabled /></>
                break;
            case 'format':
                returnObj = format(initialValue)
                break;
            default:
                returnObj = <>{initialValue}</>
                break;
        }
    }

    return returnObj;
})

EditableCell.propTypes = {
    value: PropTypes.any.isRequired,
    row: PropTypes.shape({
        index: PropTypes.number.isRequired,
        original: PropTypes.any.isRequired
    }),
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        displayDataType: PropTypes.string,
        editDataType: PropTypes.string,
        selectData: PropTypes.object
    }),
    updateMyData: PropTypes.func.isRequired,
    displayDataType: PropTypes.string,
    selectData: PropTypes.shape({
        placeholder: PropTypes.string,
        options: PropTypes.array
    })
};

export const defaultColumn = {
    Cell: EditableCell,
};