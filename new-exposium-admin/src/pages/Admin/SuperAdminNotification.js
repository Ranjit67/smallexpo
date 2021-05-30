import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  InputLabel,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Notifications, Telegram } from "@material-ui/icons";
import { Alert, Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useAllUsersData, useWindow } from "../../hooks";
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  label: {
    marginBottom: "10px",
  },
}));
const SuperAdminNotification = () => {
  const classes = useStyles();
  const { allUsersData } = useAllUsersData();
  const { windowSize } = useWindow();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [selectedUser, setSelectedUser] = useState(true);
  const [alluser, setAlluser] = useState(false);
  const [allExhibitors, setAllExhibitors] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });
  const handleSubmit = async (e) => {
    try {
      setOpen(true);
      await database.ref(`Notification/${uid}`).push({
        title,
        body,
        timestamp: new Date().getTime(),
      });

      setShowAlert({
        msg: "Successfully Sent Notification",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpen(false);

      setTitle("");
      setBody("");
      setUid("");
    }
  };
  const handleAllusers = async (e) => {
    try {
      setOpen(true);
      const arr = allUsersData.filter((item) => !item?.hasOwnProperty("role"));
      arr.forEach(async (item) => {
        await database.ref(`Notification/${item?.id}`).push({
          title,
          body,
          timestamp: new Date().getTime(),
        });
      });

      setShowAlert({
        msg: "Successfully Sent Notification",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpen(false);
    }
  };
  const handleAllExhibitors = async (e) => {
    try {
      setOpen(true);
      const arr = allUsersData.filter((item) => item?.hasOwnProperty("role"));
      arr.forEach(async (item) => {
        await database.ref(`Notification/${item?.id}`).push({
          title,
          body,
          timestamp: new Date().getTime(),
        });
      });

      setShowAlert({
        msg: "Successfully Sent Notification",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Navigation>
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
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <Notifications />
              </Avatar>
              <Typography component="h1" variant="h5">
                Send Notification
              </Typography>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "2vh 0",
                  flexDirection: windowSize.width > 600 ? "row" : "column",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ opacity: selectedUser ? 1 : 0.2 }}
                  onClick={() => {
                    setSelectedUser(true);
                    setAlluser(false);
                    setAllExhibitors(false);
                  }}
                >
                  <Typography variant="subtitle1">Selected User</Typography>
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    opacity: alluser ? 1 : 0.2,
                  }}
                  onClick={() => {
                    setSelectedUser(false);
                    setAlluser(true);
                    setAllExhibitors(false);
                  }}
                >
                  <Typography variant="subtitle1">All Users</Typography>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ opacity: allExhibitors ? 1 : 0.2 }}
                  onClick={() => {
                    setSelectedUser(false);
                    setAlluser(false);
                    setAllExhibitors(true);
                  }}
                >
                  <Typography variant="subtitle1"> All Exhibitors</Typography>
                </Button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (selectedUser) handleSubmit();
                  if (allExhibitors) handleAllExhibitors();
                  if (alluser) handleAllusers();
                }}
                className={classes.form}
              >
                <Grid container spacing={2}>
                  {selectedUser && (
                    <Grid item xs={12}>
                      <InputLabel htmlFor="selectuser">
                        <b>Select User</b>
                      </InputLabel>
                      {allUsersData && (
                        <Autocomplete
                          id="selectuser"
                          required
                          options={allUsersData}
                          getOptionLabel={(option) => option?.email}
                          onChange={(e, value) => setUid(value?.id)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select User"
                              margin="normal"
                              variant="outlined"
                              autoFocus
                            />
                          )}
                        />
                      )}
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <InputLabel htmlFor="name" className={classes.label}>
                      <b>Enter Notification Title</b>
                    </InputLabel>
                    <TextField
                      autoComplete="title"
                      name="title"
                      variant="outlined"
                      required
                      fullWidth
                      id="title"
                      placeholder="Title"
                      autoFocus
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel htmlFor="name" className={classes.label}>
                      <b>Enter Notification Body</b>
                    </InputLabel>
                    <TextField
                      multiline
                      rows={3}
                      autoComplete="Body"
                      name="Body"
                      variant="outlined"
                      required
                      fullWidth
                      id="Body"
                      placeholder="Notification Body"
                      autoFocus
                      type="text"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Telegram />}
                        type="submit"
                      >
                        <Typography variant="subtitle1">Send</Typography>
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default SuperAdminNotification;
