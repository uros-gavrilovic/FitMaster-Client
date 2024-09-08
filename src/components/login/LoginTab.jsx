import AccountCircle from "@mui/icons-material/AccountCircle";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";
import { useEffect, useState } from "react";
import IconTextField from "../reusable/inputFields/IconTextField";
import { validateField } from "../../utils/utilFunctions";
import { useDispatch } from "react-redux";
import * as userActions from "../../actions/user";
import { Box, Button } from "@mui/material";
import Logo from "../reusable/Logo";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LoginIcon from "@mui/icons-material/Login";
import { useTheme } from "@emotion/react";

export function dispatchLogIn(username, password, t, dispatch) {
	dispatch(userActions.login(
		{
			username,
			password,
		},
		t?.messages
	));
}

export default function LoginTab(props) {
  const { t, handleTabChange } = props || {};
  const theme = useTheme();

  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState({
    username: "",
    password: "",
  });
  const [loginErrorState, setLoginErrorState] = useState({
    username: false,
    password: false,
  });

const handleLogIn = () => {
    const hasUsernameError = validateField(
      loginState.username,
      "username",
      setLoginErrorState
    );
    const hasPasswordError = validateField(
      loginState.password,
      "password",
      setLoginErrorState
    );
    if (hasUsernameError || hasPasswordError) return;
    dispatchLogIn(loginState.username, loginState.password, t, dispatch);
  };

  return (
    <Box
      id="login-container"
      className="center container"
      sx={{
        background: theme.palette.menu.default,
        color: theme.palette.text.primary,
      }}
    >
      <Logo />
      {t?.titleLogIn}
      <IconTextField
        id="username"
        inputProps={{ "data-testid": "username" }}
        title={t?.input?.username}
        icon={<AccountCircle sx={{ mr: 1, my: 0.5 }} />}
        required
        error={loginErrorState.username}
        value={loginState.username}
        onChange={(e) =>
          setLoginState({
            ...loginState,
            [e.target.id]: e.target.value,
          })
        }
      />
      <IconTextField
        id="password"
        inputProps={{ "data-testid": "password" }}
        title={t?.input?.password}
        type="password"
        icon={<HttpsRoundedIcon sx={{ mr: 1, my: 0.5 }} />}
        margin="dense"
        required
        error={loginErrorState.password}
        value={loginState.password}
        onChange={(e) =>
          setLoginState({
            ...loginState,
            [e.target.id]: e.target.value,
          })
        }
      />

      <div
        style={{
          marginTop: "5vh",
          display: "grid",
          width: "auto",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Button
          title={t?.buttons?.btnRegister}
          startIcon={<KeyboardDoubleArrowLeftIcon />}
          variant="outlined"
          style={{ width: "100%" }}
          onClick={handleTabChange}
        >
          {t?.buttons?.btnRegister}
        </Button>
        <Button
          data-testid="login-button"
          endIcon={<LoginIcon />}
          variant="contained"
          style={{ width: "100%" }}
          onClick={handleLogIn}
        >
          {t?.buttons?.btnLogIn}
        </Button>
      </div>
    </Box>
  );
}
