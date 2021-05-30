import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Add, Close, CloudUpload } from "@material-ui/icons";
import React, { useState } from "react";

import Alert from "@material-ui/lab/Alert";
import { database, storage } from "../../config";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(8),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
const placeholderImg =
  "https://firebasestorage.googleapis.com/v0/b/exposium-2021.appspot.com/o/placeholder.png?alt=media&token=5a768d5f-f0ad-49aa-88fe-58f80360b15e";

const AddLogo = () => {
  const classes = useStyles();
  const [logourl, setLogourl] = useState("");
  const [logo, setLogo] = useState({});
  const [logoTitle, setLogoTitle] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleLogo = (e) => {
    setLogourl(URL.createObjectURL(e.target.files[0]));
    setLogo(e.target.files[0]);
  };
  const handleTitle = (e) => setLogoTitle(e.target.value);

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      const storageRef = `ParticipantsLogo/${Math.floor(Math.random() * 100)}`;
      const res = logo && (await storage.ref(storageRef).put(logo));
      const logoUrl = logo ? await res.ref.getDownloadURL() : placeholderImg;

      await database.ref(`Helpdesk/PartcipantsLogo/`).push({
        logoTitle,
        logoUrl,
        storageRef,
      });
      setShowAlert({
        msg: "Logo Added Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setLogoTitle("");
      setLogourl("");
      setLogo({});
      setOpen(false);
      setOpenBackDrop(false);
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
            <Typography variant="h6">Uplaod Participants Logo</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="inherit" />
          </Backdrop>

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
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleLogoSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="title"
                    name="title"
                    variant="outlined"
                    required
                    fullWidth
                    id="title"
                    label="Company Name"
                    autoFocus
                    type="text"
                    value={logoTitle}
                    onChange={handleTitle}
                  />
                </Grid>
                <Grid item xs={12}>
                  {logourl && (
                    <iframe
                      title={logoTitle}
                      width="100%"
                      height="100%"
                      style={{ minHeight: "30vh" }}
                      src={logourl}
                      frameBorder="0"
                      allowFullScreen
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    startIcon={<CloudUpload />}
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    Upload Logo
                    <input type="file" onChange={handleLogo} hidden />
                  </Button>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                startIcon={<CloudUpload />}
              >
                Uplaod
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Navigation>
  );
};

export default AddLogo;
