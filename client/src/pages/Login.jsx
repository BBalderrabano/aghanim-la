import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import {
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { login } from "../api/user";

import useAuth from '../hooks/useAuth';

const Login = () => {
  const { t } = useTranslation(['common', 'login']);

  const navigation = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { setAuth } = useAuth();

  const [laNick, setLANick] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ username: laNick, password });
      if (res.error) toast.error(res.error);
      else {
        setAuth({ user: res.username, roles: res.roles, _id: res._id });

        navigation(from, { replace: true });
      }
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
      <div className="text-center mb-5 alert alert-primary">
        <label className="h2">{t('login')}</label>
      </div>

      <div className="form-group">
        <TextField
          id="outlined-basic"
          size="small"
          label={t('usernameinput', {ns:'login'})}
          variant="outlined"
          className="form-control"
          value={laNick}
          onChange={(e) => setLANick(e.target.value)}
        />
      </div>
      <div className="form-grup mt-15">
        <FormControl varian="outlined" size="small" className="form-control">
          <InputLabel>{t('passwordinput', {ns:'login'})}</InputLabel>
          <OutlinedInput
            label={t('passwordinput', {ns:'login'})}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
      <div className="text-center mt-4">
        <Button
          onClick={handleLogin}
          variant="contained"
          disabled={!laNick || !password}
        >
          {t('submit')}
        </Button>
      </div>
    </div>
  );
};

export default Login;
