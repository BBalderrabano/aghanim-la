import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Loading from "../Loading";

import useAuth from "../../hooks/useAuth";

import { getLoggedInUser } from "../../api/user";
import { toast } from "react-toastify";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = async () => {
      try {
        await getLoggedInUser()
          .then((res) => {           
            if (res.error) {
              console.error(res.error);
            } else {
              setAuth((prev) => {
                return {
                  ...prev,
                  roles: res.roles,
                  user: res.username,
                  _id: res._id
                };
              });
            }
          })
          .catch((err) => toast.error(err));
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    unsubscribe();

    return () => (isMounted = false);
  }, [setAuth]);

  return (
    <>{isLoading ? <p><Loading/></p> : <Outlet />}</>
  );
};

export default PersistLogin;
