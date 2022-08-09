import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { toast } from "react-toastify";
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

import "./AdminLAClasses.css";

import { useConfirmDialog } from 'react-mui-confirm';

import ModalForm from './ModalForm';

import Table from '../../../components/table/Table';

import Loading from "../../../components/Loading";

import ToolHeader from "../ToolHeader";

const AdminLAClasses = () => {
  const { t } = useTranslation(['common', 'admin-tools']);

  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const { promiseInProgress: isProcessing } = usePromiseTracker();

  const [data, setData] = useState([]);

  const [parentClasses, setParentClasses] = useState([]);

  const confirm = useConfirmDialog();

  useEffect(() => {
    let isMounted = true;

    const getAllClasses = () => {
      setIsLoading(true);

      axios
        .get(`${process.env.REACT_APP_API_URL}/api/classes/all`, { withCredentials: true })
        .then((res) => {
          const allParentClasses = res.data.map((e, i) => ({
            label: e.parentname,
            value: e.parentname,
          }));

          const groupedParentClasses =
            allParentClasses.filter((obj, index, self) =>
              index === self.findIndex((t) => (t.label === obj.label)));

          setParentClasses(groupedParentClasses);

          setData(res.data);
        })
        .catch((err) => console.error(err))
        .finally(
          isMounted && setIsLoading(false)
        );
    };

    getAllClasses();

    return () => (isMounted = false);
  }, []);

  const addNewClass = (data) => {

    const newClass = {
      classname: data.classname,
      parentname: data.parentname,
      active: data.active
    };

    trackPromise(
      axios.post(`${process.env.REACT_APP_API_URL}/api/classes/add`,
        newClass,
        {
          withCredentials: true
        })
        .then((res) => {
          if (res.error) console.error(res.error.message)
          else {

            const addedClass = {
              ...newClass,
              _id: res.data._id
            };

            setData(current => [...current, addedClass]);
            toast.success(res.data.message);
          }
        })
        .catch((err) => console.error(err))
        .finally(setModalOpen(false)));
  }

  const deleteClass = (id) => {
    if (modalOpen)
      return;

    confirm({
      title: (t("laclasses.deleteconfirmessage", { ns: 'admin-tools' })),
      onConfirm: () => {

        trackPromise(
          axios.delete(`${process.env.REACT_APP_API_URL}/api/classes/delete/${id}`, { withCredentials: true })
            .then((res) => {
              var alteredClasses = data.filter(function (clss) { return clss._id !== id });

              const allParentClasses = alteredClasses.map((e, i) => ({
                label: e.parentname,
                value: e.parentname,
              }));

              const groupedParentClasses =
                allParentClasses.filter((obj, index, self) =>
                  index === self.findIndex((t) => (t.label === obj.label)));

              setParentClasses(groupedParentClasses);

              setData(alteredClasses);
              toast.success(res.data.message);
            })
            .catch((err) => console.error(err)));
      }
    })
  }

  const updateClass = (data) => {
    if (modalOpen)
      return;

    const updatedClass = {
      classname: data.classname,
      parentname: data.parentname,
      active: data.active,
      _id: data._id
    };

    trackPromise(
      axios.post(`${process.env.REACT_APP_API_URL}/api/classes/update/${data._id}`, updatedClass,
        {
          withCredentials: true
        })
        .then((res) => {
          if (res.error) console.error(res.error.message)
          else {
            toast.success(res.data.message);

            setData(old =>
              old.map((row) => {
                if (row._id === data._id) {
                  return updatedClass
                }
                return row
              })
            );

          }
        }));
  }

  const showModal = () => {
    setModalOpen(true);
  }

  const hideModal = () => {
    setModalOpen(false);
  }

  const columns = useMemo(
    () => [
      {
        label: t("laclasses.classname", { ns: 'admin-tools' }),
        accessor: 'classname',
      },
      {
        label: t("laclasses.parentclass", { ns: 'admin-tools' }),
        accessor: 'parentname',
        editDataType: 'select',
        selectData: {
          placeholder: t("classelect"),
          options: parentClasses
        }
      },
      {
        label: t("laclasses.enabled", { ns: 'admin-tools' }),
        accessor: 'active',
        displayDataType: 'switch',
        editDataType: 'switch'
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }], [parentClasses]);

  return (
    <div className="table-wrapper">
      <div className="table-title">
        <div className="row">
          <ToolHeader
            title={t('classes')}
            addButtonText={t("laclasses.addnewclass", { ns: 'admin-tools' })}
            allowedRoles={[parseInt(process.env.REACT_APP_ADMIN_ROLE)]}
            isProcessing={isProcessing}
            showModal={showModal}
          />
        </div>
      </div>
      <>
        {
          (modalOpen && !isProcessing) ?
            <ModalForm
              hideModal={hideModal}
              handleSubmit={addNewClass}
              parentClasses={parentClasses}
            /> : null
        }
        {
          isLoading ?
            <Loading /> :
            <Table
              data={data}
              columns={columns}
              updateData={updateClass}
              deleteData={deleteClass}
              actions={true}
            />
        }
      </>
    </div>
  );
};

export default AdminLAClasses;