import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Card,
  CardContent,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { Call, HeadsetMic, Send } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { auth, database } from "../../config";
import { useAllUsersData } from "../../hooks";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
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

const Support = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const { allUsersData } = useAllUsersData();
  const [currentUserData, setCurrentUserData] = useState({});
  const [text, setText] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  useEffect(() => {
    const user = allUsersData.filter((item) => item?.id === uid);
    setCurrentUserData(user[0]);
  }, [allUsersData, uid]);
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      database.ref(`Support/${currentUserData?.role}/${uid}`).push({
        message: text,
      });
      setShowAlert({
        msg: "Message sent Sucessfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setText("");
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
          <CardContent>
            <Snackbar
              open={showAlert.isOpen}
              autoHideDuration={6000}
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "" })
              }
            >
              <Alert
                onClose={() =>
                  setShowAlert({ msg: "", isOpen: false, color: "" })
                }
                severity={showAlert?.color}
              >
                {showAlert.msg}
              </Alert>
            </Snackbar>
            <CssBaseline />
            <div className={classes.paper}>
              <HeadsetMic color="primary" style={{ fontSize: 40 }} />

              <div style={{ textAlign: "center" }}>
                <h3>Our Support Team is Here To Help You</h3>
                <p>
                  If Your are Facing any trouble please contact to our support
                  team immidately.Our tem will be always to help you
                </p>
              </div>
              <form className={classes.form} onSubmit={handelSubmit}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: "green", color: "white" }}
                  className={classes.submit}
                >
                  <Call />
                  Call
                </Button>
                <Typography
                  component="h1"
                  variant="h5"
                  style={{ textAlign: "center" }}
                >
                  OR
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="textarea"
                  label="Write Message"
                  name="textarea"
                  autoComplete="textarea"
                  autoFocus
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                >
                  Message
                  <Send />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default Support;
