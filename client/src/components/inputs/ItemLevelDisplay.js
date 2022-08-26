import { useState, useEffect, useRef } from 'react';

import axios from '../../api/aghanim';
import useAxiosFunction from '../../hooks/useAxiosFunction';

import { useTranslation } from 'react-i18next';

import { Tooltip, IconButton } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

import SaveAsIcon from '@mui/icons-material/SaveAs';

import './ItemLevelDisplay.css';
import Loading from '../Loading';
import { toast } from 'react-toastify';

const ItemLevelDisplay = ({ user_id, itemlevel, disabled, showTooltip, handleUpdate }) => {
    const { t } = useTranslation("common");

    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);

    const [width, setWidth] = useState(0);

    const inputRef = useRef();

    const [result, error, loading, axiosFetch] = useAxiosFunction();

    useEffect(() => {
        setValue(itemlevel);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        setWidth(Math.max(value.toString().length, 2));
    }, [value]);

    useEffect(() => {
        if (!isEditing)
            inputRef.current.blur();
    }, [isEditing])

    useEffect(() => {
        inputRef.current.setSelectionRange(index, index);
    }, [index]);

    useEffect(() => {
        setIsEditing(false);

        if (result?.updated) {
            handleUpdate();
        }
        //eslint-disable-next-line
    }, [result]);

    useEffect(() => {
        if(error){
            toast.error(error);
            setIsEditing(false);
        }
    }, [error]);

    const handleSave = () => {
        axiosFetch({
            axiosInstance: axios,
            method: 'POST',
            url: `/api/users/update/${user_id}`,
            requestConfig: {
                itemlevel: value
            }
        })
    }

    const setCharAt = (str, i, char) => {
        if (i > str.length - 1) return str;

        return str.substring(0, i) + char + str.substring(i + 1);
    }

    const pushNewValue = (e) => {
        if(e.keyCode === 32){
            e.preventDefault();
        }else if (e.keyCode === 37) {
            setIndex(prevIndex => prevIndex - 1);
            e.preventDefault();
        } else if (e.keyCode === 38) {
            setIndex(0);
            e.preventDefault();
        } else if (e.keyCode === 39) {
            setIndex(prev => Math.min(prev + 1, value.toString().length));
            e.preventDefault();
        } else if (e.keyCode === 40) {
            setIndex(value.toString().length);
            e.preventDefault();
        } else if (value.toString().length >= 4
            && !isNaN(e.key)
            && e.target.selectionStart === e.target.selectionEnd) {
            let processedString = setCharAt(value.toString(), index, e.key);

            setValue(processedString);

            setIndex(Math.min(index + 1, value.toString().length));

            e.preventDefault();
        }
    }

    const handleBlur = (e) => {
        const currentTarget = e.currentTarget;

        setTimeout(() => {
            if (!currentTarget.contains(e.relatedTarget)) {
                setValue(itemlevel);
                setIsEditing(false);
            }
        }, 0);
    };

    return (
        <Tooltip title={!showTooltip || isEditing || disabled || error ? "" : t('edit')} placement="bottom" arrow>
            <div
                onBlur={handleBlur}
                onClick={(e) => {
                    if (disabled) return;

                    if (e.target.selectionStart === e.target.selectionEnd) {
                        setIndex(e.target.selectionStart);
                    }

                    setIsEditing(true);
                }
                }
                className='display-input-container'>
                <input
                    ref={inputRef}
                    disabled={disabled || error}
                    type="text"
                    pattern="^\d{10}$"
                    maxLength="5"
                    onKeyDown={pushNewValue}
                    className={
                        `display-input 
                        ${isEditing && 'is-editing'} 
                        ${disabled && 'is-disabled'}`
                    }
                    style={{ width: (width + .5) + 'ch' }}
                    onChange={(e) => {
                        if (e.target.selectionStart === e.target.selectionEnd) {
                            setIndex(e.target.selectionStart);
                        }

                        let intValue = parseInt(e.target.value.replace(/[^0-9]/g, ""));

                        if(isNaN(intValue))
                            intValue = 10;

                        setValue(Math.max(intValue, 10));
                    }}
                    value={value}
                />
                {
                    isEditing && !error ?
                        (loading ?
                            <Loading size={25} />
                            :
                            <IconButton className='save-button' onClick={() => handleSave()}>
                                <SaveAsIcon />
                            </IconButton>)
                        :
                        <EditIcon style={disabled ?
                            { color: 'lightgray', cursor: 'initial' } :
                            { color: 'rgb(25, 118, 210)' }} />
                }
            </div>
        </Tooltip>
    )
}

export default ItemLevelDisplay;