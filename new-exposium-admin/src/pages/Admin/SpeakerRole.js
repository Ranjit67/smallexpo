import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Build, Save, Visibility, VisibilityOff } from "@material-ui/icons";
import { Autocomplete, Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useAllUsersData } from "../../hooks";

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
  formControl: {
    minWidth: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const SpeakerRole = () => {
  const classes = useStyles();
  const { allUsersData } = useAllUsersData();
  const history = useHistory();
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("");

  const [speakerEmail, setSpeakerEmail] = useState("");
  const [toAssign, setToAssign] = useState(true);
  const [alertButton, setAlertButton] = useState(true);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [password, setPassword] = useState("");
  const [speakerData, setSpeakerData] = useState({});
  const [addSpeaker, setAddSpeaker] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  const [roles] = useState(["speaker", "Remove Role"]);

  const handleUserData = (e, value) => {
    setUid(value?.id);
    setSpeakerData(value);
    if (!value?.role) {
      setToAssign(false);
    } else {
      setShowAlert({
        msg: "This User already has a Role Please Click The Button To Override The Role ",
        isOpen: true,
        color: "error",
      });
      setAlertButton(false);
    }
    if (!value) {
      setToAssign(true);
      setAlertButton(true);
      setUid("");
      setRole("");
    }
    if (value?.role === "superadmin") {
      setShowAlert({
        msg: "You Can not Assign Role to This User ",
        isOpen: true,
        color: "error",
      });
      setToAssign(true);
      setAlertButton(true);
      setUid("");
      setRole("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      if (role === "Remove Role") {
        await database.ref(`Users/${uid}/role`).remove();
        if (speakerData?.role === "speaker") {
          await database.ref(`Users/${uid}/stallID`).remove();
          await database.ref(`Speaker/${uid}`).remove();
        }
        setShowAlert({
          msg: "Successfully Removed Role",
          isOpen: true,
          color: "success",
        });
      } else {
        await database.ref(`Users/${uid}/role`).set(role);
        await database.ref(`Speaker/${uid}/speaker`).set(uid);

        setShowAlert({
          msg: "Successfully Added",
          isOpen: true,
          color: "success",
        });
      }
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setUid("");
      setRole("");
      setToAssign(true);
      setOpenBackDrop(false);
      setSpeakerData({});
    }
  };
  const handleAddStallDirectly = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      await fetch(`https://exposiam-modify-api.herokuapp.com/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: speakerEmail,
          password: password,
          role: "speaker",
        }),
      });

      setShowAlert({
        msg: "Speaker Added Successfully",
        isOpen: true,
        color: "success",
      });
      history.push("/ManageSpeakerRole");
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);

      setPassword("");
      setSpeakerEmail("");
    }
  };

  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "2vh",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddSpeaker(!addSpeaker)}
        >
          {addSpeaker
            ? "Add/Remove Speaker from register user"
            : "Add Speaker Directly"}
        </Button>
      </div>
      <Container component="main" maxWidth="sm">
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
              severity={showAlert?.color}
            >
              {showAlert.msg}
            </Alert>
          </Snackbar>
          <CardContent>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <Build />
              </Avatar>
              <Typography component="h1" variant="h5">
                Manage Role
              </Typography>
              {addSpeaker ? (
                <form
                  className={classes.form}
                  onSubmit={handleAddStallDirectly}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        id="speakerEmail"
                        label="Enter speaker Email"
                        name="speakerEmail"
                        value={speakerEmail}
                        onChange={(e) => setSpeakerEmail(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <OutlinedInput
                        required
                        placeholder="Speaker Password *"
                        id="password"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    startIcon={<Save />}
                  >
                    {" "}
                    Add Speaker
                  </Button>
                </form>
              ) : (
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {allUsersData && (
                        <Autocomplete
                          id="selectuser"
                          required
                          options={allUsersData}
                          getOptionLabel={(option) => option?.email}
                          onChange={(e, value) => handleUserData(e, value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select User"
                              margin="normal"
                              variant="outlined"
                              autoFocus
                            />
                          )}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl className={classes.formControl}>
                        <InputLabel
                          id="select-label"
                          style={{ marginLeft: "10px" }}
                        >
                          Select Role
                        </InputLabel>
                        <Select
                          variant="outlined"
                          required
                          labelId="type"
                          id="select-label"
                          label="Role"
                          fullWidth
                          disabled={toAssign}
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <MenuItem>None</MenuItem>
                          {roles.map((item, i) => {
                            return (
                              <MenuItem key={i} value={item}>
                                {item.toUpperCase()}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={toAssign}
                    className={classes.submit}
                    startIcon={<Save />}
                  >
                    {role === "Remove Role" ? "Remove Role" : "Set Role"}
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="secondary"
          style={{ display: alertButton ? "none" : "block" }}
          onClick={() => {
            setToAssign(false);
            setAlertButton(true);
          }}
        >
          Override Role
        </Button>
      </div>
    </Navigation>
  );
};

export default SpeakerRole;
