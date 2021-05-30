import { useEffect, useRef, useState } from "react";
import { Navigation } from "../../components";
import { auth } from "../../config";
import io from "socket.io-client";
import {
  makeStyles,
  Card,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge,
  Button,
} from "@material-ui/core";
import {
  Chat,
  Send,
  Mic,
  VideocamOff,
  CallEnd,
  MicOff,
  Videocam,
  Forum,
  Close,
} from "@material-ui/icons";
import { useHistory, useParams } from "react-router";
import Peer from "simple-peer";
import PeerVideo from "../../components/PeerVideo";
import { database } from "../../config";
const useStyles = makeStyles((theme) => ({
  cardContRootDiv: {
    display: "flex",
  },
  videoSection: {
    height: "87vh",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    // [theme.breakpoints.down("lg")]: {
    //   width: "100%",
    // },
    // [theme.breakpoints.up("lg")]: {
    //   width: "75%",
    // },
  },

  smallVideoDiv: {
    height: "90%",
    width: "100%",
    // position: "absolute",
  },
  afterConnect: {
    height: "100px",
    width: "100px",
    position: "absolute",
    top: "30px",
    right: "20px",
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
  offCameraDiv: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  AllBtnCont: {
    height: "10%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chatMobile: {
    [theme.breakpoints.down("lg")]: {
      position: "absolute",
      bottom: 30,
      right: 10,
      height: "50px",
      width: "50px",
      backgroundColor: "blue",
      color: "white",
      overflow: "hidden",
    },
    [theme.breakpoints.up("lg")]: {
      height: 0,
      width: 0,
      visibility: "hidden",
    },
  },
  chatIcon: {
    [theme.breakpoints.up("lg")]: {
      height: 0,
      width: 0,
    },
  },
  chatSection: {
    overflow: "hidden",
    [theme.breakpoints.down("lg")]: {
      width: 0,
    },
    [theme.breakpoints.up("lg")]: {
      width: "25%",
      backgroundColor: "yellow",
      height: "84vh",
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
    height: "80%",
    // backgroundColor: "yellow",
    overflow: "auto",
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
  endCallBtn: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(231, 76, 60,0.7)",
    },
  },
  sendDialog: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "20px",
    paddingRight: "20px",
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
  dialogHeight: {
    height: "50%",
    minWidth: "30%",
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
  nameTimeStamp: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
  },
  toolbarCss: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const StallVideoCall = () => {
  const { user } = useParams();
  // console.log(user);
  const classes = useStyles();
  // console.log(auth?.currentUser?.uid);
  const socketRef = useRef();

  const peerRef = useRef();
  const mySmallVideo = useRef();
  const [extraMessage, setExtraMessage] = useState();
  const [userPeer, setUserPeer] = useState();
  const [mic, setMic] = useState(false);
  const [peerMute, setPeerMute] = useState(true);
  const [videoCam, setVideoCam] = useState(false);
  const [peerVideoControler, setPeerVideoControler] = useState(true);
  const [chatDialog, setChatDialog] = useState(false);
  const [textInputChat, setTextInputChat] = useState("");
  const [messageContState, setMessageContState] = useState([]);
  const [countBudge, setCountBudge] = useState(0);
  const [userName, setUserName] = useState();
  const messageContRef = useRef();

  const history = useHistory();
  useEffect(() => {
    //https://exposium-api.herokuapp.com/
    socketRef.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setExtraMessage();
        mySmallVideo.current.srcObject = stream;
        let peer;

        peer = createPeer(socketRef.current.id, stream);
        setUserPeer(peer);
        peerRef.current = peer;
      });
    socketRef.current.on("send signal to stall", (payload) => {
      const { signal } = payload;
      console.log(signal);
      peerRef.current.signal(signal);
    });
    socketRef.current.on("User is disconnected", (data) => {
      // console.log("User disconnected..");
      peerRef?.current?.destroy();
      setUserPeer();
      afterDisconnected();
    });
    //mic status
    socketRef.current.on("send mic status to stall", (payload) => {
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
    socketRef.current.on("send video status to stall", (payload) => {
      const { videoStatus } = payload;
      setPeerVideoControler(videoStatus);
    });
    //disconnect call
    socketRef.current.on("Disconnect call", async (payload) => {
      const { userUuid } = payload;
      // console.log(payload);
      peerRef?.current?.destroy();
      setUserPeer();
      await database.ref(`Users/${userUuid}`).on("value", (snap) => {
        console.log(snap.val().name);
        setExtraMessage(`${snap.val().name} has end the call...`);
      });

      // const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      // localTracksOn.forEach((track) => track.stop());
      // history.push("/StallVideoCall");
    });
    socketRef.current.on("you are disconnected", (payload) => {
      console.log(payload);
      peerRef?.current?.destroy();
      setUserPeer();

      const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      localTracksOn.forEach((track) => track.stop());
      history.push("/StallVideoCall");
    });
    socketRef.current.emit("no one have simple delete", (payload) => {
      setUserPeer();

      const localTracksOn = mySmallVideo.current.srcObject.getTracks();
      localTracksOn.forEach((track) => track.stop());
      history.push("/StallVideoCall");
    });
    //disconnect end
    //chat message
    socketRef.current.on("receive message", (payload) => {
      console.log(payload);
      setCountBudge((prev) => prev + 1);
      setMessageContState((prev) => [payload, ...prev]);
    });
    //chat message end
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (messageContRef.current) {
      messageContRef.current.scrollTo({
        top: document.body.offsetWidth * 4,
        behavior: "smooth",
      });
    }
  }, [messageContState]);
  useEffect(() => {
    database.ref(`Users/${user}`).on("value", (snap) => {
      console.log(snap.val().name);
      setUserName(snap.val().name);
    });
  }, [userName]);
  function createPeer(callerID, stream) {
    const peer = new Peer({
      initiator: true,
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
      socketRef.current.emit("sending signal", {
        userToSignal: user,
        callerID,
        signal,
        stall: auth?.currentUser?.uid,
      });
    });

    return peer;
  }
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
  const endCall = () => {
    socketRef.current.emit("End call", { selfId: auth?.currentUser?.uid });
  };
  const chatHandel = () => {
    setChatDialog((prev) => !prev);
    setCountBudge(0);
  };
  //message functions
  const sendMessageHandel = () => {
    socketRef.current.emit("send message stall", {
      message: textInputChat,
      stallSelf: auth.currentUser.uid,
      date: new Date(),
    });
    setMessageContState((prev) => [
      {
        senderId: auth.currentUser.uid,
        message: textInputChat,
        hours: new Date().getHours(),
        minute: new Date().getMinutes(),
        year: new Date().getFullYear(),
        day: new Date().getDay(),
        month: new Date().getMonth(),
      },
      ...prev,
    ]);

    setTextInputChat("");
  };
  const afterDisconnected = () => {
    const localTracksOn = mySmallVideo.current.srcObject.getTracks();
    localTracksOn.forEach((track) => track.stop());
    history.push("/StallVideoCall");
  };
  // const handleClose = () => {};
  const backToHome = () => {
    setExtraMessage();
    const localTracksOn = mySmallVideo.current.srcObject.getTracks();
    localTracksOn.forEach((track) => track.stop());
    history.push("/StallVideoCall");
  };
  return (
    <>
      <Navigation>
        <div className={classes.cardContRootDiv}>
          <div className={classes.videoSection}>
            {userPeer && (
              <PeerVideo
                mic={peerMute}
                videoCont={peerVideoControler}
                peer={userPeer}
              />
            )}
            <div
              className={
                userPeer ? classes.afterConnect : classes.smallVideoDiv
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
            </div>

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
              <IconButton onClick={chatHandel}>
                <Badge badgeContent={countBudge} color="secondary">
                  <Forum />
                </Badge>
              </IconButton>
            </Paper>
            <IconButton className={classes.chatMobile}>
              <Chat className={classes.chatIcon} />
            </IconButton>
          </div>

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
                {messageContState.map((text) => (
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
                          <p>{userName}</p>
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
                value={textInputChat}
                onChange={(e) => setTextInputChat(e.target.value)}
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
      </Navigation>
      <Dialog
        open={extraMessage}
        onClose={backToHome}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {extraMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={backToHome} color="primary" autoFocus>
            Go, Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StallVideoCall;
