import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Slide,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { AccountCircle, Cancel, Chat, Send } from "@material-ui/icons";
import moment from "moment";
import { useAllUsersData, useWindow } from "../../hooks";
import { Layout } from "../../components";
import { auth, database } from "../../config";
import IMG from "../../assets/HelpDesk.png";
const useStyles = makeStyles((theme) => ({
  Body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  Section: {
    width: "90%",
    backgroundColor: "mintcream",
    padding: "20px",
    margin: "10px",
    cursor: "pointer",
    "&:hover": {
      background: "#efefef",
    },
  },
  Subsection: {
    maxHeight: "30vh",
    overflowY: "scroll",
    width: "90%",
    padding: "10px",
    margin: "5px",
    cursor: "pointer",
  },
  togglerButtonStyle: {
    position: "absolute",
    right: "1vw",
    top: "50%",
  },
  chatBox: {
    backgroundColor: "white",
    position: "fixed",
    bottom: "2vh",
    zIndex: 999,
  },
  chatHeader: {
    display: "flex",
    background: "linear-gradient(87deg, #ed2125, #ed2125)",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "4px 4px 0 0",
  },
  chatBodyWrapper: {},
  chatConversation: {
    flex: "1 1",
    overflowY: "auto",
    padding: "10px",
    minHeight: "35vh",
    maxHeight: "50vh",
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
  msgText: {},
  chatInputForm: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
  },
  noChatFound: {
    display: "grid",
    placeContent: "center",
    height: "30vh",
  },
}));

const HelpDesk = () => {
  const classes = useStyles();
  const { windowSize } = useWindow();
  const { allUsersData } = useAllUsersData();

  const uid = auth?.currentUser?.uid;
  const [helpDeskData, setHelpDeskData] = useState({});
  const [message, setMessage] = useState("");
  const [chatArr, setChatArr] = useState([]);
  const [popup, setPopup] = useState(false);
  // Fetch all chats with help desk
  useEffect(() => {
    database.ref(`Chat/HelpDesk/${uid}/`).on(`value`, (snap) => {
      if (snap.exists) {
        const arr = [];
        const obj = snap.val();
        for (const chatID in obj) arr.push({ ...obj[chatID], chatID });
        setChatArr(arr);
      }
    });
    return () => setChatArr([]);
  }, [uid]);

  // Scroll Down The Chats
  useEffect(() => {
    const chatConversation = document.querySelector("#chatConversation");
    if (popup && chatArr.length && chatConversation) {
      chatConversation &&
        chatConversation.scrollTo({ top: 1000, behavior: "smooth" });
    }
    return () => {};
  }, [popup, chatArr]);

  // Fetch Help Desk Data
  useEffect(() => {
    if (allUsersData.length) {
      const helpDesk = allUsersData.filter(
        (item) => item?.role === "helpdesk"
      )?.[0];
      setHelpDeskData(helpDesk);
    }
    return () => setHelpDeskData({});
  }, [allUsersData]);

  const toggleChatBox = async () => {
    setPopup(!popup);
    await database.ref(`Visitors/Helpdesk/${uid}/`).set({ visitorID: uid });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      message &&
        (await database.ref(`Chat/HelpDesk/${uid}`).push({
          payload: message,
          timestamp: new Date().getTime(),
          uid,
        }));
      message &&
        (await database
          .ref(`Users/${uid}/helpdesktimestamp`)
          .set(new Date().getTime()));
    } catch (error) {
      console.log(error.message);
    } finally {
      setMessage("");
    }
  };

  const renderTogglerButton = () =>
    !popup && (
      <Zoom in={!popup}>
        <Button
          variant="contained"
          color="primary"
          className={classes.togglerButtonStyle}
          onClick={toggleChatBox}
        >
          Live Chat
        </Button>
      </Zoom>
    );

  const showHelpDeskDetails = async () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Layout>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Help Desk Details"}</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            <TableContainer component={Paper}>
              <Table>
                <TableRow>
                  <TableCell>{"Name:"}</TableCell>
                  <TableCell>{helpDeskData?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{"Email:"}</TableCell>
                  <TableCell>{helpDeskData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{"Mobile:"}</TableCell>
                  <TableCell>{helpDeskData?.phone}</TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="secondary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: "92vh", overflow: "hidden" }}>
        <img src={IMG} alt="" style={{ width: "100%", height: "100%" }} />
        {renderTogglerButton()}
      </div>
      <Slide direction="left" in={popup} mountOnEnter unmountOnExit>
        <Paper
          style={{
            width:
              windowSize.width > 700
                ? "33vw"
                : windowSize.width > 600
                ? "55vw"
                : "94vw",
            right:
              windowSize.width > 700
                ? "1vw"
                : windowSize.width > 600
                ? "1vw"
                : "2vw",
          }}
          className={classes.chatBox}
          elevation={8}
        >
          <div className={classes.chatHeader}>
            <IconButton onClick={showHelpDeskDetails}>
              <AccountCircle style={{ color: "white" }} />
            </IconButton>
            <Typography style={{ color: "white", marginLeft: "5px" }}>
              Chat With Help Desk
            </Typography>
            <IconButton onClick={toggleChatBox}>
              <Cancel style={{ color: "white" }} />
            </IconButton>
          </div>
          <div className={classes.chatBodyWrapper}>
            <div className={classes.chatConversation} id="chatConversation">
              {chatArr.length ? (
                chatArr.map((item) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        uid === item.uid ? "flex-end" : "flex-start",
                      width: "100%",
                    }}
                    key={item?.chatID}
                  >
                    <div
                      className={classes.msgBubble}
                      style={{
                        background: uid === item.uid ? "#3588f3" : "#eee",
                        color: uid === item.uid ? "#fff" : "#000",
                        borderBottomRightRadius:
                          uid === item.uid ? "0" : "15px",
                        borderBottomLeftRadius: uid !== item.uid ? "0" : "15px",
                      }}
                    >
                      <div className={classes.msgInfo}>
                        <div className={classes.msgInfoName}>
                          {uid === item.uid ? "You" : "Help desk"}
                        </div>
                        <div className={classes.msgInfoTime}>
                          {moment(item.timestamp).format("hh:mm:A DD MMM")}
                        </div>
                      </div>
                      <div className={classes.msgText}>{item?.payload}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={classes.noChatFound}>
                  <IconButton color="primary">
                    <Chat />
                  </IconButton>
                  <Typography>No Chats Found</Typography>
                </div>
              )}
            </div>
            <Divider />
            <form
              onSubmit={handleSendMessage}
              className={classes.chatInputForm}
            >
              <InputBase
                style={{
                  paddingLeft: "2vw",
                }}
                placeholder="Type Here..."
                fullWidth
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <IconButton type="submit" color="primary">
                <Send />
              </IconButton>
            </form>
          </div>
        </Paper>
      </Slide>
    </Layout>
  );
};

export default HelpDesk;
