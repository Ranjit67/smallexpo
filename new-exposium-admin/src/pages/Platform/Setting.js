import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Snackbar,
  Switch,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Layout } from "../../components";
import { auth, database } from "../../config";
import { useCurrentUser } from "../../hooks";
const useStyles = makeStyles((theme) => ({
  paper: {
    border: "2px solid grey",

    marginBottom: "2vh",
    borderRadius: "10px",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Setting = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [videoChecker, setVideoChecker] = useState(true);
  const [notificationChecker, setNotificationChecker] = useState(true);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    rePassword: false,
  });
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });
  const handleSumbit = async (e) => {
    e.preventDefault();
    if (password.length > 6) {
      if (password === rePassword) {
        try {
          setOpen(true);
          await auth.currentUser.updatePassword(password);
          await database
            .ref(`Users/${auth?.currentUser?.uid}/password`)
            .set(password);

          history.push("/");
        } catch (error) {
          setShowAlert({ msg: error.message, isOpen: true, color: "error" });
        } finally {
          setPassword("");
          setRePassword("");
          setOpen(false);
        }
      } else {
        setShowAlert({
          msg: "Both Password and Re-Password must be same ",
          isOpen: true,
          color: "warning",
        });
        setPassword("");
        setRePassword("");
      }
    } else {
      setShowAlert({
        msg: "Password length must be greter than 6",
        isOpen: true,
        color: "warning",
      });
      setPassword("");
      setRePassword("");
    }
  };
  useEffect(() => {
    database
      .ref(`Users/${auth?.currentUser?.uid}/videocallRequest`)
      .on(`value`, (snap) => {
        snap.exists() && setVideoChecker(snap.val());
      });
    database
      .ref(`Users/${auth?.currentUser?.uid}/isEnableNotofication`)
      .on(`value`, (snap) => {
        snap.exists() && setNotificationChecker(snap.val());
      });
  }, []);
  const handleVideoCallRequest = async () => {
    setVideoChecker(!videoChecker);
    await database
      .ref(`Users/${auth?.currentUser?.uid}/videocallRequest`)
      .set(!videoChecker);
  };
  const handleEnableNotification = async () => {
    setNotificationChecker(!notificationChecker);
    await database
      .ref(`Users/${auth?.currentUser?.uid}/isEnableNotofication`)
      .set(!notificationChecker);
  };

  return (
    <Layout>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "info" })}
      >
        <Alert
          onClose={() =>
            setShowAlert({ msg: "", isOpen: false, color: "info" })
          }
          severity={showAlert?.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>
      <Container
        maxWidth="sm"
        className={classes.paper}
        style={{ marginTop: "10vh" }}
      >
        <div>
          <Grid container spacing={1} style={{ margin: "3vh 0" }}>
            {(currentUserData?.role === "stall" ||
              currentUserData?.role === "StallMember") && (
              <Grid container item xs={12}>
                <Grid item xs={8}>
                  <Typography>Turn Off Your Video Call Request</Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={videoChecker}
                        onChange={handleVideoCallRequest}
                      />
                    }
                    label="On"
                  />
                </Grid>
              </Grid>
            )}
            <Grid container item xs={12}>
              <Grid item xs={8}>
                <Typography>Turn Off Your Notification</Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationChecker}
                      onChange={handleEnableNotification}
                    />
                  }
                  label="On"
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Container>
      <Container maxWidth="sm" className={classes.paper}>
        <div style={{ margin: "5vh" }}>
          <form autoComplete="off" onSubmit={handleSumbit}>
            <Grid container spacing={4}>
              <Grid item sm={12} xs={12}>
                <InputLabel htmlFor="password">
                  <b>Enter Your Password</b>
                </InputLabel>
                <OutlinedInput
                  required
                  placeholder="Password"
                  id="password"
                  fullWidth
                  type={showPassword.password ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            password: !showPassword.password,
                          })
                        }
                        edge="end"
                      >
                        {showPassword.password ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <InputLabel htmlFor="repassword">
                  <b>Enter Your Same Password Again</b>
                </InputLabel>
                <OutlinedInput
                  required
                  placeholder="Re-Password"
                  id="repassword"
                  fullWidth
                  type={showPassword.rePassword ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword({
                            ...showPassword,
                            rePassword: !showPassword.rePassword,
                          })
                        }
                        edge="end"
                      >
                        {showPassword.rePassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" color="primary" type="submit">
                    Updated Password
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Setting;
