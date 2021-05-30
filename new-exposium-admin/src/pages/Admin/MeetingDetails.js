import { useEffect, useState } from "react";
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
import { auth, database, storage } from "../../config";
import { Navigation } from "../../components";
import { useCurrentUser } from "../../hooks";
import { DropzoneArea } from "material-ui-dropzone";

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

const MeetingDetails = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const uid = auth?.currentUser?.uid;

  const [eventDate, setEventDate] = useState(moment().format("YYYY-MM-DD"));
  const [eventTime, setEventTime] = useState(moment().format("hh:mm"));
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [eventEndTime, setEventEndTime] = useState(moment().format("hh:mm"));
  const [videoUrl, setVideoUrl] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [picFile, setPicFile] = useState({});
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  useEffect(() => {
    currentUserData?.title && setTitle(currentUserData?.title);
    currentUserData?.eventDate && setEventDate(currentUserData?.eventDate);
    currentUserData?.eventStartTime &&
      setEventTime(currentUserData?.eventStartTime);
    currentUserData?.eventEndTime &&
      setEventEndTime(currentUserData?.eventEndTime);
    currentUserData?.videoUrl && setVideoUrl(currentUserData?.videoUrl);
    currentUserData?.agenda && setAgenda(currentUserData?.agenda);
  }, [currentUserData]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      setOpenBackDrop(true);
      const storageRef = `Users/${uid}/EventPhoto`;
      const res = picFile?.name && (await storage.ref(storageRef).put(picFile));
      const ImgUrl = picFile?.name ? await res.ref.getDownloadURL() : "";

      ImgUrl && (await database.ref(`Users/${uid}/eventImg`).set(ImgUrl));

      title && (await database.ref(`Users/${uid}/title`).set(title));
      eventDate &&
        (await database.ref(`Users/${uid}/eventDate`).set(eventDate));
      eventTime &&
        (await database.ref(`Users/${uid}/eventStartTime`).set(eventTime));
      eventEndTime &&
        (await database.ref(`Users/${uid}/eventEndTime`).set(eventEndTime));
      videoUrl && (await database.ref(`Users/${uid}/videoUrl`).set(videoUrl));
      agenda && (await database.ref(`Users/${uid}/agenda`).set(agenda));

      setShowAlert({
        msg: " Event successfully updated.",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
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
                  <label> Event Title</label>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="eventtitle"
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
                  <label>Event Agenda</label>
                  <TextField
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    value={agenda}
                    style={{ margin: "10px 0" }}
                    onChange={(agenda) => {
                      setAgenda(agenda.target.value);
                    }}
                  />
                  <label>Event Video URL</label>
                  <LightTooltip
                    title="Please Copy The URL from YouTube Share Option"
                    placement="top-start"
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="videourl"
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

                  <DropzoneArea
                    filesLimit={1}
                    dropzoneText={`Upload Thumbnail Image`}
                    style={{ margin: "10px 0" }}
                    onChange={(flie) => setPicFile(flie[0])}
                  />
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

export default MeetingDetails;
