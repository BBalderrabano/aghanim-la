import {useTranslation} from 'react-i18next';
import PropTypes from 'prop-types';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import RequireRole from "../../components/auth/RequireRole";

const ToolHeader = ({title, addButtonText, allowedRoles, isProcessing, showModal, children, additionalButtonStyles}) => {
    const {t} = useTranslation()

    return (
        <>
            <div className="col-sm-6">
                <h2>
                    {t('manage')} <b>{t(title)}</b>
                </h2>
            </div>
            <RequireRole allowedRoles={allowedRoles}>
                <div className="col-sm-6">
                    <button
                        className="btn btn-success"
                        disabled={isProcessing}
                        onClick={showModal}
                        style={additionalButtonStyles}
                    >
                        <AddCircleOutlineIcon />
                        <span>{addButtonText}</span>
                    </button>
                    {children}
                </div>
            </RequireRole>
        </>
    );
}

ToolHeader.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired,
    isProcessing: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    addButtonText: PropTypes.string.isRequired,
    additionalButtonStyles: PropTypes.any
}

export default ToolHeader;