import React, { useEffect, useState, useRef } from "react";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Slide,
  Snackbar,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  Add,
  Cancel,
  Chat,
  ChatBubble,
  LiveHelp,
  QuestionAnswer,
  Send,
} from "@material-ui/icons";
import {
  useAllUsersData,
  useCurrentUser,
  useMyBag,
  useViewEvents,
  useWindow,
} from "../../hooks";
import { AuditoriumPoll, Layout } from "../../components";
import { useParams } from "react-router";
import PropTypes from "prop-types";
import { auth, database } from "../../config";
import moment from "moment";
import { Alert } from "@material-ui/lab";
import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  absolute: {
    position: "fixed",
    bottom: "1vh",
    right: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },

  msgBubble: {
    color: "#fff",
    padding: "15px",
    maxWidth: "450px",
    borderRadius: "15px",
    minWidth: "50%",
    margin: "1vh 1vw",
  },
  msgInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  msgInfoName: {
    marginRight: "10px",
    fontWeight: "bold",
  },
  msgInfoTime: {
    fontSize: "0.85em",
  },
  chatConversation: {
    flex: "1 1",
    overflowY: "auto",
    padding: "10px",
    minHeight: "70vh",
    maxHeight: "73vh",
  },
  notFoundCSS: {
    width: "100%",
    height: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AuditoriumRoom = () => {
  const { currentUserData, currentUserId } = useCurrentUser();
  const { allUsersData } = useAllUsersData();
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { id } = useParams();
  const { bagContacts } = useMyBag();
  const { windowSize } = useWindow();
  const { allEvents } = useViewEvents();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [message, setMessage] = useState("");
  const [event, setEvent] = useState({});
  const [open, setOpen] = useState(false);
  const [chatArr, setChatArr] = useState([]);
  const [speakerMember, setSpeakerMember] = useState([]);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });

  const handleClose = () => setOpen(false);
  useEffect(() => {
    const arr = allEvents.filter((item) => item?.id === id);
    setEvent(arr[0]);
  }, [allEvents, id]);
  const sendChat = async (e) => {
    e.preventDefault();
    if (message) {
      try {
        await database.ref(`Chat/Speaker/${id}`).push({
          payload: message,
          timestamp: new Date().getTime(),
          uid: currentUserId,
          senderName: currentUserData?.name || "Sender",
        });
      } catch (error) {
        console.log(error.message);
      } finally {
        setMessage("");
      }
    }
  };
  useEffect(() => {
    database.ref(`Chat/Speaker/${id}`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj) arr.push({ id: key, ...obj[key] });
        setChatArr(arr);
      }
    });
    return () => {
      setChatArr([]);
    };
  }, [id]);
  useEffect(() => {
    const arr = allUsersData.filter(
      (item) => item?.speakerID === id || item?.id === id
    );
    setSpeakerMember(arr);
  }, [allUsersData, id]);

  const handleAddContact = async (id) => {
    const arr = bagContacts.filter((item) => item?.personID === id);
    if (arr.length) {
      setShowAlert({
        msg: "Already in Your Bag",
        isOpen: true,
        color: "warning",
      });
    } else {
      try {
        await database
          .ref(`Users/${auth?.currentUser?.uid}/MyBag/Contact/`)
          .push({ personID: id });
        setShowAlert({
          msg: "Successfully Added to Bag ",
          isOpen: true,
          color: "success",
        });
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      }
    }
  };
  console.log(currentUserId);

  console.log(currentUserData);
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io("http://localhost:5000/group");
    socketRef.current.emit("user want join", {
      userUid: currentUserId,
      hostUid: id,
    });
    // console.log(socketRef.current);
  }, [currentUserId, id]);
  return (
    <Layout>
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
            <Typography variant="h6">Q&A</Typography>
            <IconButton onClick={handleClose}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ minHeight: "40vw" }} dividers>
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Chat" {...a11yProps(0)} />
                <Tab label="Q&A" {...a11yProps(1)} />
                <Tab label="Poll" {...a11yProps(2)} />
                <Tab label="Quiz" {...a11yProps(3)} />
                <Tab label="People" {...a11yProps(4)} />
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0} dir={theme.direction}>
              {chatArr.length ? (
                <div>
                  <div
                    className={classes.chatConversation}
                    id="chatConversation"
                  >
                    {chatArr &&
                      chatArr.map((item) => {
                        const arr = allUsersData.filter(
                          (ele) => ele?.id === item?.uid
                        );
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent:
                                currentUserId === item?.uid
                                  ? "flex-end"
                                  : "flex-start",
                              width: "100%",
                            }}
                            key={item?.chatID}
                          >
                            <div
                              className={classes.msgBubble}
                              style={{
                                background:
                                  currentUserId === item.uid
                                    ? "#3588f3"
                                    : "#eee",
                                color:
                                  currentUserId === item.uid ? "#fff" : "#000",
                                borderBottomRightRadius:
                                  currentUserId === item.uid ? "0" : "15px",
                                borderBottomLeftRadius:
                                  currentUserId !== item.uid ? "0" : "15px",
                              }}
                            >
                              <div className={classes.msgInfo}>
                                <div className={classes.msgInfoName}>
                                  {currentUserId === item.uid
                                    ? "You"
                                    : arr[0]?.name || "Not Provided"}
                                </div>
                                <div className={classes.msgInfoTime}>
                                  {moment(item.timestamp).format(
                                    "hh:mm:A DD MMM"
                                  )}
                                </div>
                              </div>
                              <div className={classes.msgText}>
                                {item?.payload}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <Paper
                    component="form"
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* <IconButton
              aria-label="menu"
              onClick={() => setMicProp({ record: !micProp.record })}
            >
              {!micProp.record ? <Mic /> : <Pause />}
            </IconButton> */}
                    <InputBase
                      style={{
                        paddingLeft: "2vw",
                      }}
                      placeholder="Start typing here"
                      fullWidth
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    />
                    <IconButton
                      type="submit"
                      color="primary"
                      onClick={sendChat}
                    >
                      <Send />
                    </IconButton>
                  </Paper>
                </div>
              ) : (
                <div className={classes.notFoundCSS}>
                  <Chat fontSize="large" color="primary" />
                  <Typography variant="h6" style={{ marginTop: "10px" }}>
                    {" "}
                    No Chat Found
                  </Typography>
                </div>
              )}
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <div className={classes.notFoundCSS}>
                <QuestionAnswer fontSize="large" color="primary" />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  {" "}
                  No Q&A Found
                </Typography>
              </div>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <AuditoriumPoll id={id} mobile={true} />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <div className={classes.notFoundCSS}>
                <LiveHelp fontSize="large" color="primary" />
                <Typography variant="h6" style={{ marginTop: "10px" }}>
                  {" "}
                  No Quiz Found
                </Typography>
              </div>
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
              {speakerMember.length &&
                speakerMember.map((item, i) => {
                  return (
                    <Card
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "white",
                        "&:hover": {
                          backgroundColor: "#f6f6f6",
                        },
                        borderBottom: "1px solid #f6f6f6 ",
                      }}
                    >
                      <CardHeader
                        style={{ color: "black" }}
                        avatar={
                          <Badge
                            variant="dot"
                            color={item?.isOnline ? "secondary" : "default"}
                          >
                            <Avatar alt="" src={item?.logoUrl || ""} />
                          </Badge>
                        }
                        title={item?.name || "Not Provided"}
                        subheader={item?.id === id ? "Host" : ""}
                      />
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <IconButton onClick={() => handleAddContact(item?.id)}>
                          <Add />
                        </IconButton>
                      </div>
                    </Card>
                  );
                })}
            </TabPanel>
          </div>
        </DialogContent>
      </Dialog>
      <Grid container>
        <Grid item sm={12} xs={12} md={7}>
          <div>
            <div
              style={{
                height: "77vh",
                border: "1px solid grey",
              }}
            >
              <iframe
                title="video"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/53yPfrqbpkE?autoplay=1&controls=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullscreen
              ></iframe>
              {/* {event?.videoUrl && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${
                    event?.videoUrl?.split("/").reverse()[0]
                  }?autoplay=1&controls=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video"
                ></iframe>
              )} */}
            </div>

            <div
              style={{
                width: "98%",
                height: "11vh",
                margin: "10px",
              }}
            >
              <Typography component="span" variant="subtitle2">
                {/* {event?.agenda} */}
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Typography>
            </div>
          </div>
        </Grid>
        {windowSize.width > 970 ? (
          <Grid
            item
            sm={12}
            xs={12}
            md={5}
            style={{ border: "1px solid grey" }}
          >
            <div className={classes.root}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label="Chat" {...a11yProps(0)} />
                  <Tab label="Q&A" {...a11yProps(1)} />
                  <Tab label="Poll" {...a11yProps(2)} />
                  <Tab label="Quiz" {...a11yProps(3)} />
                  <Tab label="People" {...a11yProps(4)} />
                </Tabs>
              </AppBar>

              <TabPanel value={value} index={0} dir={theme.direction}>
                {chatArr.length ? (
                  <div>
                    <div
                      className={classes.chatConversation}
                      id="chatConversation"
                    >
                      {chatArr &&
                        chatArr.map((item) => {
                          const arr = allUsersData.filter(
                            (ele) => ele?.id === item?.uid
                          );
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent:
                                  currentUserId === item?.uid
                                    ? "flex-end"
                                    : "flex-start",
                                width: "100%",
                              }}
                              key={item?.chatID}
                            >
                              <div
                                className={classes.msgBubble}
                                style={{
                                  background:
                                    currentUserId === item.uid
                                      ? "#3588f3"
                                      : "#eee",
                                  color:
                                    currentUserId === item.uid
                                      ? "#fff"
                                      : "#000",
                                  borderBottomRightRadius:
                                    currentUserId === item.uid ? "0" : "15px",
                                  borderBottomLeftRadius:
                                    currentUserId !== item.uid ? "0" : "15px",
                                }}
                              >
                                <div className={classes.msgInfo}>
                                  <div className={classes.msgInfoName}>
                                    {currentUserId === item.uid
                                      ? "You"
                                      : arr[0]?.name || "Not Provided"}
                                  </div>
                                  <div className={classes.msgInfoTime}>
                                    {moment(item.timestamp).format(
                                      "hh:mm:A DD MMM"
                                    )}
                                  </div>
                                </div>
                                <div className={classes.msgText}>
                                  {item?.payload}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <Paper
                      component="form"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <IconButton
              aria-label="menu"
              onClick={() => setMicProp({ record: !micProp.record })}
            >
              {!micProp.record ? <Mic /> : <Pause />}
            </IconButton> */}
                      <InputBase
                        style={{
                          paddingLeft: "2vw",
                        }}
                        placeholder="Start typing here"
                        fullWidth
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                      />
                      <IconButton
                        type="submit"
                        color="primary"
                        onClick={sendChat}
                      >
                        <Send />
                      </IconButton>
                    </Paper>
                  </div>
                ) : (
                  <div className={classes.notFoundCSS}>
                    <Chat fontSize="large" color="primary" />
                    <Typography variant="h6" style={{ marginTop: "10px" }}>
                      {" "}
                      No Chat Found
                    </Typography>
                  </div>
                )}
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <div className={classes.notFoundCSS}>
                  <QuestionAnswer fontSize="large" color="primary" />
                  <Typography variant="h6" style={{ marginTop: "10px" }}>
                    {" "}
                    No Q&A Found
                  </Typography>
                </div>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <AuditoriumPoll id={id} />
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <div className={classes.notFoundCSS}>
                  <LiveHelp fontSize="large" color="primary" />
                  <Typography variant="h6" style={{ marginTop: "10px" }}>
                    {" "}
                    No Quiz Found
                  </Typography>
                </div>
              </TabPanel>
              <TabPanel value={value} index={4} dir={theme.direction}>
                {speakerMember.length &&
                  speakerMember.map((item, i) => {
                    return (
                      <Card
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "white",
                          "&:hover": {
                            backgroundColor: "#f6f6f6",
                          },
                          borderBottom: "1px solid #f6f6f6 ",
                        }}
                      >
                        <CardHeader
                          style={{ color: "black" }}
                          avatar={
                            <Badge
                              variant="dot"
                              color={item?.isOnline ? "secondary" : "default"}
                            >
                              <Avatar alt="" src={item?.logoUrl || ""} />
                            </Badge>
                          }
                          title={item?.name || "Not Provided"}
                          subheader={item?.id === id ? "Host" : ""}
                        />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            onClick={() => handleAddContact(item?.id)}
                          >
                            <Add />
                          </IconButton>
                        </div>
                      </Card>
                    );
                  })}
              </TabPanel>
            </div>
          </Grid>
        ) : (
          <Tooltip title="Chat">
            <Fab
              variant="round"
              size="small"
              color="primary"
              className={classes.absolute}
              onClick={() => setOpen(true)}
            >
              <ChatBubble />
            </Fab>
          </Tooltip>
        )}
      </Grid>
    </Layout>
  );
};

export default AuditoriumRoom;
