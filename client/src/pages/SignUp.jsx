import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from '../hooks/useAuth';

import ClassesSelector from "../components/inputs/ClassesSelector";

import {
  TextField,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
  FormHelperText,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { register, login } from "../api/user";

const SignUp = () => {
  const { t } = useTranslation("common", "login");

  const { setAuth } = useAuth();

  const [laNick, setLANick] = useState("");
  const [itemlevel, setItemLevel] = useState("");
  const [laclass, setLAClass] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  let hasSixChar = password.length >= 6;

  let navigation = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await register({ username: laNick, password, laclass, itemlevel });
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message);

        if (res.preaproved) {

          try {
            const res = await login({ username: laNick, password });
            if (res.error) toast.error(res.error);
            else {
              setAuth({ user: res.username, roles: res.roles });

              navigation("/", { replace: true });
            }
          } catch (e) {
            toast.error(e);
          }

        } else {
          navigation("/login", { replace: true });
        }
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForValidUsername = (e) => {
    if (/[0-9]/.test(e.key) ||
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(e.key) || // eslint-disable-line
      e.keyCode === 32) {
      e.preventDefault();
    }
  }

  const checkIfNaN = (e) => {
    const no_digits = e.target.value.replace(/\D/g, '');

    setItemLevel(no_digits);
  }

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5">
      <div className="text-center mb-5 alert alert-primary">
        <label className="h2">{t('signup')}</label>
      </div>

      <div>
        <TextField
          id="lost-ark-name"
          size="small"
          label={t('usernameinput', { ns: 'login' })}
          variant="outlined"
          className="form-control w70"
          value={laNick}
          onChange={(e) => setLANick(e.target.value)}
          onKeyDown={(e) => checkForValidUsername(e)}
        />
        <TextField
          id="lost-ark-ilevel"
          size="small"
          label={t('ilvl')}
          type="number"
          variant="outlined"
          className="form-control w30"
          value={itemlevel}
          onChange={(e) => checkIfNaN(e)}
        />
      </div>

      {itemlevel.length > 4 && (
        <FormHelperText>
          <span className="text-danger">
            <CancelIcon className="mr-1" fontSize="small"></CancelIcon>
            <small>{t('ilvl-toolong', { ns: 'login' })}</small>
          </span>
        </FormHelperText>
      )}

      <div className="mt-15">
        <ClassesSelector onValueChange={(e) => setLAClass(e.value)} />
      </div>

      <div className="mt-15">
        <FormControl varian="outlined" size="small" className="form-control">
          <InputLabel>{t('passwordinput', { ns: 'login' })}</InputLabel>
          <OutlinedInput
            id="password"
            label={t('passwordinput', { ns: 'login' })}
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
          {!hasSixChar && password && confirmPassword && (
            <FormHelperText style={{ marginLeft: "0px" }}>
              <span className="text-danger">
                <CancelIcon className="mr-1" fontSize="small"></CancelIcon>
                <small>{t('passwordtooshort', { ns: 'login' })}</small>
              </span>
            </FormHelperText>
          )}
        </FormControl>
      </div>
      <div className="mt-15">
        <TextField
          type={showPassword ? "text" : "password"}
          id="confirm-password"
          size="small"
          label={t('confirmpassword', { ns: 'login' })}
          variant="outlined"
          className="form-control"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
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
            ),
          }}
        />
        {password && confirmPassword && (
          <FormHelperText>
            {password === confirmPassword ? (
              <span className="text-success">
                <CheckCircleIcon
                  className="mr-1"
                  fontSize="small"
                ></CheckCircleIcon>
                <small>{t('matchingpassword', { ns: 'login' })}</small>
              </span>
            ) : (
              <span className="text-danger">
                <CancelIcon className="mr-1" fontSize="small"></CancelIcon>
                <small>{t('non-matchingpassword', { ns: 'login' })}</small>
              </span>
            )}
          </FormHelperText>
        )}
      </div>
      <div className="text-center mt-4">
        <Button
          variant="contained"
          disabled={isLoading || !laNick || !password || !laclass || !hasSixChar || password !== confirmPassword}
          onClick={handleRegister}
        >
          {t('submit')}
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
