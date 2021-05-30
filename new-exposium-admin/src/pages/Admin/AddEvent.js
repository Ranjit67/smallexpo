import { useState } from "react";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  makeStyles,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import moment from "moment";
import { Add } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { database } from "../../config";
import { Navigation } from "../../components";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "#d1af4f",
    boxShadow: theme.shadows[5],
    fontSize: 14,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const AddEvent = () => {
  const classes = useStyles();

  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState(moment().format("hh:mm"));
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [eventEndTime, setEventEndTime] = useState(moment().format("hh:mm"));
  const [videoUrl, setVideoUrl] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const eventObj = {
      title,
      eventDate: eventDate,
      eventTime: eventTime,
      eventEndTime: eventEndTime,
      videoUrl: videoUrl,
      isOnline: false,
      timestamp: new Date().toLocaleString(),
      agenda,
    };
    try {
      setOpenBackDrop(true);
      await database.ref(`Helpdesk/Events/`).push(eventObj);

      setShowAlert({
        msg: " Event successfully updated.",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setEventDate(moment().format("YYYY-MM-DD"));
      setEventTime(moment().format("hh:mm"));
      setEventEndTime(moment().format("hh:mm"));
      setTitle("");
      setAgenda("");
      setVideoUrl("");
      setOpenBackDrop(false);
    }
  };
  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="md">
        <Card>
          <Snackbar
            open={showAlert.isOpen}
            autoHideDuration={6000}
            onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          >
            <Alert
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "" })
              }
              severity={showAlert.color}
            >
              {showAlert.msg}
            </Alert>
          </Snackbar>
          <CardContent>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                Add Event Details
              </Typography>
              <div className={classes.paper}>
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleOnSubmit}
                >
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="eventtitle"
                    label="Event Title"
                    name="eventtitle"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    value={title}
                    onChange={(name) => {
                      setTitle(name.target.value);
                    }}
                  />
                  <label> Event Date</label>
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    id="date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <label>Event Start Time</label>
                  <TextField
                    variant="outlined"
                    type="time"
                    fullWidth
                    margin="normal"
                    id="date"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                  <label>Event End Time</label>
                  <TextField
                    variant="outlined"
                    type="time"
                    fullWidth
                    margin="normal"
                    id="date"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                  />

                  <TextField
                    variant="outlined"
                    multiline
                    rows={4}
                    label="Event Agenda"
                    fullWidth
                    value={agenda}
                    onChange={(agenda) => {
                      setAgenda(agenda.target.value);
                    }}
                  />
                  <LightTooltip
                    title="Please Copy The URL from YouTube Share Option"
                    placement="top-start"
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="videourl"
                      label="Video URL"
                      name="videourl"
                      type="text"
                      autoComplete="name"
                      autoFocus
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value);
                      }}
                    />
                  </LightTooltip>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      style={{ width: "30%" }}
                      endIcon={<Add />}
                    >
                      Add
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default AddEvent;
