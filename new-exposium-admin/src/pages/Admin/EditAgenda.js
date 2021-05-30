import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { CloudUpload, UpdateRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import moment from "moment";
import { useParams } from "react-router";
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
    backgroundColor: theme.palette.action.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const placeholderImg =
  "https://firebasestorage.googleapis.com/v0/b/exposium-2021.appspot.com/o/placeholder.png?alt=media&token=5a768d5f-f0ad-49aa-88fe-58f80360b15e";

const EditAgenda = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(moment().format("hh:mm"));
  const [endTime, setEndTime] = useState(moment().format("hh:mm"));
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [description, setDescription] = useState("");
  const [speakerName, setSpeakerName] = useState("");
  const [speakerPhoto, setSpeakerPhoto] = useState({});
  const [speakerPhotoURL, setSpeakerPhotoURL] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [storageref, setStorageref] = useState("");

  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const { id } = useParams();
  useEffect(() => {
    database.ref(`Helpdesk/Agenda/${id}`).on(`value`, (snap) => {
      if (snap.exists()) {
        snap.val()?.title && setTitle(snap.val()?.title);
        snap.val()?.speakerName && setSpeakerName(snap.val()?.speakerName);
        snap.val()?.date && setDate(snap.val()?.date);
        snap.val()?.zoomLink && setZoomLink(snap.val()?.zoomLink);
        snap.val()?.startTime && setStartTime(snap.val()?.startTime);
        snap.val()?.endTime && setEndTime(snap.val()?.endTime);
        snap.val()?.description && setDescription(snap.val()?.description);
        snap.val()?.speakerPhotoUrl &&
          setSpeakerPhotoURL(snap.val()?.speakerPhotoUrl);
        snap.val()?.ref
          ? setStorageref(snap.val()?.ref)
          : setStorageref(
              `Agenda/SpeakerPhoto/${Math.floor(Math.random() * 100)}`
            );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTitle = (e) => setTitle(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res =
        speakerPhoto?.name && (await storage.ref(storageref).put(speakerPhoto));
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
        storageref,
      };

      await database.ref(`Helpdesk/Agenda/${id}`).set(Agenda);

      setShowAlert({
        msg: "Agenda Updated Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    }
  };
  const addCatalog = (e) => {
    setSpeakerPhotoURL(URL.createObjectURL(e.target.files[0]));
    setSpeakerPhoto(e.target.files[0]);
  };

  return (
    <Navigation>
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
                <UpdateRounded />
              </Avatar>
              <Typography component="h1" variant="h5">
                Update Agenda
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
                    {speakerPhotoURL && (
                      <iframe
                        title={new Date().getTime()}
                        width="100%"
                        height="100%"
                        style={{ minHeight: "35vh" }}
                        src={speakerPhotoURL}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        endIcon={<CloudUpload />}
                        variant="contained"
                        component="label"
                        fullWidth
                        style={{ width: "50%" }}
                      >
                        Upload Spaeker Photo
                        <input type="file" onChange={addCatalog} hidden />
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  endIcon={<UpdateRounded />}
                >
                  Updated Agenda
                </Button>
              </form>
            </div>
          </Container>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default EditAgenda;
