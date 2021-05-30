import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { Add, Close, Save } from "@material-ui/icons";
import { useCurrentUser } from "../../hooks";
import { database } from "../../config";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(0),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.action.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textField: {
    margin: "20px",
  },
  card: {
    minWidth: "80vw",
    minHeight: "85vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  absolute: {
    position: "fixed",
    bottom: "2vh",
    right: theme.spacing(3),
  },
}));
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "#d1af4f",
    boxShadow: theme.shadows[5],
    fontSize: 14,
  },
}))(Tooltip);

const AddVideo = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const [videoLink, setVideoLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handleVideoLink = (e) => setVideoLink(e.target.value);
  const handleVideoTitle = (e) => setVideoTitle(e.target.value);
  const handleClose = () => setOpen(false);

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      await database.ref(`Users/${currentUserData?.stallID}/Video`).push({
        videoTitle,
        videoLink,
      });

      setShowAlert({
        msg: "Video Added Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setVideoTitle("");
      setVideoLink("");
      setOpenBackDrop(false);
      setOpen(false);
    }
  };
  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Tooltip title="edit">
        <Fab
          variant="round"
          color="primary"
          className={classes.absolute}
          onClick={handleClickOpen}
        >
          <Add />
        </Fab>
      </Tooltip>

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

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        classes={{
          paper: classes.dialog,
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Add Your Video</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleUploadVideo}>
              <TextField
                type="text"
                variant="outlined"
                fullWidth
                id="videoTitle"
                label="Video Title"
                name="videoTitle"
                autoComplete="videotitle"
                autoFocus
                className={classes.textField}
                value={videoTitle}
                onChange={handleVideoTitle}
              />
              <LightTooltip
                title="Please Copy The URL from YouTube Share Option "
                placement="top-start"
              >
                <TextField
                  type="url"
                  variant="outlined"
                  fullWidth
                  required
                  id="videolink"
                  label="Video Link"
                  name="videolink"
                  autoComplete="videolink"
                  autoFocus
                  className={classes.textField}
                  value={videoLink}
                  onChange={handleVideoLink}
                />
              </LightTooltip>
              {videoLink && (
                <iframe
                  title={new Date().getTime()}
                  width="100%"
                  height="100%"
                  style={{ minHeight: "35vh" }}
                  src={
                    "https://www.youtube.com/embed/" +
                    videoLink?.split("/").reverse()[0]
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  className={classes.submit}
                  startIcon={<Save />}
                >
                  Upload Video
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Navigation>
  );
};

export default AddVideo;
