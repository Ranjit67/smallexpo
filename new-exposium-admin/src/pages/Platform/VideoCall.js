import { memo, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Layout } from "../../components";
import { auth, useAuth, database } from "../../config";
import { useCurrentUser } from "../../hooks";
import io from "socket.io-client";
import Peer from "simple-peer";
import PeerVideo from "../../components/PeerVideo";
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  Send,
  Forum,
  Close,
} from "@material-ui/icons";
import {
  makeStyles,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Card,
  Button,
  Badge,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  videoSection: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    [theme.breakpoints.down("lg")]: {
      width: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "75%",
    },
  },
  chatSection: {
    overflow: "hidden",
    [theme.breakpoints.down("lg")]: {
      width: 0,
    },
    [theme.breakpoints.up("lg")]: {
      width: "25%",
      // backgroundColor: "yellow",
      height: "91vh",
    },
  },

  mySmallVideoTag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  mySmallVideoTagOff: {
    width: 0,
    height: 0,
    objectFit: "cover",
  },
  AllBtnCont: {
    height: "10%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  endCallBtn: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(231, 76, 60,0.8)",
    },
  },
  ChartBox: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  textDiv: {
    width: "100%",
    height: "75%",
    marginBottom: "11%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    "&::-webkit-scrollbar": {
      width: "0.4em",
      // borderRadius: 20,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
      borderRadius: 20,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.light,
      // outline: "1px solid gray",
      borderRadius: 20,
    },
  },
  InputAndBtnCont: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5px 0 5px",
  },
  textInputField: {
    width: "82%",
  },
  sendBtn: {
    backgroundColor: "blue",
    color: "white",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  smallVideoDiv: {
    height: "90%",
    width: "100%",
    position: "relative",
  },
  afterConnect: {
    height: "100px",
    width: "100px",
    position: "absolute",
    top: "30px",
    right: "20px",
    // backgroundColor: "white",
  },
  offCameraDiv: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textMessageOwner: {
    display: "flex",
    justifyContent: "flex-end",
    fontFamily: "sans-serif",
    marginRight: 10,
    marginBottom: 20,
    // backgroundColor: "blue",
  },
  textMessageOtherUser: {
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginLeft: 10,
  },
  messagesOwen: {
    padding: 8,
    marginBottom: 3,
    // display: "block",
    backgroundColor: "rgb(53, 136, 243)",
    minHeight: "8vh",
    borderRadius: "10px 10px 10px 0px",
    minWidth: "22vh",
    color: "white",
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
  },
  OtherPartyMessage: {
    padding: 8,
    marginBottom: 3,
    display: "block",
    backgroundColor: "rgb(238, 238, 238)",
    minHeight: "8vh",
    borderRadius: "10px 10px 0px 10px",
    minWidth: "22vh",
    color: "black",
  },
  nameTimeStamp: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
  },
  outerAbsoluteDiv: {
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  dialogPapear: {
    height: "100px",
    display: "flex",
    alignItems: "center",
    padding: "5px",
    backgroundColor: "rgba(0, 0, 0,0.3)",
    color: "white",
    borderRadius: "10px",
  },
  dialogHeight: {
    height: "50%",
    minWidth: "100%",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
      borderRadius: 20,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.light,
      // outline: "1px solid gray",
      borderRadius: 20,
    },
  },
  messageCont: {
    // overflow: "auto",
    // width: "100%",
    // marginTop: 10,
    // flexDirection: "column-reverse",
    "&::-webkit-scrollbar": {
      width: "0.4em",
      // borderRadius: 20,
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
      borderRadius: 20,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.palette.secondary.light,
      // outline: "1px solid gray",
      borderRadius: 20,
    },
  },
  messageHoldDiv: {
    display: "flex",
    flexDirection: "column-reverse",

    minHeight: "100%",
  },
  messagesTextOwner: {
    display: "flex",

    justifyContent: "flex-end",
  },
  messagesTextUser: {
    display: "flex",

    justifyContent: "flex-start",
  },
  textBlockOwner: {
    display: "block",
    backgroundColor: "rgb(53, 136, 243)",
    padding: 5,
    marginBottom: 3,
    borderRadius: "10px 10px 10px 0px",
    minHeight: "9vh",
    minWidth: "26vh",
    color: "white",
  },
  textBlockOtherParty: {
    display: "block",
    backgroundColor: "rgb(238, 238, 238)",
    padding: 5,
    marginBottom: 3,
    borderRadius: "10px 10px 0px 10px",
    minHeight: "9vh",
    minWidth: "26vh",
  },
  sendDialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  toolbarCss: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));
const VideoCall = () => {
  const { sendNotification } = useAuth();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams();
  const history = useHistory();
  console.log("StallID", id);
  console.log("UserID", auth?.currentUser?.uid);

  const messageContRef = useRef();
  const mySmallVideo = useRef();
  const socketRef = useRef();
  const peerRef = useRef({});
  const [message, setMessage] = useState("");
  const [peerState, setPeerState] = useState();
  //mute video and audio state
  const [mic, setMic] = useState(false);
  const [videoCam, setVideoCam] = useState(false);
  const [peerMute, setPeerMute] = useState(true);
  const [peerVideoControler, setPeerVideoControler] = useState(true);
  const [textMessage, setTextMessage] = useState();
  const [messageStack, setMessageStack] = useState([]);
  const [stallName, setStallName] = useState("");
  const [chatDialog, setChatDialog] = useState(false);
  const [countBudge, setCountBudge] = useState(0);
  useEffect(() => {
    database.ref(`Users/${id}`).on("value", (snap) => {
      console.log(snap.val().name);
      setStallName(snap.val().name);
    });
  }, [stallName]);
  useEffect(() => {
    if (messageContRef.current) {
      messageContRef.current.scrollTo({
        top: document.body.offsetWidth * 4,
        behavior: "smooth",
      });
    }
  }, [messageStack]);
  useEffect(() => {
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        //send notification
        handleSendNotification();
        //send end
        mySmallVideo.current.srcObject = stream;
        socketRef.current.emit("send request to stall", {
          user: auth?.currentUser?.uid,
          stall: id,
          time: new Date(),
        });
        socketRef.current.on("signal to user", (payload) => {
          console.log(payload);
          const { callerID, signal } = payload;
          const peer = addPeer(callerID, signal, stream);
          peerRef.current = {
            callerID,
            peer,
          };

          setPeerState(peer);
        });
      });
    socketRef.current.on("stall reject to user", (data) => {
      setMessage("your request has rejected...");
    });
    socketRef.current.on("stall owner disconnect call", () => {
      peerRef?.current?.peer?.destroy();
      setPeerState();
      afterDisconnect();
    });
    //mic status receive
    socketRef.current.on("send mic status to user", (payload) => {
      const { micStatus } = payload;
      setPeerMute(micStatus);
      // console.log(micStatus);
    });
    socketRef.current.on("wait for connection", (payload) => {
      if (payload === "audio") {
        setMic((prev) => !prev);
      } else {
        setVideoCam((prev) => !prev);
      }

      alert("Wait for connection....");
    });
    socketRef.current.on("send video status to user", (payload) => {
      const { videoStatus } = payload;
      setPeerVideoControler(videoStatus);
    });
    //Disconnect call
    socketRef.current.on("Disconnect call", (payload) => {
      console.log(payload);
      peerRef?.current?.peer?.destroy();
      setPeerState();

      const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      localTracksOn.forEach((track) => track.stop());
      history.push("/Participants");
    });
    socketRef.current.on("you are disconnected", (payload) => {
      peerRef?.current?.peer?.destroy();
      setPeerState();

      const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      localTracksOn.forEach((track) => track.stop());
      history.push("/Participants");
    });
    socketRef.current.emit("no one have simple delete", (payload) => {
      console.log(payload);

      const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      localTracksOn.forEach((track) => track.stop());
      history.push("/Participants");
    });
    //end disconnect call
    //chat section
    socketRef.current.on("receive message", (payload) => {
      console.log(payload);
      setCountBudge((prev) => prev + 1);
      setMessageStack((prev) => [payload, ...prev]);
    });
    //chat end
  }, [history, id]);
  function addPeer(callerId, StallSignal, stream) {
    const peer = new Peer({
      initiator: false,
      config: {
        iceServers: [
          // { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
          // { urls: "stun:global.stun.twilio.com:443?transport=udp" },

          // {
          //   urls: "turn:numb.viagenie.ca",
          //   username: "webrtc@live.com",
          //   credential: "muazkh",
          // },
          { url: "stun:stun01.sipphone.com" },
          { url: "stun:stun.ekiga.net" },
          { url: "stun:stun.fwdnet.net" },
          { url: "stun:stun.ideasip.com" },
          { url: "stun:stun.iptel.org" },
          { url: "stun:stun.rixtelecom.se" },
          { url: "stun:stun.schlund.de" },
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
          { url: "stun:stun2.l.google.com:19302" },
          { url: "stun:stun3.l.google.com:19302" },
          { url: "stun:stun4.l.google.com:19302" },
          { url: "stun:stunserver.org" },
          { url: "stun:stun.softjoys.com" },
          { url: "stun:stun.voiparound.com" },
          { url: "stun:stun.voipbuster.com" },
          { url: "stun:stun.voipstunt.com" },
          { url: "stun:stun.voxgratia.org" },
          { url: "stun:stun.xten.com" },
          {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
          {
            url: "turn:192.158.29.39:3478?transport=udp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
          },
          {
            url: "turn:192.158.29.39:3478?transport=tcp",
            credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
            username: "28224511:1379330808",
          },
        ],
      },
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, stall: id });
    });

    peer.signal(StallSignal);

    return peer;
  }
  const classes = useStyles();

  //All state change function
  const micHandler = () => {
    socketRef.current.emit("micro phone status", {
      selfId: auth?.currentUser?.uid,
      micStatus: mic,
    });
    setMic((prev) => !prev);
  };
  const videoHandler = () => {
    socketRef.current.emit("video status send", {
      selfId: auth?.currentUser?.uid,
      videoStatus: videoCam,
    });

    setVideoCam((prev) => !prev);
  };
  //disconnect call function
  const endCall = () => {
    setMessage();
    if (peerState) {
      socketRef.current.emit("End call", { selfId: auth?.currentUser?.uid });
    } else {
      socketRef.current.emit("no one connected disconnect", {
        selfId: auth?.currentUser?.uid,
        stall: id,
      });
    }
  };
  //end function
  //message functions
  // moblie view chat start
  const chatHandel = () => {
    setChatDialog((prev) => !prev);
    setCountBudge(0);
  };
  //mobile view chat end
  const sendMessageHandel = () => {
    socketRef.current.emit("send message user", {
      message: textMessage,
      userSelf: auth.currentUser.uid,
    });
    setMessageStack((prev) => [
      {
        senderId: auth.currentUser.uid,
        message: textMessage,
        hours: new Date().getHours(),
        minute: new Date().getMinutes(),
        year: new Date().getFullYear(),
        day: new Date().getDay(),
        month: new Date().getMonth(),
      },
      ...prev,
    ]);
    setTextMessage("");
  };
  const afterDisconnect = () => {
    const localTracksOn = mySmallVideo.current.srcObject.getTracks();
    localTracksOn.forEach((track) => track.stop());
    history.push("/Participants");
  };
  //end Message functions
  const { currentUserData } = useCurrentUser();

  const handleClose = () => {};
  const handleSendNotification = async () => {
    try {
      const notification = {
        body: `${currentUserData.name} want to connect in video call..`,
        title: "Video call",
        sound: "default",
        timestamp: new Date().toLocaleString(),
      };

      database.ref(`Users/${id}/fcmToken`).on("value", (snap) => {
        if (snap.exists()) {
          const token = snap.val();
          // console.log(sendNotification);//

          sendNotification(notification, token);
        }
      });

      database.ref(`Notifications/${id}/`).push(notification);
    } catch (error) {
      alert(error.message);
    } finally {
      // alert("Success fully sent notification");
      // setOpen(false);
    }
  };
  return (
    <>
      <Layout>
        <div className={classes.root}>
          {/* video start */}
          <div className={classes.videoSection}>
            {peerState && (
              <PeerVideo
                mic={peerMute}
                videoCont={peerVideoControler}
                peer={peerState}
              />
            )}

            <div
              className={
                peerState ? classes.afterConnect : classes.smallVideoDiv
              }
            >
              <video
                muted
                ref={mySmallVideo}
                className={
                  !videoCam
                    ? classes.mySmallVideoTag
                    : classes.mySmallVideoTagOff
                }
                autoPlay
                playsInline
              />
              {videoCam && (
                <div className={classes.offCameraDiv}>
                  <VideocamOff
                    fontSize="large"
                    style={{
                      color: "white",
                    }}
                  />
                </div>
              )}
              {/* message to the user until not connected to the stall */}
              {!peerState && (
                <div className={classes.outerAbsoluteDiv}>
                  <div className={classes.dialogPapear}>
                    You are in waiting list.....
                    {/* <p>Please wait for some while</p> */}
                  </div>
                </div>
              )}
            </div>

            {/* end not connected message */}
            {/* {message} */}
            <Paper elevation={3} className={classes.AllBtnCont}>
              {mic ? (
                <IconButton onClick={micHandler}>
                  <Mic />
                </IconButton>
              ) : (
                <IconButton onClick={micHandler}>
                  <MicOff />
                </IconButton>
              )}
              <IconButton className={classes.endCallBtn} onClick={endCall}>
                <CallEnd />
              </IconButton>
              {videoCam ? (
                <IconButton onClick={videoHandler}>
                  <VideocamOff />
                </IconButton>
              ) : (
                <IconButton onClick={videoHandler}>
                  <Videocam />
                </IconButton>
              )}
              {matches && (
                <IconButton onClick={chatHandel}>
                  <Badge badgeContent={countBudge} color="secondary">
                    <Forum />
                  </Badge>
                </IconButton>
              )}
              {/* chat icon */}
            </Paper>
            {/* chat start */}
            <Dialog
              open={chatDialog}
              onClose={chatHandel}
              scroll={"paper"}
              // fullScreen

              classes={{ paperScrollPaper: classes.dialogHeight }}
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              {/* app bar */}

              <AppBar position="static" color="secondary">
                <Toolbar className={classes.toolbarCss}>
                  <Typography variant="h6" className={classes.title}>
                    Live Chat
                  </Typography>
                  <IconButton onClick={chatHandel}>
                    <Close style={{ color: "white" }} />
                  </IconButton>
                </Toolbar>
              </AppBar>
              {/* </DialogTitle> */}
              <DialogContent className={classes.messageCont}>
                <DialogContentText
                  id="scroll-dialog-description"
                  ref={messageContRef}
                  className={classes.messageHoldDiv}
                  tabIndex={-1}
                >
                  {messageStack.map((text) => (
                    <div
                      className={
                        text.senderId === auth.currentUser.uid
                          ? classes.messagesTextOwner
                          : classes.messagesTextUser
                      }
                    >
                      <Card
                        elevation={1}
                        className={
                          text.senderId === auth.currentUser.uid
                            ? classes.textBlockOwner
                            : classes.textBlockOtherParty
                        }
                      >
                        <div className={classes.nameTimeStamp}>
                          {text.senderId === auth.currentUser.uid ? (
                            <p>You</p>
                          ) : (
                            <p>{stallName}</p>
                          )}
                          {text?.hours && (
                            <p>{`${text?.day}/${text?.month}/${text?.year} ${text?.hours}:${text?.minute}`}</p>
                          )}
                        </div>
                        {text.message}
                      </Card>
                    </div>
                  ))}
                </DialogContentText>
              </DialogContent>
              <DialogActions className={classes.sendDialog}>
                <TextField
                  id="standard-basic"
                  label="Text chat"
                  style={{ width: "80%" }}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      sendMessageHandel();
                    }
                  }}
                />

                <IconButton
                  variant="contained"
                  color="secondary"
                  onClick={sendMessageHandel}
                >
                  <Send />
                </IconButton>
              </DialogActions>
            </Dialog>
          </div>
          {/* mobile view chat end */}
          {/* video end */}
          {/* chat section */}
          <div className={classes.chatSection}>
            <Paper elevation={3} className={classes.ChartBox}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                    Chat
                  </Typography>
                </Toolbar>
              </AppBar>
              <div className={classes.textDiv}>
                {messageStack.map((text, index) => (
                  <div
                    key={index}
                    className={
                      text.senderId === auth.currentUser.uid
                        ? classes.textMessageOwner
                        : classes.textMessageOtherUser
                    }
                  >
                    <Card
                      elevation={1}
                      className={
                        text.senderId === auth.currentUser.uid
                          ? classes.messagesOwen
                          : classes.OtherPartyMessage
                      }
                    >
                      <div className={classes.nameTimeStamp}>
                        {text.senderId === auth.currentUser.uid ? (
                          <p>You</p>
                        ) : (
                          <p>{stallName}</p>
                        )}
                        {text?.hours && (
                          <p>{`${text?.day}/${text?.month}/${text?.year} ${text?.hours}:${text?.minute}`}</p>
                        )}
                      </div>
                      {text.message}
                    </Card>
                  </div>
                ))}
              </div>
              <div className={classes.InputAndBtnCont}>
                <TextField
                  id="standard-basic"
                  placeholder="Text Message"
                  className={classes.textInputField}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      sendMessageHandel();
                    }
                  }}
                />

                <IconButton
                  className={classes.sendBtn}
                  onClick={sendMessageHandel}
                >
                  <Send />
                </IconButton>
              </div>
            </Paper>
          </div>
        </div>
      </Layout>
      {/* reject message */}
      <Dialog
        open={message}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={endCall} color="primary">
            Go, Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(VideoCall);
