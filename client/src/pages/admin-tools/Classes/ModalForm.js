import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Creatable from 'react-select/creatable';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Switch from "react-bootstrap/Switch";

const ModalForm = (props) => {
    const {t} = useTranslation(['common', 'admin-tools']);

    const [className, setClassName] = useState("");
    const [parentName, setParentName] = useState("");
    const [active, setActive] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        props.handleSubmit({
            classname: className,
            parentname: parentName.label,
            active: active
        });
    }

    const handleSelect = (value) => {
        setParentName(value);
    }

    const checkForSymbolsOrNumbers = (e) => {
        if (/[0-9]/.test(e.key) || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e.key)) {  // eslint-disable-line
            e.preventDefault();
        }
    }

    return (
        <Modal show={true} onHide={props.hideModal}>
            <ModalHeader>
                <ModalTitle>{t("laclasses.addnewclass", {ns:'admin-tools'})}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form.Group >
                    <Form.Label>{t("laclasses.classname", {ns:'admin-tools'})}: </Form.Label>
                    <Form.Control
                        disabled={isLoading}
                        type="text"
                        onChange={!isLoading ? (e) => setClassName(e.target.value) : null}
                        value={className}
                        onKeyPress={(e) => checkForSymbolsOrNumbers(e)} />
                </Form.Group>
                <br />
                <Form.Group >
                    <Form.Label>{t("laclasses.parentclass", {ns:'admin-tools'})}: </Form.Label>
                    <Creatable
                        onChange={!isLoading ? handleSelect : null}
                        disabled={isLoading}
                        value={parentName}
                        onKeyDown={(e) => checkForSymbolsOrNumbers(e)}
                        placeholder={t("classelect")}
                        createOptionPosition="first"
                        options={props.parentClasses} />
                </Form.Group>
                <br />
                <Form.Group >
                    <Form.Label>{t("laclasses.enabled", {ns:'admin-tools'})}: </Form.Label>
                    <Switch
                        disabled={isLoading}
                        checked={active}
                        onChange={!isLoading ? (e) => setActive(!active) : null} />
                </Form.Group>

            </ModalBody>
            <ModalFooter>
                <Button
                    onClick={props.hideModal}
                    disabled={isLoading}>{t("close")}</Button>
                <Button
                    variant="success"
                    disabled={isLoading || !className || !parentName}
                    onClick={(!isLoading && className && parentName) ? (e) => handleSubmit(e) : null}>
                    {isLoading ? `${t('saving')}...` : t('save')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ModalForm;