import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Facebook, LinkedIn, Twitter, Update } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Layout, ProfilePicChange } from "../../components";
import { auth, database } from "../../config";
import { useCountry, useCurrentUser } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "5vh",
    marginBottom: "5vh",
  },
  large: {
    width: "150px",
    height: "150px",

    marginBottom: "20px",
  },
  wrapIcon: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "10px",
  },
  linkHeader: {
    marginLeft: "10px",
    fontWeight: "200px",
  },
  imgCard: {
    marginBottom: "10px",
    height: "39vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  linkCard: {
    marginTop: "10px",
    height: "50vh",
    width: "100%",
  },
  formCard: {
    height: "90vh",
    width: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "#d1af4f",
    boxShadow: theme.shadows[5],
    fontSize: 14,
  },
}))(Tooltip);

const EditProfile = () => {
  const classes = useStyles();

  const { currentUserData } = useCurrentUser();
  const { countries } = useCountry();
  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(`Male`);
  const [country, setCountry] = useState(`United Arab Emirates`);
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState(`Student`);
  const [joinEvent, setJoinEvent] = useState(`Yes`);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [openPic, setOpenPic] = useState(false);

  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "success",
  });
  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      await auth?.currentUser.updateProfile({
        displayName: name,
        phoneNumber: phone,
      });
      name &&
        (await database.ref(`Users/${auth.currentUser.uid}/name`).set(name));

      phone &&
        (await database.ref(`Users/${auth.currentUser.uid}/ phone`).set(phone));
      gender &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/gender`)
          .set(gender));
      country &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/country`)
          .set(country));
      address &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/address`)
          .set(address));
      profession &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/profession`)
          .set(profession));
      joinEvent &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/joinEvent`)
          .set(joinEvent));
      facebookUrl &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/facebookUrl`)
          .set(facebookUrl));
      twitterUrl &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/twitterUrl`)
          .set(twitterUrl));
      linkedinUrl &&
        (await database
          .ref(`Users/${auth.currentUser.uid}/linkedinUrl`)
          .set(linkedinUrl));

      setShowAlert({
        msg: "Profile Updated Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpen(false);
    }
  };

  useEffect(() => {
    currentUserData?.name && setName(currentUserData?.name);
    currentUserData?.phone && setPhone(currentUserData?.phone);
    currentUserData?.gender && setGender(currentUserData?.gender);

    currentUserData?.country && setCountry(currentUserData?.country);
    currentUserData?.address && setAddress(currentUserData?.address);
    currentUserData?.profession && setProfession(currentUserData?.profession);
    currentUserData?.joinEvent && setJoinEvent(currentUserData?.joinEvent);

    currentUserData?.facebookUrl &&
      setFacebookUrl(currentUserData?.facebookUrl);
    currentUserData?.twitterUrl && setTwitterUrl(currentUserData?.twitterUrl);
    currentUserData?.linkedinUrl &&
      setLinkedinUrl(currentUserData?.linkedinUrl);
  }, [currentUserData]);
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
      <ProfilePicChange openPic={openPic} setOpenPic={setOpenPic} />

      <Container maxWidth="md" className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item sm={5} xs={12}>
            <div>
              <Card className={classes.imgCard}>
                <CardContent>
                  <Avatar
                    alt={currentUserData?.name}
                    src={
                      currentUserData?.ProfilePic ||
                      "https://cdn1.iconfinder.com/data/icons/people-cultures/512/_saudi_arabian_man-512.png"
                    }
                    className={classes.large}
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#2778c4c9",
                      color: "whitesmoke",
                    }}
                    onClick={() => setOpenPic(true)}
                  >
                    <Typography variant="subtitle2">Change Picture</Typography>
                  </Button>
                </CardContent>
              </Card>
              <Card className={classes.linkCard}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <label className={classes.wrapIcon}>
                        <Facebook color="primary" fontSize="large" />
                        <h3 className={classes.linkHeader}>
                          <b>FaceBook</b>
                        </h3>
                      </label>
                      <LightTooltip
                        title="Please Enter The URL Starting with https://"
                        placement="top-start"
                      >
                        <TextField
                          variant="outlined"
                          fullWidth
                          placeholder="FaceBook"
                          type="text"
                          value={facebookUrl}
                          onChange={(e) => setFacebookUrl(e.target.value)}
                        />
                      </LightTooltip>
                    </Grid>
                    <Grid item xs={12}>
                      <label className={classes.wrapIcon}>
                        <Twitter color="primary" fontSize="large" />
                        <h3 className={classes.linkHeader}>
                          <b>Twitter</b>
                        </h3>
                      </label>
                      <LightTooltip
                        title="Please Enter The URL Starting with https://"
                        placement="top-start"
                      >
                        <TextField
                          variant="outlined"
                          fullWidth
                          placeholder="Twitter"
                          type="text"
                          value={twitterUrl}
                          onChange={(e) => setTwitterUrl(e.target.value)}
                        />
                      </LightTooltip>
                    </Grid>
                    <Grid item xs={12}>
                      <label className={classes.wrapIcon}>
                        <LinkedIn color="primary" fontSize="large" />
                        <h3 className={classes.linkHeader}>
                          <b>Linkedin</b>
                        </h3>
                      </label>
                      <LightTooltip
                        title="Please Enter The URL Starting with https://"
                        placement="top-start"
                      >
                        <TextField
                          variant="outlined"
                          fullWidth
                          placeholder="Linkedin"
                          type="text"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                      </LightTooltip>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </Grid>
          <Grid item sm={7} xs={12}>
            <Card className={classes.formCard}>
              <CardContent>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Email</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Email"
                      value={auth?.currentUser?.email}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Full Name</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="FullName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Phone</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Phone Number"
                      type="tel"
                      value={phone}
                      setPhone={(e) => setPhone}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Gender</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Gender"
                      select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value={`Male`}>Male</MenuItem>
                      <MenuItem value={`Female`}>Female</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Country</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Country"
                      select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {countries.length &&
                        countries.map((item) => (
                          <MenuItem value={item?.label} key={item?.value}>
                            {item?.label}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Address</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant="standard"
                      fullWidth
                      placeholder="Address"
                      type="text"
                      multiline
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item sm={6} xs={8}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Your Profession</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item sm={6} xs={4}>
                    <TextField
                      variant="standard"
                      fullWidth
                      select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                    >
                      <MenuItem value={`Student`}>Student</MenuItem>
                      <MenuItem value={`Businessman`}>Businessman</MenuItem>
                      <MenuItem value={`Doctor`}>Doctor</MenuItem>
                      <MenuItem value={`Engineer`}>Engineer</MenuItem>
                      <MenuItem value={`Other`}>Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item sm={6} xs={8}>
                    <label style={{ fontWeight: "200px" }}>
                      <Typography variant="h6" style={{ fontWeight: "200px" }}>
                        <b>Have You Ever Attend a Virtual Event</b>
                      </Typography>
                    </label>
                  </Grid>
                  <Grid item sm={6} xs={4}>
                    <TextField
                      variant="standard"
                      fullWidth
                      select
                      value={joinEvent}
                      onChange={(e) => setJoinEvent(e.target.value)}
                    >
                      <MenuItem value={`Yes`}>Yes</MenuItem>
                      <MenuItem value={`No`}>No</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<Update />}
                        onClick={handleSumbit}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProfile;
