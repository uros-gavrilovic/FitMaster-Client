import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { validateField } from "../../../utils/utilFunctions";
import { Button, DialogActions, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MemberChooserModal from "../workout-plans/MemberChooserModal";
import withTranslations from "../../../utils/HighOrderComponent";
import { useEffect } from "react";
import { ListItemAvatar } from "@mui/material";
import { Avatar } from "@mui/material";
import { IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { DateTimePicker } from "@mui/x-date-pickers";
import SaveIcon from "@mui/icons-material/Save";
import { ListSubheader } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { useIsMount } from "../../../utils/customHooks/useIsMount";
import { Chip } from "@mui/material";
import * as plansActions from "../../../actions/plans";
import { useDispatch } from "react-redux";
import { createNotification } from "../../../utils/notificationService";
import { notificationType } from "../../../constants/globals";
import ExerciseChooserModal from "./ExerciseChooserModal";
import CloseIcon from "@mui/icons-material/Close";

const CustomEditor = (props) => {
  const { scheduler, t } = props || {};

  const event = scheduler.edited;
  const isMount = useIsMount();
  const dispatch = useDispatch();

  const { plan, loading } = useSelector(
    (eventState) => eventState.plansReducer
  );
  const { user } = useSelector((state) => state.userReducer);
  useEffect(() => {
    // After clicking on an event, fetchByID is triggered, and it's now set as eventState
    setEventState((prev) => {
      return {
        ...prev,
        member: plan.member,
        activities: plan.activities,
        comment: plan.comment ? plan.comment : "",
      };
    });
  }, [plan]);

  const [eventState, setEventState] = useState({
    event_id: event ? event.event_id : "",
    title: event ? event.title : "",
    member: event ? { firstName: "", lastName: "", memberID: "" } : {},
    trainer: event.trainer || user, // Optimize this
    activities: event ? event.activities : [],
    comment: event ? (event.comment !== null ? event.comment : "") : "", // Optimize this
    start: event ? event.start : "",
    end: event ? event.end : "",
  });
  const [modalVisible, setModalVisible] = useState({
    member: false, // MemberChooserModal
    exercise: false, // ExerciseChooserModal
  });
  const [selectedMember, setSelectedMember] = useState(eventState.member); // Member selected by MemberChooserModal
  const [errorState, setErrorState] = useState(initialErrorState);

  useEffect(() => {
    // After selecting a member using MemberChooserModal, set the selected member to eventState
    if (!isMount) {
      setEventState((prev) => {
        return {
          ...prev,
          member: selectedMember,
        };
      });
    }
  }, [selectedMember]);

  const handleChange = (event) => {
    setEventState((prev) => {
      return {
        ...prev,
        [event.target.id]: event.target.value,
      };
    });
  };
  const handleRemoveActivity = (activityIndex) => {
    const updatedActivities = eventState.activities.filter(
      (activity) => activity.activityID !== activityIndex
    );

    setEventState((prev) => ({
      ...prev,
      activities: updatedActivities,
    }));
  };
  const handleSubmit = async () => {
    const fieldsToValidate = ["title", "member", "start", "end", "activities"];
    const hasErrors = fieldsToValidate.some((field) =>
      validateField(eventState[field], field, setErrorState)
    );

    if (eventState.start > eventState.end) {
      createNotification(
        notificationType.error,
        t?.messages?.title,
        t?.errors?.end_date_before_start_date
      );
      return;
    }

    if (!hasErrors) {
      await dispatch(plansActions.updatePlan(eventState, t?.messages));
      try {
        scheduler.loading(true);
        // Check if scheduler.eventState is defined before accessing its properties
        if (
          scheduler.eventState &&
          scheduler.eventState.start &&
          scheduler.eventState.end
        ) {
          const added_updated_event = new Promise((res) => {
            setTimeout(() => {
              res({
                event_id: event ? event.event_id : Math.random(),
                title: eventState.title,
                start: scheduler.eventState.start.value,
                end: scheduler.eventState.end.value,
                comment: eventState.comment,
              });
            }, 500);
          });

          scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
          scheduler.close();
        }
      } finally {
        scheduler.loading(false);
      }
    }
  };

  return (
    <Fragment>
      <MemberChooserModal
        open={modalVisible.member}
        setOpen={(isOpen) =>
          setModalVisible((prev) => ({
            ...prev,
            member: isOpen,
          }))
        }
        setMember={setSelectedMember}
      />
      <ExerciseChooserModal
        open={modalVisible.exercise}
        setOpen={(isOpen) =>
          setModalVisible((prev) => ({
            ...prev,
            exercise: isOpen,
          }))
        }
        activities={eventState.activities}
        setActivities={(newActivities) => {
          setEventState((prev) => ({
            ...prev,
            activities: newActivities,
          }));
        }}
        t={t}
      />

      <Box
        sx={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1vh",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <TextField
            required
            id="title"
            sx={{ width: "70%" }}
            label={t?.fields?.title}
            value={eventState.title}
            onChange={handleChange}
            error={errorState.title}
          />
          <TextField
            readOnly
            id="planID"
            sx={{ width: "30%" }}
            label={t?.fields?.plan_ID}
            value={`# ${eventState.event_id}`}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            required
            readOnly
            id="member"
            sx={{ width: "70%" }}
            label={t?.fields?.member}
            value={`${eventState.member.firstName} ${eventState.member.lastName} (#${eventState.member.memberID})`}
            error={errorState.member}
          />
          <Button
            variant="contained"
            endIcon={<PersonSearchIcon />}
            onClick={() =>
              setModalVisible((prev) => ({
                ...prev,
                member: true,
              }))
            }
            sx={{ width: "30%" }}
          >
            {t?.buttons?.change_member}
          </Button>
        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              // required
              disablePast
              label={t?.fields?.starts_at}
              viewRenderers={noTime}
              value={eventState.start}
              onChange={(date) => {
                setEventState((prev) => ({
                  ...prev,
                  start: date,
                }));
              }}
              error={errorState.start}
            />
            <DateTimePicker
              // required
              disablePast
              label={t?.fields?.ends_at}
              viewRenderers={noTime}
              value={eventState.end}
              onChange={(date) => {
                setEventState((prev) => ({
                  ...prev,
                  end: date,
                }));
              }}
              error={errorState.end}
            />
          </LocalizationProvider>
        </Box>
        <TextField
          readOnly
          id="comment"
          multiline={true}
          rows={5}
          label={t?.fields?.comment}
          value={eventState.comment}
          onChange={handleChange}
        />
        <List
          subheader={
            <ListSubheader component="div">{`${t?.fields?.activities} *`}</ListSubheader>
          }
        >
          {eventState.activities?.length > 0 &&
            eventState.activities?.map((activity) => (
              <ListItem
                key={activity.activityID}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveActivity(activity.activityID)}
                  >
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FitnessCenterIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.exercise.name}
                  secondary={`${activity.sets} ${t?.fields?.sets} x ${activity.reps} ${t?.fields?.reps}`}
                />
              </ListItem>
            ))}
          {errorState.activities && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Chip
                label={t?.errors?.no_activities}
                color="error"
                variant="outlined"
              />
            </Box>
          )}
        </List>
        <Button
          endIcon={
            eventState.activities?.length > 0 ? (
              <EditCalendarIcon />
            ) : (
              <PostAddIcon />
            )
          }
          onClick={() =>
            setModalVisible((prev) => ({
              ...prev,
              exercise: true,
            }))
          }
        >
          {eventState.activities?.length > 0
            ? t?.buttons?.edit_activities
            : t?.buttons?.add_activities}
        </Button>
      </Box>
      <DialogActions>
        <Button endIcon={<CloseIcon />} onClick={scheduler.close}>
          {t?.buttons?.exit}
        </Button>
        <Button
          variant="contained"
          endIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          {t?.buttons?.confirm}
        </Button>
      </DialogActions>
    </Fragment>
  );
};

export default withTranslations(CustomEditor);

const initialErrorState = {
  title: false,
  member: false,
  start: false,
  end: false,
  activities: false,
};

const noTime = {
  hours: null,
  minutes: null,
  seconds: null,
};
