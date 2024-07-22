import { Button, TextField, useTheme } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import CustomSelect from "../../reusable/inputFields/CustomSelect";
import BackspaceIcon from "@mui/icons-material/Backspace";
import "react-day-picker/dist/style.css";
import {
  isNumber,
  validateField,
  convertEmptyFieldsToNull,
} from "../../../utils/utilFunctions";
import * as membersActions from "../../../actions/members";
import { useDispatch } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
// import IconButton from "../../reusable/buttons/IconButton";
import IconButton from "@mui/material/IconButton";
import withTranslations from "../../../utils/HighOrderComponent";
import CustomFormattedTextField from "../../reusable/inputFields/CustomFormattedTextField";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded";
import CustomIconButton from "../../reusable/buttons/IconButton";
import CustomBox from "../../reusable/containers/CustomBox";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import validateEmail from "../../../utils/validator";
import BadgeIcon from "@mui/icons-material/Badge";

const AddMembers = (props) => {
  const { t } = props || {};

  const dispatch = useDispatch();
  const theme = useTheme();

  const [memberState, setMemberState] = useState(initialMemberState);
  const [changesMade, setChangesMade] = useState(initialChangesMade);
  const [errorState, setErrorState] = useState(initialErrorState);

  const handleChange = (e) => {
    const fieldId = e.target.id || e.target.name;
    const newValue = e.target.value;

    if (newValue !== initialMemberState[fieldId]) {
      setChangesMade({
        ...changesMade,
        [fieldId]: true,
      });
    } else {
      setChangesMade({
        ...changesMade,
        [fieldId]: false,
      });
    }

    setMemberState({
      ...memberState,
      [fieldId]: newValue,
    });
  };
  const handleClear = () => {
    setMemberState(initialMemberState);
  };
  const handleSave = () => {
    const hasFirstNameError = validateField(
      memberState.firstName,
      "firstName",
      setErrorState
    );
    const hasLastNameError = validateField(
      memberState.lastName,
      "lastName",
      setErrorState
    );
    const hasEmailError =
      validateField(memberState.email, "email", setErrorState) ||
      validateEmail(memberState.email, "email", setErrorState);

    if (hasFirstNameError || hasLastNameError || hasEmailError) return;
    dispatch(
      membersActions.addMember(
        convertEmptyFieldsToNull(memberState),
        t?.messages
      )
    );
    handleClear();
  };
  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    // TODO: Finish this.
  };

  return (
    <CustomBox sx={{ width: "100%", bgcolor: theme.palette.background.paper }}>
      <h2>
        <PersonAddIcon />
        {t?.fields?.create_new_member}
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
            bgcolor: theme.palette.background.default,
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
            <IconButton sx={{ width: "10vw", height: "10vw" }}>
              <PhotoCameraIcon sx={{ fontSize: "10vw" }} />
            </IconButton>
          </label>
          {t?.fields?.avatar}
        </CustomBox>
        <CustomBox
          sx={{
            bgcolor: theme.palette.background.default,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "1vw",
          }}
        >
          <TextField
            required
            id="firstName"
            label={t?.fields?.firstName}
            variant="standard"
            sx={{ width: "100%" }}
            value={memberState?.firstName}
            onChange={handleChange}
            error={errorState.firstName}
          />
          <TextField
            required
            id="lastName"
            label={t?.fields?.lastName}
            variant="standard"
            sx={{ width: "100%" }}
            value={memberState?.lastName}
            onChange={handleChange}
            error={errorState.lastName}
          />
          <CustomFormattedTextField
            id="phoneNumber"
            label={t?.fields?.phoneNumber}
            value={memberState?.phoneNumber}
            sx={{ width: "100%" }}
            onChange={(e) => {
              setMemberState({ ...memberState, phoneNumber: e });
            }}
          />
          <TextField
            required
            id="email"
            error={errorState.email}
            label={t?.fields?.email}
            variant="standard"
            sx={{ width: "100%" }}
            value={memberState?.email}
            onChange={handleChange}
          />
          <CustomSelect
            id="gender"
            label={t?.fields?.gender}
            variant="standard"
            value={memberState?.gender}
            onChange={(e) => {
              setMemberState({ ...memberState, gender: e.target.value });
            }}
            sx={{ width: "100%" }}
            options={["MALE", "FEMALE"]}
            hasBlank={true}
          />
          <TextField
            id="address"
            label={t?.fields?.address}
            variant="standard"
            sx={{ width: "100%" }}
            value={memberState?.address}
            onChange={handleChange}
          />
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={localStorage.getItem("appLocale") || "en"}
          >
            <DatePicker
              label={t?.fields?.birthDate}
              value={memberState?.birthDate}
              format="dd/MM/yyyy"
              disableFuture
              slotProps={{ textField: { variant: "standard" } }}
              onChange={(e) => {
                setMemberState({ ...memberState, birthDate: e });
              }}
            />
          </LocalizationProvider>

          <div style={{ gridColumn: "1 / span 2", justifySelf: "end" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <CustomIconButton
                disabled={!Object.values(changesMade).some((value) => value)}
                title={t?.buttons?.btnClear}
                leftIcon={<BackspaceRoundedIcon />}
                onClick={handleClear}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                {t?.buttons?.btnSave}
              </Button>
            </Box>
          </div>
        </CustomBox>
      </Box>
    </CustomBox>
  );
};

export default withTranslations(AddMembers);

const initialMemberState = {
  avatar: null,
  firstName: "",
  lastName: "",
  gender: "",
  address: "",
  phoneNumber: "",
  email: "",
  birthDate: null,
};
const initialChangesMade = {
  avatar: false,
  firstName: false,
  lastName: false,
  phoneNumber: false,
  email: false,
  address: false,
  gender: false,
  birthDate: false,
  username: false,
};
const initialErrorState = {
  firstName: false,
  lastName: false,
  email: false,
};
