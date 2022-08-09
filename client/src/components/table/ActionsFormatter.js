import { useTranslation } from 'react-i18next';

import { useMemo } from 'react';

import {
    IconButton,
    Tooltip
} from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

import AccessibleIcon from '@mui/icons-material/Accessible';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import CancelIcon from '@mui/icons-material/Cancel';

import SaveAsIcon from '@mui/icons-material/SaveAs';

const ActionsFormatter = ({row, onEditRow, onCancelEdit, onDeleteRow, onSaveRow, isLoading, editingRow }) => {   
    const {t} = useTranslation(['common']);

    const _id = useMemo(()=> row.original._id, [row.original]);
    const rowIndex = useMemo(()=> row.id, [row.id]);

    const isActive = !isLoading && (!editingRow || editingRow === _id);

    const normalButtons = () => {
        return (
            <>
                <Tooltip title={t('edit')} placement="top" arrow>
                    <span>
                        <IconButton
                            style={isActive ? {color: "orange"} : null}
                            onClick={(e) => isActive ? onEditRow(_id, row.original) : null}>
                            <EditIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title={t('delete')} placement="top" arrow>
                    <span>
                        <IconButton
                            style={isActive ? {color: "red"} : null}
                            onClick={(e) => isActive ? onDeleteRow(_id) : null }>
                            <DeleteForeverIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </>
        )
    }

    const editingButtons = () => {
        return (
            <>
                <Tooltip title={t('save')} placement="top" arrow>
                    <span>
                        <IconButton
                            style={{ color: "#198754" }}
                            onClick={(e) => isActive ? onSaveRow(rowIndex) : null}>
                            <SaveAsIcon/>
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title={t('cancel')} placement="top" arrow>
                    <span>
                        <IconButton
                            style={{ color: "red" }}
                            onClick={(e) => isActive ? onCancelEdit() : null}>
                            <CancelIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </>
        )
    }

    return (
        editingRow === _id ? editingButtons() : normalButtons()
    )
}

export default ActionsFormatter;