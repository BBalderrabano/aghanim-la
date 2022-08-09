import { useCallback, useEffect, useState, useRef } from "react";

import { usePromiseTracker } from "react-promise-tracker";

import { useTranslation } from "react-i18next";

import { motion } from "framer-motion";

import "./PendingUserDisplay.css";

import { IconButton, Tooltip } from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const PendingUserDisplay = ({
  data,
  animate,
  onDeletePreaprovedUser,
  onAproveUser,
}) => {
  const { t } = useTranslation(["admin-tools"]);

  const { promiseInProgress: isLoading } = usePromiseTracker();

  const [sortedData, setSortedData] = useState([]);

  const initialAnimation = useRef("hide_child");

  const sortData = useCallback((sortable) => {
    return sortable.sort(function (a, b) {
      const _a = a?.laclass?._id;
      const _b = b?.laclass?._id;
      return (_a === undefined) - (_b === undefined);
    });
  }, []);

  useEffect(() => {
    setSortedData(sortData(data));
  }, [data, sortData]);

  const container = {
    hide_child: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
      transitionEnd: {
        display: "none",
      },
    },
    show_child: {
      opacity: 1,
      display: "block",
      transition: {
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hide_child: (i) => ({
      opacity: 0,
      translateY: -50,
      transition: { delay: Math.min(i, 10) * 0.05 },
    }),
    show_child: (i) => ({
      opacity: 1,
      translateY: 0,
      transition: { duration: 0.1, delay: Math.min(i, 10) * 0.05 },
    }),
  };

  return (
    <motion.div
      variants={container}
      initial="hide_child"
      animate={animate}
      onAnimationEnd={() =>
        initialAnimation === "hide_child" ? "show_child" : "hide_child"
      }
    >
      {sortedData.map((e, i) => {
        return (
          <motion.div
            key={`pending_display_${e._id}`}
            style={
              e?.laclass
                ? { backgroundColor: "paleturquoise" }
                : { backgroundColor: "lightgray" }
            }
            className="row pending-user-display"
            custom={i}
            variants={item}
            initial={initialAnimation}
            animate={animate}
          >
            <div className="col">
              <h3 className="one">
                {e?.laclass
                  ? `${e.username} (${e?.laclass?.classname})`
                  : e.username}
              </h3>
            </div>
            <div className="col-auto">
              {e?.laclass ? (
                <Tooltip title={t("users.approve")}>
                  <IconButton
                    className="btn btn-xs btn-success pull-right"
                    fontSize="large"
                    color={!isLoading ? "success" : "default"}
                    onClick={!isLoading ? () => onAproveUser(e._id) : null}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip title={t("users.deny")}>
                <IconButton
                  className="btn btn-xs btn-success pull-right"
                  fontSize="large"
                  style={!isLoading ? { color: "red" } : null}
                  onClick={
                    !isLoading ? () => onDeletePreaprovedUser(e._id) : null
                  }
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PendingUserDisplay;
