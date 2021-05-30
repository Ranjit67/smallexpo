import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  makeStyles,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { PersonAdd, Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert, Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useHistory } from "react-router";

import { Navigation } from "../../components";
import { auth, database } from "../../config";
import { useAllUsersData } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.action.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
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

const AddSpeakerMember = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const history = useHistory();
  const { allUsersData } = useAllUsersData();
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });

  const [memberEmail, setMemberEmail] = useState("");
  const [memeberData, setMemeberData] = useState({});
  const [disableBtn, setdisableBtn] = useState(true);
  const [alertButton, setAlertButton] = useState(true);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [speakerMember, setSpeakerMember] = useState(true);
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handlePhone = (e) => setMemberEmail(e.target.value);

  const handleAllData = (e, value) => {
    setMemeberData(value);
    if (!value?.role) {
      setdisableBtn(false);
    } else {
      setShowAlert({
        msg: "This User already has a Role Please Click The Button To Override The Role ",
        isOpen: true,
        color: "error",
      });
      setAlertButton(false);
    }
    if (!value) {
      setdisableBtn(true);
      setAlertButton(true);
      setMemeberData();
    }
    if (
      value?.role === "superadmin" ||
      value?.role === "helpdesk" ||
      value?.role === "EventManager"
    ) {
      setShowAlert({
        msg: "You Can not Assign Role to this User ",
        isOpen: true,
        color: "error",
      });
      setdisableBtn(true);
      setAlertButton(true);
      setMemeberData();
    }
  };
  const handleAddmember = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);

      await database.ref(`Users/${memeberData.id}/role`).set("SpeakerMember");
      await database.ref(`Users/${memeberData.id}/speakerID`).set(uid);

      setShowAlert({
        msg: " Successfully Added Your Team Member",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setMemeberData({});
      setOpenBackDrop(false);
    }
  };
  const handleAddMemberDirectly = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      await fetch(`https://exposiam-modify-api.herokuapp.com/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: memberEmail,
          password: password,
          role: "SpeakerMember",
          speakerID: uid,
        }),
      });

      setShowAlert({
        msg: "Member Added Successfully",
        isOpen: true,
        color: "success",
      });
      history.push("/AddSpeakerMember");
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);

      setPassword("");
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
          onClick={() => setSpeakerMember(!speakerMember)}
        >
          {speakerMember
            ? "Add Member from register user"
            : "Add Member Directly"}
        </Button>
      </div>
      <Container component="main" maxWidth="sm">
        <Card>
          <CardContent>
            <Snackbar
              open={showAlert.isOpen}
              autoHideDuration={6000}
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "info" })
              }
            >
              <Alert
                onClose={() =>
                  setShowAlert({ msg: "", isOpen: false, color: "info" })
                }
                severity={showAlert.color}
              >
                {showAlert.msg}
              </Alert>
            </Snackbar>

            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <PersonAdd />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add Your Team Member
              </Typography>
              {speakerMember ? (
                <form
                  className={classes.form}
                  onSubmit={handleAddMemberDirectly}
                >
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="Email"
                    label="Email"
                    type="email"
                    id="Email"
                    value={memberEmail}
                    onChange={handlePhone}
                  />
                  <OutlinedInput
                    required
                    placeholder="Password"
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    endIcon={<PersonAdd />}
                  >
                    Add Team Member
                  </Button>
                </form>
              ) : (
                <form className={classes.form} onSubmit={handleAddmember}>
                  {
                    // totalUser
                    allUsersData && (
                      <Autocomplete
                        id="selectuser"
                        options={allUsersData}
                        getOptionLabel={(option) => option.email}
                        onChange={(e, value) => handleAllData(e, value)}
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
                    )
                  }

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={disableBtn}
                    className={classes.submit}
                    endIcon={<PersonAdd />}
                  >
                    Add Team Member
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
            setdisableBtn(false);
            setAlertButton(true);
          }}
        >
          Override Role
        </Button>
      </div>
    </Navigation>
  );
};

export default AddSpeakerMember;
