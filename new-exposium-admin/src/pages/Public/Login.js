import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Container,
  CssBaseline,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { database, useAuth } from "../../config";
import { Layout } from "../../components";
import { Skeleton } from "@material-ui/lab";
import { useLeadpageData } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    padding: "12px",
    boxShadow: "1px 1px 10px #0000002b",
    borderRadius: "4px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: "10px",
    marginTop: "2vh",
  },
}));

const Login = () => {
  const classes = useStyles();
  const { login } = useAuth();
  const { leadPageData } = useLeadpageData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const history = useHistory();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      await database.ref(`Users/${res?.user?.uid}/EnterPassword`).set(password);

      history.push("/");
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setEmail("");
      setPassword("");
    }
  };
  return (
    <Layout>
      <Container maxWidth="xs">
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
        <CssBaseline />
        <div className={classes.paper}>
          <form className={classes.form} onSubmit={handelSubmit}>
            <div className={classes.icon}>
              {leadPageData?.logo ? (
                <img
                  src={leadPageData?.logo}
                  alt="EXPOSIUM"
                  style={{ width: "50%" }}
                />
              ) : (
                <Skeleton variant="rect" width="20vw" height="13vh" />
              )}
            </div>
            <Typography component="h1" variant="h5" align="center">
              Sign in
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>

            <Button component={Link} to="/ForgetPassword">
              Forgot password?
            </Button>
          </form>
        </div>
      </Container>
    </Layout>
  );
};

export default Login;
