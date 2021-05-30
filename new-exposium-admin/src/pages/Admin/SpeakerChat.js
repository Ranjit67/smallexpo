import {
  Card,
  Container,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useAllUsersData, useCurrentUser } from "../../hooks";
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
    minHeight: "75vh",
    maxHeight: "80vh",
  },
}));

const SpeakerChat = () => {
  const classes = useStyles();
  const { allUsersData } = useAllUsersData();
  const { currentUserData, currentUserId } = useCurrentUser();
  const [chatArr, setChatArr] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    database.ref(`Chat/Speaker/${currentUserId}`).on(`value`, (snap) => {
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
  }, [currentUserId]);
  const sendChat = async (e) => {
    e.preventDefault();
    if (message) {
      try {
        await database.ref(`Chat/Speaker/${currentUserId}`).push({
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
  console.log(chatArr);
  return (
    <Navigation>
      <Container maxWidth="sm">
        <Card>
          <div className={classes.chatConversation} id="chatConversation">
            {chatArr &&
              chatArr.map((item) => {
                const arr = allUsersData.filter((ele) => ele?.id === item?.uid);
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        currentUserId === item?.uid ? "flex-end" : "flex-start",
                      width: "100%",
                    }}
                    key={item?.chatID}
                  >
                    <div
                      className={classes.msgBubble}
                      style={{
                        background:
                          currentUserId === item.uid ? "#3588f3" : "#eee",
                        color: currentUserId === item.uid ? "#fff" : "#000",
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
                          {moment(item.timestamp).format("hh:mm:A DD MMM")}
                        </div>
                      </div>
                      <div className={classes.msgText}>{item?.payload}</div>
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
            <IconButton type="submit" color="primary" onClick={sendChat}>
              <Send />
            </IconButton>
          </Paper>
        </Card>
      </Container>
    </Navigation>
  );
};

export default SpeakerChat;
