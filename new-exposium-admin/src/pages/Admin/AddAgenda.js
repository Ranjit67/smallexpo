import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { AddCircleOutline, CloudUpload } from "@material-ui/icons";
import React, { useState } from "react";

import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import { DropzoneArea } from "material-ui-dropzone";
import { database, storage } from "../../config";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const placeholderImg =
  "https://firebasestorage.googleapis.com/v0/b/exposium-2021.appspot.com/o/placeholder.png?alt=media&token=5a768d5f-f0ad-49aa-88fe-58f80360b15e";

const AddAgenda = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(moment().format("hh:mm"));
  const [endTime, setEndTime] = useState(moment().format("hh:mm"));
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [description, setDescription] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerPhoto, setSpeakerPhoto] = useState({});
  const [zoomLink, setZoomLink] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handleTitle = (e) => setTitle(e.target.value);

  const addSpeakerPhoto = (file) => {
    if (file) {
      const size = Math.round(file.size / 1024);
      if (size > 60) {
        alert(
          `Sorry, you have chosen wrong image size. Kindly choose an image of size lesser 60KB for uploading. The preview shown is not uploaded to the database due to wrong size.`
        );
      } else {
        setSpeakerPhoto(file);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      const storageRef = `Agenda/SpeakerPhoto/${Math.floor(
        Math.random() * 100
      )}`;
      const res =
        speakerPhoto?.name && (await storage.ref(storageRef).put(speakerPhoto));
      const speakerPhotoUrl = speakerPhoto?.name
        ? await res.ref.getDownloadURL()
        : placeholderImg;
      const Agenda = {
        startTime,
        endTime,
        date,
        title,
        description,
        speakerName,
        zoomLink,
        speakerPhotoUrl,
        storageRef,
      };
      await database.ref(`Helpdesk/Agenda`).push(Agenda);
      setShowAlert({
        msg: "Agenda Added Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setStartTime(moment().format("hh:mm"));
      setEndTime(moment().format("hh:mm"));
      setDate(moment().format("YYYY-MM-DD"));
      setTitle("");
      setDescription("");
      setSpeakerName("");
      setSpeakerPhoto({});
      setZoomLink("");
      setOpenBackDrop(false);
    }
  };

  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card>
        <Snackbar
          open={showAlert.isOpen}
          autoHideDuration={6000}
          onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
        >
          <Alert
            onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
            severity={showAlert.color}
          >
            {showAlert.msg}
          </Alert>
        </Snackbar>
        <CardContent>
          <Container
            component="main"
            maxWidth="md"
            style={{ border: "2px solid grey" }}
          >
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <CloudUpload />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add Agenda
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Speaker name"
                      autoFocus
                      type="text"
                      value={speakerName}
                      onChange={(e) => setSpeakerName(e.target.value)}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Agenda Title"
                      autoFocus
                      type="text"
                      value={title}
                      onChange={handleTitle}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      label="Event Date"
                      helperText="Click on The Calender Icon To Set Date!"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      type="Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Zoom Link"
                      autoFocus
                      type="text"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      label="Event Start Time"
                      helperText="Click on The Clock Icon To Set Time !"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <TextField
                      variant="outlined"
                      label="Event End Time"
                      helperText="Click on The Clock Icon To Set  Time !"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      label="Agenda Description"
                      autoFocus
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DropzoneArea
                      filesLimit={1}
                      dropzoneText={`Upload Speaker Image`}
                      value={speakerPhoto}
                      onChange={(flie) => addSpeakerPhoto(flie[0])}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  endIcon={<AddCircleOutline />}
                >
                  Add Agenda
                </Button>
              </form>
            </div>
          </Container>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default AddAgenda;
