import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  CssBaseline,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { Navigation } from "../../components";
import { auth, database } from "../../config";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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

const PasswordSetting = () => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
      if (password.length > 6) {
        if (password === newPassword) {
          await auth?.currentUser?.updatePassword(password);
          await database
            .ref(`Users/${auth?.currentUser?.uid}/password`)
            .set(password);
        } else {
          setShowAlert({
            msg: "Both Password Must Be Same",
            isOpen: true,
            color: "error",
          });
        }
      } else {
        setShowAlert({
          msg: "Both Password Length Must Be Grater than 6",
          isOpen: true,
          color: "error",
        });
      }
      setShowAlert({
        msg: "Both Password Length Must Be Grater than 6",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setPassword("");
      setNewPassword("");
      setOpenBackDrop(false);
    }
  };
  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="xs">
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
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockOutlined />
              </Avatar>
              <Typography variant="subtitle2">Reset Your Password</Typography>
              <Typography variant="subtitle1">Update Your Password</Typography>
              <form className={classes.form} onSubmit={handelSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="Newpassword"
                  label="New Password"
                  type="password"
                  autoComplete="current-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Update Password
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default PasswordSetting;
