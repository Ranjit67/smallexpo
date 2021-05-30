import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  makeStyles,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Cancel, Telegram } from "@material-ui/icons";
import moment from "moment";
import React, { useState } from "react";
import { auth, database, useAuth } from "../config";
const useStyles = makeStyles(() => ({
  labelMargin: {
    marginBottom: "10px",
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogAppointment = ({
  openAppointment,
  setOpenAppointment,
  stallID,
}) => {
  const { sendNotification } = useAuth();
  const classes = useStyles();
  const [name, setName] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleAppointment = () => setOpenAppointment(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const notification = {
        body: "New Appointment",
        title: `${name}${" "}Request for an Appointment`,
        sound: "default",
        timestamp: new Date().toLocaleString(),
      };
      await database.ref(`Users/${stallID}/fcmToken`).on("value", (snap) => {
        if (snap.exists()) {
          const token = snap.val();
          sendNotification(notification, token);
        }
      });
      await database.ref(`Notifications/${stallID}/`).push(notification);
      await database.ref(`Users/${stallID}/Appointment`).push({
        email: auth?.currentUser?.email,
        name,
        subject,
        message,
        date,
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setName("");

      setSubject("");
      setMessage("");
      setDate(moment().format("YYYY-MM-DD"));
      handleAppointment();
    }
  };

  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={openAppointment}
        onClose={handleAppointment}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle style={{ minWidth: "40vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">Appointment</Typography>
            <IconButton onClick={handleAppointment}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputLabel htmlFor="Email" className={classes.labelMargin}>
                  <b>Enter Your Email Address</b>
                </InputLabel>
                <TextField
                  required
                  id="email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={auth?.currentUser?.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="Email" className={classes.labelMargin}>
                  <b>Enter Your Name</b>
                </InputLabel>
                <TextField
                  required
                  id="name"
                  placeholder="Name"
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="Subject" className={classes.labelMargin}>
                  <b>Enter Your Subject</b>
                </InputLabel>
                <TextField
                  required
                  id="Subject"
                  placeholder="Subject"
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="Message" className={classes.labelMargin}>
                  <b>Enter Your Message</b>
                </InputLabel>
                <TextField
                  required
                  multiline
                  rows={3}
                  id="Message"
                  placeholder="Message"
                  variant="outlined"
                  fullWidth
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel htmlFor="date" className={classes.labelMargin}>
                  <b>Appointment Date</b>
                </InputLabel>
                <TextField
                  required
                  id="date"
                  placeholder="date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    endIcon={<Telegram />}
                    style={{ margin: "5px 50px 0 50px" }}
                  >
                    Send Request
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogAppointment;
