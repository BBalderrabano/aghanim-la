import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { motion, useAnimationControls } from "framer-motion";
import { trackPromise, usePromiseTracker } from "react-promise-tracker";
import { useConfirmDialog } from "react-mui-confirm";

import axios from "axios";

import Loading from "../../../components/Loading";
import Table from "../../../components/table/Table";

import ToolHeader from "../ToolHeader";
import ModalForm from "./ModalForm";
import NotificationButton from "./NotificationButton";
import PendingUserDisplay from "./PendingUserDisplay";

import useAuth from "../../../hooks/useAuth";

import "./AdminUsers.css";

const AdminUsers = () => {
  const { t } = useTranslation(["common", "admin-tools"]);

  const { auth } = useAuth();

  const isAdmin = auth?.roles?.includes(parseInt(process.env.REACT_APP_ADMIN_ROLE));

  const animationControls = useAnimationControls();
  const confirm = useConfirmDialog();

  const { promiseInProgress: isProcessing } = usePromiseTracker();

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pendingUserData, setPendingUserData] = useState([]);

  const showPending = useRef(false);

  let pendingUserAmount = useMemo(
    () => pendingUserData?.length,
    [pendingUserData]
  );

  useEffect(() => {
    if (pendingUserAmount <= 0 && showPending.current) {
      togglePendingUsers();
    }
  }, [pendingUserAmount]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const getAllUsers = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/all`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.error(err))
        .finally(isMounted && setIsLoading(false));
    };

    const getPendingUsers = () => {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/pending`, {
          withCredentials: true,
        })
        .then((res) => {
          setPendingUserData(res.data);
        })
        .catch((err) => console.error(err))
        .finally(getAllUsers());
    };

    getPendingUsers();

    return () => (isMounted = false);
  }, []);

  const aproveUser = (_id) => {
    trackPromise(
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/users/aprove/${_id}`,
          null,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.error) console.error(res.error.message);
          else {
            toast.success(res.data.message);

            setData((current) => [...current, res.data.result]);

            var alteredUsers = pendingUserData.filter(function (user) {
              return user._id !== _id;
            });

            setPendingUserData(alteredUsers);
          }
        })
        .catch((err) => toast.error(err.response.data.error))
    );
  };

  const preaproveUser = (userName, closeModal) => {
    const preaprovedUser = {
      username: userName,
      preaproved: true,
    };

    trackPromise(
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/users/preaprove`,
          preaprovedUser,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          const newPendingUser = {
            ...preaprovedUser,
            _id: res.data._id,
          };

          setPendingUserData((current) => [...current, newPendingUser]);
          toast.success(res.data.message);
        })
        .catch((err) => toast.error(err.response.data.error))
        .finally(closeModal ? setModalOpen(false) : null)
    );
  };

  const updateUser = (data) => {
    const updatedUser = {
      roles: data.roles,
      laclass: data.laclass,
      username: data.username,
      enabled: data.enabled,
      _id: data._id,
    };

    trackPromise(
      axios.post(`${process.env.REACT_APP_API_URL}/api/users/update/${data._id}`, updatedUser,
        {
          withCredentials: true
        })
        .then((res) => {
          if (res.error) toast.error(res.error)
          else {
            toast.success(res.data.message);

            setData(old =>
              old.map((row) => {
                if (row._id === data._id) {
                  return updatedUser
                }
                return row
              })
            );
          }
        }));
  };

  const deleteUser = (_id) => {
    confirm({
      title: t("users.deleteconfirmessage", { ns: "admin-tools" }),
      onConfirm: () => {
        trackPromise(
          axios
            .delete(
              `${process.env.REACT_APP_API_URL}/api/users/delete/${_id}`,
              { withCredentials: true }
            )
            .then((res) => {
              var alteredPendingUsers = pendingUserData.filter(function (user) {
                return user._id !== _id;
              });

              var alteredUsers = data.filter(function (user) {
                return user._id !== _id;
              });

              setData(alteredUsers);
              setPendingUserData(alteredPendingUsers);

              toast.success(res.data.message);
            })
            .catch((err) => console.error(err))
        );
      },
    });
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const hideModal = () => {
    setModalOpen(false);
  };

  const togglePendingUsers = async () => {
    showPending.current = !showPending.current;

    if (showPending.current) {
      await trackPromise(animationControls.start("hide"));

      return await trackPromise(animationControls.start("show_child"));
    } else {
      await trackPromise(animationControls.start("hide_child"));

      return await trackPromise(animationControls.start("show"));
    }
  };

  const columns = useMemo(
    () => [
      {
        label: t("users.username", { ns: "admin-tools" }),
        accessor: "username",
        isEditable: false,
      },
      {
        label: t("laclasses.classname", { ns: "admin-tools" }),
        accessor: "laclass.classname",
        isEditable: false,
      },
      {
        label: t("roles"),
        accessor: "roles",
        editDataType: "select",
        selectData: {
          placeholder: t("roles"),
          options: [
            {
              label: t("user"),
              value: [parseInt(process.env.REACT_APP_USER_ROLE)],
            },
            {
              label: t("editor"),
              value: [
                parseInt(process.env.REACT_APP_USER_ROLE),
                parseInt(process.env.REACT_APP_EDITOR_ROLE),
              ],
            },
            {
              label: t("admin"),
              value: [
                parseInt(process.env.REACT_APP_USER_ROLE),
                parseInt(process.env.REACT_APP_EDITOR_ROLE),
                parseInt(process.env.REACT_APP_ADMIN_ROLE),
              ],
            },
          ],
        },
        displayDataType: "format",
        format: (val) => {
          if (val.includes(parseInt(process.env.REACT_APP_ADMIN_ROLE)))
            return t("admin");
          else if (val.includes(parseInt(process.env.REACT_APP_EDITOR_ROLE)))
            return t("editor");
          else return t("user");
        },
      },
      {
        label: t("users.enabled", { ns: "admin-tools" }),
        accessor: "enabled",
        displayDataType: "switch",
        editDataType: "switch",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  let buttonStyles = {
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
  };

  const animationVariants = {
    hide: {
      y: 100,
      transitionEnd: {
        display: "none",
      },
      opacity: 0,
      transition: { duration: 0.5 },
    },
    show: {
      y: 0,
      display: "block",
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="table-wrapper">
      <div className="table-title">
        <div className="row">
          <ToolHeader
            title={t("users")}
            addButtonText={t("users.addnewuser", { ns: "admin-tools" })}
            allowedRoles={[
              parseInt(process.env.REACT_APP_ADMIN_ROLE),
              parseInt(process.env.REACT_APP_EDITOR_ROLE),
            ]}
            isProcessing={isProcessing}
            showModal={showModal}
            additionalButtonStyles={pendingUserAmount > 0 ? buttonStyles : null}
          >
            {pendingUserAmount > 0 ? (
              <NotificationButton
                isLoading={isProcessing}
                tooltip={t("users.pendingusers", { ns: "admin-tools" })}
                onClick={() => togglePendingUsers()}
                value={pendingUserAmount}
              />
            ) : null}
          </ToolHeader>
        </div>
      </div>
      <>
        {modalOpen ? (
          <ModalForm
            hideModal={hideModal}
            isLoading={isProcessing}
            handleSubmit={preaproveUser}
          />
        ) : null}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {pendingUserAmount > 0 ? (
              <PendingUserDisplay
                data={pendingUserData}
                animate={animationControls}
                onDeletePreaprovedUser={deleteUser}
                onAproveUser={aproveUser}
              />
            ) : null}

            <motion.div
              initial={false}
              variants={animationVariants}
              animate={animationControls}
            >
              <Table
                data={data}
                columns={columns}
                updateData={updateUser}
                deleteData={deleteUser}
                actions={isAdmin}
              />
            </motion.div>
          </>
        )}
      </>
    </div>
  );
};

export default AdminUsers;
