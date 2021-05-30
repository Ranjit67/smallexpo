import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert, Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Layout } from "../../components";
import { auth, database } from "../../config";
import { useLeadpageData } from "../../hooks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "10vh",
    marginBottom: "10vh",
    borderRadius: "10px",
    boxShadow: "1px 1px 15px #00000047",
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    padding: "5vh 0",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  label: {
    marginBottom: "10px",
  },
}));

const Register = () => {
  const classes = useStyles();
  const { leadPageData } = useLeadpageData();
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [gender, setGender] = useState(`Male`);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [phoneValid, setPhoneValid] = useState("");
  const [passwordValid, setPasswordValid] = useState("");
  const [rePasswordValid, setRePasswordValid] = useState("");
  const [showPassword, setShowPassword] = useState({
    password: false,
    rePassword: false,
  });
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "success",
  });
  function password_validate(p) {
    return (
      /[A-Z]/.test(p) &&
      /[0-9]/.test(p) &&
      /[a-z]/.test(p) &&
      /[~!@#$^&*]/.test(p) &&
      /^[A-Za-z0-9~!@#$^&*]{8,14}$/.test(p)
    );
  }
  const handleSumbit = async (e) => {
    e.preventDefault();
    const passw = password_validate(password);

    if (
      password === rePassword &&
      phone.length < 18 &&
      phone.length > 7 &&
      passw
    ) {
      try {
        setOpen(true);
        const res = await auth.createUserWithEmailAndPassword(email, password);
        await res.user.updateProfile({
          displayName: name,
          phoneNumber: phone,
        });
        await database.ref(`Users/${res.user.uid}/`).set({
          name,
          email,
          phone,
          gender,
          password,
          isOnline: true,
        });
        const To = email,
          Body = `
      <h3>Dear  ${name},</h3>

      Thank you for Subscribing to us.

      <p>Welcome to Exposium, an All-in-one Virtual Event Platform. Thank you for showing interest & taking one step forward towards becoming our partner & agent in your area. You are going to be a part of the really awesome platform that will benefit you in every way possible.</p>

      <p>We have received your request & forwarded your details to the team to process further. Our team will soon get you back & share with you to proceed.⁣⁣⁣</p>

      <p>At Exposium, it's our prior duty to solve all your queries and offer you the best of experience. We are available online at www.exposium.live, WhatsApp/call at +91-9668-677-932, mail at hostanevent@exposium.live, or through our social media platforms:<p>

     
        <br />

        https://www.linkedin.com/company/exposiumsy/⁣⁣⁣ </p>

        https://www.facebook.com/exposiumsy⁣⁣⁣ <br />

        <h4>Become a part of the Exposium and let's grow together.⁣ </h4>



        Team Exposium⁣⁣⁣⁣⁣⁣⁣⁣⁣⁣


      `,
          Subject = "Welcome to UAE Education Interface",
          Password = "noreply@2021";
        // eslint-disable-next-line no-undef
        sendEmail(To, Body, Subject, Password);

        await history.push("/");
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      } finally {
        setPassword("");
        setRePassword("");
        setOpen(false);
      }
    } else {
      setShowAlert({
        msg: "Please Remove All the Warning",
        isOpen: true,
        color: "warning",
      });
      setPassword("");
      setRePassword("");
    }
  };
  useEffect(() => {
    const icon = new Image();
    icon.onload = function () {
      if (this.width > 600) setWidth(10);
      else setWidth(20);
    };
    icon.src = leadPageData?.logo;
  }, [leadPageData?.logo]);
  return (
    <Layout>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
      >
        <Alert
          onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          severity={showAlert?.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>
      <Container maxWidth="md" className={classes.paper}>
        <div className={classes.icon}>
          {leadPageData?.logo ? (
            <img
              src={leadPageData?.logo}
              alt="EXPOSIUM"
              style={{ width: `${width}%` }}
            />
          ) : (
            <Skeleton variant="rect" width="20vw" height="13vh" />
          )}
        </div>

        <div style={{ margin: "5vh" }}>
          <form autoComplete="off" onSubmit={handleSumbit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <InputLabel htmlFor="name" className={classes.label}>
                  <b>Enter Your Full name</b>
                </InputLabel>
                <TextField
                  required
                  id="name"
                  variant="outlined"
                  fullWidth
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="Email" className={classes.label}>
                  <b>Enter Your Email Address</b>
                </InputLabel>
                <TextField
                  required
                  id="email"
                  placeholder="Email"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputLabel htmlFor="phone" className={classes.label}>
                  <b> Enter Your Phone Number</b>
                </InputLabel>
                <PhoneInput
                  country={"in"}
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(num) => {
                    setPhone(num);
                    if (num.length < 7) {
                      setPhoneValid("Enter a Valid Phone Number");
                    } else {
                      setPhoneValid("");
                    }
                  }}
                  inputStyle={{
                    padding: "3.5vh 6vh",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "15px",
                  }}
                  countryCodeEditable={false}
                />
                <label
                  style={{ color: "red", fontSize: "15px", margin: "4px" }}
                >
                  <b>{phoneValid}</b>
                </label>
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputLabel htmlFor="gender" className={classes.label}>
                  <b> Enter Your Gender</b>
                </InputLabel>
                <TextField
                  id="gender"
                  select
                  placeholder="Phone"
                  variant="outlined"
                  fullWidth
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value={`Male`}>Male</MenuItem>
                  <MenuItem value={`Female`}>Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputLabel htmlFor="password" className={classes.label}>
                  <b>Enter Your Password</b>
                </InputLabel>
                <OutlinedInput
                  required
                  placeholder="Password"
                  id="password"
                  fullWidth
                  type={showPassword.password ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    const passw = password_validate(e.target.value);

                    if (!passw) {
                      setPasswordValid(
                        "Password Must Have a Uppercase,LowerCase,8-14 character and a Special Character "
                      );
                    } else {
                      setPasswordValid("");
                    }
                  }}
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
                <label
                  style={{ color: "red", fontSize: "15px", margin: "4px" }}
                >
                  <b>{passwordValid}</b>
                </label>
              </Grid>
              <Grid item sm={6} xs={12}>
                <InputLabel htmlFor="repassword" className={classes.label}>
                  <b>Enter Your Same Password Again</b>
                </InputLabel>
                <OutlinedInput
                  required
                  placeholder="Re-Password"
                  id="repassword"
                  fullWidth
                  type={showPassword.rePassword ? "text" : "password"}
                  value={rePassword}
                  onChange={(e) => {
                    setRePassword(e.target.value);
                    if (!(password === e.target.value)) {
                      setRePasswordValid(
                        "Password and Re-Password Must be same"
                      );
                    } else {
                      setRePasswordValid("");
                    }
                  }}
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
                <label
                  style={{ color: "red", fontSize: "15px", margin: "4px" }}
                >
                  <b>{rePasswordValid}</b>
                </label>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" color="primary" type="submit">
                    Register
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

export default Register;
