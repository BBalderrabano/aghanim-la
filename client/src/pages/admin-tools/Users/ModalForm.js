import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePromiseTracker } from 'react-promise-tracker';

import InfoIcon from '@mui/icons-material/Info';

import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

const ModalForm = ({ hideModal, handleSubmit }) => {
    const { t } = useTranslation(['common', 'admin-tools']);

    const [userName, setUserName] = useState([]);

    const { promiseInProgress: isLoading } = usePromiseTracker();

    const onSubmit = (e, closeModal) => {
        e.preventDefault();

        handleSubmit(userName, closeModal);
        setUserName([]);
    }

    const checkKeyPress = (e) => {
        if (/[0-9]/.test(e.key) ||
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e.key) || // eslint-disable-line
            e.keyCode === 32) {
            e.preventDefault();
            return;
        }

        if (e.keyCode === 13 && !isLoading) {
            onSubmit(e, false);
        }
    }

    return (
        <Modal show={true} onHide={hideModal}>
            <ModalHeader>
                <ModalTitle>{t("users.addnewuser", { ns: 'admin-tools' })}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form.Group >
                    <Form.Control
                        autoFocus 
                        disabled={isLoading}
                        placeholder={t('users.username', { ns: 'admin-tools' })}
                        type="text"
                        onChange={!isLoading ? (e) => setUserName(e.target.value) : null}
                        value={userName}
                        onKeyDown={(e) => checkKeyPress(e)} />
                    <Form.Label
                        className="enter-key-info-label">
                        <InfoIcon /><span>{t('users.enterkeyinfo', { ns: 'admin-tools' })}</span>
                    </Form.Label>
                </Form.Group>
            </ModalBody>
            <ModalFooter>
                <Button onClick={hideModal}>{t('close')}</Button>
                <Button variant="success" onClick={!isLoading ? (e) => onSubmit(e, true) : null}>{t('save')}</Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalForm;