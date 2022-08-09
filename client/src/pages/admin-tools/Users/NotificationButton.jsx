import { memo } from 'react';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Tooltip } from "@mui/material";

const NotificationButton = ({ value, onClick, tooltip, isLoading }) => {
    return (
        <Tooltip title={tooltip}>
            <button disabled={isLoading} onClick={onClick} className="btn btn-warning notification-button">
                <AssignmentIndIcon />
                <span className='icon-button__badge'>{value}</span>
            </button>
        </Tooltip>
    )
}

export default memo(NotificationButton);