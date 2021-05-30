import {
  Avatar,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Edit, Facebook, LinkedIn, Twitter } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components";
import { useCurrentUser, useWindow } from "../../hooks";
const useStyles = makeStyles({
  paper: {
    marginTop: "5vh",
    marginBottom: "5vh",
  },

  large: {
    width: "150px",
    height: "150px",
    border: "2px solid grey",
  },
  fontCSS: {
    fontWeight: "250px",
    fontSize: "23px",
  },
  subFontCSS: {
    color: "#b3b3b3",
  },
});

const ViewProfile = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const { windowSize } = useWindow();
  return (
    <Layout>
      <Container maxWidth="md" className={classes.paper}>
        <Card>
          <CardContent>
            <Grid container spacing="2">
              <Grid item sm={5} xs={12}>
                <div
                  style={{
                    width: "100%",
                    height: "85vh",
                    // background:
                    //   "linear-gradient(90deg, rgba(238,105,86,1) 26%, rgba(245,127,32,1) 59%, rgba(252,176,69,1) 86%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    backgroundImage:
                      "linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "50vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={currentUserData?.name}
                      src={
                        currentUserData?.ProfilePic ||
                        "https://cdn1.iconfinder.com/data/icons/people-cultures/512/_saudi_arabian_man-512.png"
                      }
                      className={classes.large}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#fafafa",
                      }}
                    >
                      <Typography variant="h5">
                        {currentUserData?.name || "Not Provided"}
                      </Typography>
                      <Typography variant="subtitle1">
                        {currentUserData?.desination || currentUserData?.email}
                      </Typography>
                    </div>
                    <IconButton component={Link} to="/EditProfile">
                      <Edit style={{ color: "#000000d1" }} />
                    </IconButton>
                  </div>
                </div>
              </Grid>
              <Grid item sm={7} xs={12}>
                <div
                  style={{
                    width: "90%",
                    height: windowSize?.width > 960 ? " 75vh" : "100vh",
                    margin: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        paddingBottom: "20px ",
                        borderBottom: "4px solid grey",
                      }}
                    >
                      <h2 className={classes.fontCSS}>Details</h2>
                    </div>
                    <Grid container spacing={4} style={{ margin: "20px 0" }}>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Email</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.email}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Name</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.name}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Phone</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.phone}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Country</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.country}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Gender</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.gender}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Profession</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.profession}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Address</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.address}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div>
                          <h3 className={classes.fontCSS}>
                            <b>Have You Ever Attend a Virtual Event</b>
                          </h3>
                          <Typography
                            variant="h6"
                            className={classes.subFontCSS}
                          >
                            {currentUserData?.joinEvent}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div
                  // style={{ marginTop: "20px", borderTop: "4px solid grey" }}
                  >
                    <IconButton
                      href={
                        currentUserData?.facebookUrl || "https://facebook.com"
                      }
                      target="_blank"
                    >
                      <Facebook fontSize="large" color="primary" />
                    </IconButton>
                    <IconButton
                      href={
                        currentUserData?.twitterUrl || "https://twitter.com/"
                      }
                      target="_blank"
                    >
                      <Twitter fontSize="large" color="primary" />
                    </IconButton>
                    <IconButton
                      href={
                        currentUserData?.linkedinUrl ||
                        "https://www.linkedin.com/"
                      }
                      target="_blank"
                    >
                      <LinkedIn fontSize="large" color="primary" />
                    </IconButton>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default ViewProfile;
