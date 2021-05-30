import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Navigation } from "../../components";
import { useParams } from "react-router";
import { database } from "../../config";

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
}));

const EditEvent = () => {
  const classes = useStyles();
    const { id } = useParams();

  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [agenda, setAgenda] = useState("");
  const [eventEndTime, setEventEndTime] = useState(new Date());
  const [videoUrl, setVideoUrl] = useState("");
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

    useEffect(() => {
      id &&
        database.ref(`Auditorium/Events/${id}`).on(`value`, (snap) => {
          if (snap.exists()) {
            const obj = snap.val();

            setTitle(obj?.title);

            setEventDate(obj?.eventDate);
            setEventTime(obj?.eventTime);
            setEventEndTime(obj?.eventEndTime);
            setAgenda(obj?.agenda);
            setVideoUrl(obj?.videoUrl);
          }
        });
    }, [id]);

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
      //   await database.ref(`Auditorium/Events/${id}`).set(eventObj);
      console.log(eventObj);

      setShowAlert({
        msg: " Event successfully updated.",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    }
  };
  return (
    <Navigation>
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
                    fullWidth
                    margin="normal"
                    id="date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                  <label>Event Start Time</label>
                  <TextField
                    type="time"
                    fullWidth
                    margin="normal"
                    id="date"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />
                  <label>Event End Time</label>
                  <TextField
                    type="time"
                    fullWidth
                    margin="normal"
                    id="date"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                  />
                  <TextField
                    multiline
                    rows={4}
                    label="Event Agenda"
                    fullWidth
                    value={agenda}
                    onChange={(agenda) => {
                      setAgenda(agenda.target.value);
                    }}
                  />
                  <TextField
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Save
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default EditEvent;
