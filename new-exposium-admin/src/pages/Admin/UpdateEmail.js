import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import { LockOutlined, Update } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import { auth, database } from "../../config";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const UpdateEmail = () => {
  const classes = useStyles();

  const [newEmail, setNewEmail] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      await auth?.currentUser?.updateEmail(newEmail);
      await database.ref(`Users/${auth?.currentUser?.uid}/email`).set(newEmail);
      setShowAlert({
        msg: "Email Updated",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setNewEmail("");
      setOpenBackDrop(false);
    }
  };
  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Your Email
          </Typography>
          <form className={classes.form} onSubmit={handelSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Enter Your New Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              endIcon={<Update />}
            >
              Update Your Email
            </Button>
          </form>
        </div>
      </Container>
    </Navigation>
  );
};

export default UpdateEmail;
