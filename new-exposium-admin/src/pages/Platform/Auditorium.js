import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Loading } from "../../components";
import Aud from "../../assets/Auditorium.png";
import MOB from "../../assets/Auditoriummobile.png";
import { useAllUsersData, useWindow } from "../../hooks";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  Cancel,
  ChevronLeft,
  ChevronRight,
  MeetingRoom,
} from "@material-ui/icons";
import Carousel, { consts } from "react-elastic-carousel";
const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    padding: "10px",

    border: "1px solid red",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },

  avatar: {
    backgroundColor: "red",
  },
  readmore: {
    color: "blue",
    backgroundColor: "#FFF",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#FFF",
      color: "darkblue",
    },
  },
}));
const breakPoint = [
  { width: 100, itemsToShow: 1 },
  { width: 300, itemsToShow: 1 },
  { width: 420, itemsToShow: 1 },
  { width: 500, itemsToShow: 1 },
  { width: 768, itemsToShow: 1 },
  { width: 900, itemsToShow: 2 },
  { width: 1010, itemsToShow: 2 },
  { width: 1020, itemsToShow: 2 },
  { width: 1500, itemsToShow: 2 },
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Auditorium = () => {
  const MAX_LENGTH = 65;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { allUsersData } = useAllUsersData();
  const { windowSize } = useWindow();
  const [speakerData, setSpeakerData] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  // const { allEvents } = useViewEvents();
  useEffect(() => {
    const arr = allUsersData.filter((item) => item?.role === "speaker");
    setSpeakerData(arr);
  }, [allUsersData]);

  const classes = useStyles();
  const handleClose = () => setOpen(false);

  return (
    <Layout>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle style={{ minWidth: "40vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">Agenda</Typography>
            <IconButton onClick={handleClose}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>{data}</DialogContent>
      </Dialog>
      {windowSize.width > 650 ? (
        <div style={{ height: "90vh" }}>
          <img src={Aud} alt="auditorium" width="100%" height="103%" />
          <div
            style={{
              height: "60vh",
              width: "80%",
              position: "absolute",
              top: "30%",
              left: "10%",
              right: "10%",
              backgroundColor: "white",
            }}
          >
            <div style={{ width: "100%", height: "90%", marginTop: "12px" }}>
              <Carousel
                breakPoints={breakPoint}
                pagination={false}
                renderArrow={({ type, onClick, isEdge }) => {
                  const pointer =
                    type === consts.PREV ? (
                      <ChevronLeft
                        style={{
                          fontSize: 40,
                          color: "red",
                          display: isEdge ? "none" : "",
                        }}
                      />
                    ) : (
                      <ChevronRight
                        style={{
                          fontSize: 40,
                          color: "red",
                          display: isEdge ? "none" : "",
                        }}
                      />
                    );
                  return (
                    <Button
                      disableRipple
                      color="primary"
                      onClick={onClick}
                      style={{ height: "100%", background: "none" }}
                    >
                      {pointer}
                    </Button>
                  );
                }}
              >
                {speakerData.length ? (
                  speakerData.map((item, i) => {
                    const test = item?.agenda || "Not Provided";
                    return (
                      item?.title &&
                      item?.eventImg &&
                      item?.eventStartTime &&
                      item?.eventEndTime &&
                      item?.eventDate &&
                      item?.agenda && (
                        <Card className={classes.root}>
                          <CardHeader
                            avatar={
                              <Avatar
                                aria-label="recipe"
                                className={classes.avatar}
                              >
                                S
                              </Avatar>
                            }
                            title={item?.title}
                            subheader={`${item?.eventStartTime}${" "} - ${" "}${
                              item?.eventEndTime
                            },${" "}${item?.eventDate}`}
                          />
                          <CardMedia
                            className={classes.media}
                            image={item?.eventImg}
                            title="Paella dish"
                          />
                          <CardContent>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="p"
                            >
                              {test?.length > MAX_LENGTH ? (
                                <div>
                                  {`${test?.substring(0, MAX_LENGTH)} . . .`}
                                  <Button
                                    style={{}}
                                    onClick={() => {
                                      setOpen(true);
                                      setData(test);
                                    }}
                                    className={classes.readmore}
                                  >
                                    Read more
                                  </Button>
                                </div>
                              ) : (
                                <p>{test}</p>
                              )}
                            </Typography>
                          </CardContent>
                          <CardActions disableSpacing>
                            <Button
                              variant="contained"
                              startIcon={<MeetingRoom />}
                              color="secondary"
                              component={Link}
                              to={`/AuditoriumRoom/${item?.id}`}
                            >
                              {" "}
                              Join
                            </Button>
                          </CardActions>
                        </Card>
                      )
                    );
                  })
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Loading />
                  </div>
                )}
              </Carousel>

              {/* <Grid item lg={4} md={4}>
                  <div
                    style={{
                      height: "20vh",
                      backgroundColor: "beige",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      borderTop: "15px solid grey",
                    }}
                  >
                    <Typography variant="h6" style={{ margin: "10px" }}>
                      Room 2
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<MeetingRoom />}
                      color="secondary"
                      component={Link}
                      to={`/AuditoriumRoom/${2}`}
                    >
                      {" "}
                      Room 2
                    </Button>
                  </div>
                </Grid>
                <Grid item lg={4} md={4}>
                  <div
                    style={{
                      height: "20vh",
                      backgroundColor: "beige",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      borderTop: "15px solid grey",
                    }}
                  >
                    <Typography variant="h6" style={{ margin: "10px" }}>
                      Room 3
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<MeetingRoom />}
                      color="secondary"
                      component={Link}
                      to={`/AuditoriumRoom/${3}`}
                    >
                      {" "}
                      Room 3
                    </Button>
                  </div>
                </Grid> */}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: "90vh" }}>
          <img src={MOB} alt="Auditorium" width="100%" height="103%" />
          <div
            style={{
              height: "50vh",
              minWidth: "80%",
              position: "absolute",
              top: "30%",
              left: "10%",
              backgroundColor: "white",
              overflowY: "scroll",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid grey",
                width: "95%",
                padding: "4px",
              }}
            >
              {speakerData.length ? (
                speakerData.map((item, i) => (
                  <div
                    style={{
                      height: "20vh",
                      width: "95%",
                      backgroundColor: "beige",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      borderTop: "15px solid grey",
                      marginBottom: "10px",
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          style={{
                            height: "50px",
                            width: "50px",
                          }}
                          alt=""
                          src=""
                        />
                      }
                      title={item?.title}
                      subheader={item?.name}
                    />
                    {/* <Typography variant="h6" style={{ margin: "10px" }}>
                      Room 1
                    </Typography> */}
                    <Button
                      variant="contained"
                      startIcon={<MeetingRoom />}
                      color="secondary"
                      component={Link}
                      to={`/AuditoriumRoom/${1}`}
                    >
                      {" "}
                      Join
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Loading />
                </div>
              )}

              {/* <div
                style={{
                  height: "20vh",
                  width: "95%",
                  backgroundColor: "beige",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  borderTop: "15px solid grey",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h6" style={{ margin: "10px" }}>
                  Room 2
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<MeetingRoom />}
                  color="secondary"
                  component={Link}
                  to={`/AuditoriumRoom/${1}`}
                >
                  {" "}
                  Room 2
                </Button>
              </div>
              <div
                style={{
                  height: "20vh",
                  width: "95%",
                  backgroundColor: "beige",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  borderTop: "15px solid grey",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="h6" style={{ margin: "10px" }}>
                  Room 3
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<MeetingRoom />}
                  color="secondary"
                  component={Link}
                  to={`/AuditoriumRoom/${1}`}
                >
                  {" "}
                  Room 3
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      )}
      <div>
        {/* This div |v| */}
        {/* <div
                        style={{
                          height: "20vh",
                          backgroundColor: "beige",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          borderTop: "15px solid grey",
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar
                              style={{
                                height: "50px",
                                width: "50px",
                              }}
                              alt=""
                              src=""
                            />
                          }
                          title={item?.title}
                          subheader={item?.name}
                        />
                        <Typography variant="h6" style={{ margin: "10px" }}>
                          {item?.agenda}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<MeetingRoom />}
                          color="secondary"
                          component={Link}
                          to={`/AuditoriumRoom/${item?.id}`}
                        >
                          {" "}
                          Join
                        </Button>
                      </div> */}
      </div>
    </Layout>
  );
};

export default Auditorium;
