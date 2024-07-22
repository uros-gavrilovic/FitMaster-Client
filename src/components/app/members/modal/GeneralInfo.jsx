import { useState, useEffect, Fragment } from "react";
import { Box, Button, TextField } from "@mui/material";
import CustomSelect from "../../../reusable/inputFields/CustomSelect";
import BorderedSection from "../../../reusable/containers/BorderedSection";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmModal from "../../../reusable/modals/ConfirmModal";
import { validateField } from "../../../../utils/utilFunctions";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import * as membersActions from "../../../../actions/members";
import { useSelector } from "react-redux";

export default function GeneralInfo(props) {
  const { dispatch, t } = props || {};

  const { member } = useSelector((state) => state.membersReducer);

  const [editEnabled, setEditEnabled] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errorState, setErrorState] = useState(initialErrorState);
  const [newMemberState, setNewMemberState] = useState(member);

  useEffect(() => {
    setNewMemberState(member);
  }, [member]);

  const handleChange = (e) => {
    if (!editEnabled) return;

    setNewMemberState({
      ...newMemberState,
      [e.target.id]: e.target.value !== "" ? e.target.value : null,
    });
  };
  const handleToggleEdit = (e, param) => {
    setEditEnabled((prevEditEnabled) =>
      param !== undefined ? param : !prevEditEnabled
    );
    setNewMemberState(member); // if edit is disabled, revert changes
  };
  const handleSave = () => {
    const fieldsToValidate = ["firstName", "lastName"];
    const hasErrors = fieldsToValidate.some((field) =>
      validateField(newMemberState[field], field, setErrorState)
    );

    if (!hasErrors) {
      dispatch(membersActions.updateMember(newMemberState));
    }
  };
  const handleDelete = () => {
    dispatch(membersActions.deleteMember(member.memberID));
  };

  return (
    <BorderedSection icon={InfoIcon} title={t?.tabs?.general_info}>
      <ConfirmModal
        title="Delete Member"
        text="Are you sure you want to delete this member?"
        yes_action={handleDelete}
        no_action={() => {
          setConfirmModalVisible(false);
        }}
        open={confirmModalVisible}
        setOpen={setConfirmModalVisible}
      />

      <Box sx={{ padding: "1vw" }}>
        <TextField
          readOnly
          id="memberID"
          label={t?.fields?.member_ID}
          variant="filled"
          sx={{ width: "25ch" }}
          value={`# ${newMemberState?.memberID}`}
          onChange={handleChange}
        />
        <TextField
          required
          id="firstName"
          label={t?.fields?.first_name}
          variant="filled"
          sx={{ width: "25ch" }}
          error={errorState.firstName}
          value={newMemberState?.firstName}
          onChange={handleChange}
        />
        <TextField
          required
          id="lastName"
          label={t?.fields?.last_name}
          variant="filled"
          sx={{ width: "25ch" }}
          error={errorState.lastName}
          value={newMemberState?.lastName}
          onChange={handleChange}
        />
        <CustomSelect
          id="gender"
          label={t?.fields?.gender}
          variant="filled"
          value={newMemberState?.gender}
          hasBlank={true}
          sx={{ width: "25ch" }}
          options={["MALE", "FEMALE"]}
          onChange={handleChange}
        />
        <TextField
          id="address"
          label={t?.fields?.address}
          variant="filled"
          sx={{ width: "25ch" }}
          value={newMemberState?.address}
          onChange={handleChange}
        />
        <TextField
          id="phoneNumber"
          label={t?.fields?.phone_number}
          variant="filled"
          sx={{ width: "25ch" }}
          value={newMemberState?.phoneNumber}
          onChange={handleChange}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            disableFuture
            label={t?.fields?.birth_date}
            variant="filled"
            value={new Date(newMemberState?.birthDate)}
            onAccept={(e) => {
              setNewMemberState({
                ...newMemberState,
                birthDate: e,
              });
            }}
          />
        </LocalizationProvider>
      </Box>

      <Box sx={{ float: "right" }}>
        {editEnabled ? (
          <Fragment>
            <Button
              variant="outlined"
              endIcon={<CancelIcon />}
              onClick={handleToggleEdit}
            >
              {t?.buttons?.cancel}
            </Button>
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              onClick={handleSave}
            >
              {t?.buttons?.save}
            </Button>
          </Fragment>
        ) : (
          <Button
            variant="contained"
            endIcon={<EditIcon />}
            onClick={handleToggleEdit}
          >
            {t?.buttons?.edit}
          </Button>
        )}
        <Button
          variant="contained"
          endIcon={<DeleteIcon />}
          onClick={() => {
            setConfirmModalVisible(true);
          }}
        >
          {t?.buttons?.delete}
        </Button>
      </Box>
    </BorderedSection>
  );
}

const initialErrorState = {
  firstName: false,
  lastName: false,
  email: false,
};
