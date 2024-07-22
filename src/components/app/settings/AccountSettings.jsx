import CustomBox from "../../reusable/containers/CustomBox";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Box from "@mui/material/Box";
import { Fragment, useEffect } from "react";
import * as trainersActions from "../../../actions/trainers";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import CustomSelect from "../../reusable/inputFields/CustomSelect";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import Avatar from "@mui/material/Avatar";
import {
  convertEmptyFieldsToNull,
  convertNullToEmptyString,
  formatDate,
  isNumber,
  validateField,
} from "../../../utils/utilFunctions";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CustomIconButton from "../../reusable/buttons/IconButton";
import IconButton from "@mui/material/IconButton";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import ConfirmModal from "../../reusable/modals/ConfirmModal";
import { useIsMount } from "../../../utils/customHooks/useIsMount";
import CustomModal from "../../reusable/modals/CustomModal";
import ChangePasswordModal from "./ChangePasswordModal";
import * as userActions from "../../../actions/user";
import { useTheme } from "@mui/material";

export default function AccountSettings(props) {
  const { t } = props || {};

  const theme = useTheme();
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const [initialUserState, setInitialUserState] = useState({
    ...convertNullToEmptyString(user),
    hireDate: user.hireDate ? formatDate(user.hireDate, false) : "",
  });
  const [userState, setUserState] = useState(initialUserState);
  const [errorState, setErrorState] = useState(initialErrorState);
  const [changesMade, setChangesMade] = useState(initialChangesMade); // Keeps track of which fields have been changed so those fields can be focused.
  const [activeModals, setActiveModals] = useState(initialActiveModals);

  useEffect(() => {
    if (isMount) return;

    const updatedUser = {
      ...convertNullToEmptyString(user),
      hireDate: user.hireDate ? formatDate(user.hireDate, false) : "",
    };

    setInitialUserState(updatedUser);
    setUserState(updatedUser);
  }, [user]);

  const handleChange = (event) => {
    const fieldId = event.target.id || event.target.name;
    const newValue = event.target.value;

    // Check if the new value is different from the initial value.
    if (newValue !== initialUserState[fieldId]) {
      setChangesMade({
        ...changesMade,
        [fieldId]: true,
      });
    } else {
      // If the new value is the same as the initial value, mark the field as unchanged.
      setChangesMade({
        ...changesMade,
        [fieldId]: false,
      });
    }

    setUserState({
      ...userState,
      [fieldId]: newValue,
    });
  };
  const handleClear = () => {
    setUserState(initialUserState);
    setChangesMade(initialChangesMade);
  };
  const handleDelete = () => {
    dispatch(trainersActions.deleteTrainer(userState.trainerID));
    dispatch(userActions.logout());
  };
  const handleUpdate = () => {
    const hasFirstNameError = validateField(
      userState.firstName,
      "firstName",
      setErrorState
    );
    const hasLastNameError = validateField(
      userState.lastName,
      "lastName",
      setErrorState
    );

    if (hasFirstNameError || hasLastNameError) return;
    dispatch(
      trainersActions.updateTrainer(
        convertEmptyFieldsToNull(userState),
        t?.accountSettings?.messages
      )
    );
    handleClear();
  };
  const handleImageUpload = () => {};
  const handleCloseModal = (modalName) => {
    setActiveModals({
      ...activeModals,
      [modalName]: false,
    });
  };

  return (
    <Fragment>
      <ConfirmModal
        title={t?.accountSettings?.messages?.titleDelete}
        text={t?.accountSettings?.messages?.textDelete}
        yes_action={handleDelete}
        no_action={() => handleCloseModal("confirmDelete")}
        open={activeModals.confirmDelete}
        setOpen={() => handleCloseModal("confirmDelete")}
      />
      <ConfirmModal
        title={t?.accountSettings?.messages?.titleUpdate}
        text={t?.accountSettings?.messages?.textUpdate}
        yes_action={handleUpdate}
        no_action={() => handleCloseModal("confirmUpdate")}
        open={activeModals.confirmUpdate}
        setOpen={() => handleCloseModal("confirmUpdate")}
      />
      <CustomModal
        open={activeModals.updatePassword}
        setOpen={() => handleCloseModal("updatePassword")}
      >
        <ChangePasswordModal
          t={t?.accountSettings}
          close={() => handleCloseModal("updatePassword")}
        />
      </CustomModal>

      <CustomBox
        sx={{ width: "100%", bgcolor: theme.palette.background.paper }}
      >
        <h2>
          <ManageAccountsIcon />
          {t?.tabs?.accountSettings}
        </h2>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gridGap: "2vw",
          }}
        >
          <CustomBox
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              style={{ display: "none" }}
              accept="image/*"
              id="image-picker"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-picker">
              {userState?.image ? (
                <Avatar
                  sx={{ width: "10vw", height: "10vw" }}
                  src={userState?.image}
                />
              ) : (
                <IconButton sx={{ width: "10vw", height: "10vw" }}>
                  <PhotoCameraIcon sx={{ fontSize: "10vw" }} />
                </IconButton>
              )}
            </label>
            <Box sx={{ marginTop: "4vh" }}>
              <CustomIconButton
                title={t?.accountSettings?.buttons?.btnChangePassword}
                leftIcon={<LockIcon />}
                onClick={() => {
                  setActiveModals({ ...activeModals, updatePassword: true });
                }}
              />
              <CustomIconButton
                title={t?.accountSettings?.buttons?.btnDelete}
                leftIcon={<PersonRemoveIcon />}
                onClick={() => {
                  setActiveModals({ ...activeModals, confirmDelete: true });
                }}
              />
            </Box>
          </CustomBox>
          <CustomBox
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "1vw",
            }}
          >
            <TextField
              required
              fullWidth={true}
              id="firstName"
              label={t?.accountSettings?.fields?.firstName}
              variant="outlined"
              value={userState?.firstName}
              onChange={handleChange}
              error={errorState.firstName}
            />
            <TextField
              required
              fullWidth={true}
              id="lastName"
              label={t?.accountSettings?.fields?.lastName}
              variant="outlined"
              value={userState?.lastName}
              onChange={handleChange}
              error={errorState.firstName}
            />
            <TextField
              fullWidth={true}
              id="phoneNumber"
              label={t?.accountSettings?.fields?.phoneNumber}
              variant="outlined"
              value={userState?.phoneNumber}
              onChange={(e) => {
                if (isNumber(e.target?.value, true)) {
                  handleChange(e);
                }
              }}
            />
            <TextField
              fullWidth={true}
              id="address"
              label={t?.accountSettings?.fields?.address}
              variant="outlined"
              value={userState?.address}
              onChange={handleChange}
            />
            <CustomSelect
              name="gender"
              label={t?.accountSettings?.fields?.gender}
              variant="outlined"
              value={userState?.gender}
              onChange={handleChange}
              options={["MALE", "FEMALE"]}
              hasBlank={true}
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={localStorage.getItem("appLocale") || "en"}
            >
              <DatePicker
                label={t?.accountSettings?.fields?.hireDate}
                value={userState?.hireDate || null}
                format="dd/MM/yyyy"
                disableFuture
                slotProps={{ textField: { variant: "outlined" } }}
                onChange={(e) => {
                  handleChange({ target: { id: "hireDate", value: e } });
                }}
              />
            </LocalizationProvider>
            <TextField
              fullWidth={true}
              id="username"
              label={t?.accountSettings?.fields?.username}
              variant="outlined"
              value={userState?.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth={true}
              id="trainerID"
              label={t?.accountSettings?.fields?.trainerID}
              variant="outlined"
              value={`# ${userState?.trainerID}`}
              InputProps={{
                readOnly: true,
              }}
            />
            <div style={{ gridColumn: "1 / span 2", justifySelf: "end" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <CustomIconButton
                  disabled={!Object.values(changesMade).some((value) => value)}
                  title={t?.accountSettings?.buttons?.btnClear}
                  leftIcon={<BackspaceRoundedIcon />}
                  onClick={handleClear}
                />
                <CustomIconButton
                  disabled={!Object.values(changesMade).some((value) => value)}
                  title={t?.accountSettings?.buttons?.btnUpdate}
                  leftIcon={<AccountCircleIcon />}
                  onClick={() => {
                    setActiveModals({ ...activeModals, confirmUpdate: true });
                  }}
                />
              </Box>
            </div>
          </CustomBox>
        </Box>
      </CustomBox>
    </Fragment>
  );
}

const initialErrorState = {
  firstName: false,
  lastName: false,
};
const initialChangesMade = {
  image: false,
  firstName: false,
  lastName: false,
  phoneNumber: false,
  address: false,
  gender: false,
  hireDate: false,
  username: false,
};
const initialActiveModals = {
  confirmDelete: false,
  confirmUpdate: false,
  updatePassword: false,
};
