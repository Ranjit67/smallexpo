import {
  Divider,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { ChatOutlined, Send } from "@material-ui/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { auth, database, useAuth } from "../config";
import { useAllUsersData, useCurrentUser } from "../hooks";
const useStyles = makeStyles((theme) => ({
  msgBubble: {
    color: "#fff",
    padding: "15px",
    maxWidth: "250px",
    borderRadius: "15px",
    minWidth: "30%",
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
    padding: "5px",
    height: "65vh",
  },
}));

const SelectedChatUser = ({ admin, selectedUser, helpdesk }) => {
  const { allUsersData } = useAllUsersData();

  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const [message, setMessage] = useState("");
  const [messageArr, setMessageArr] = useState([]);
  const [disableSend, setDisableSend] = useState(false);
  const [chatRef, setChatRef] = useState(``);
  const { currentUserData, currentUserId } = useCurrentUser();
  const { sendNotification } = useAuth();

  // Setting Chat ref according to role of the user
  useEffect(() => {
    if (admin) setChatRef(`Chat/Platform/${selectedUser?.id}/${uid}`);
    else setChatRef(`Chat/Platform/${uid}/${selectedUser?.id}`);
    if (helpdesk) setChatRef(`Chat/HelpDesk/${selectedUser?.id}`);
  }, [admin, helpdesk, selectedUser?.id, uid]);

  // Fetching Chat Messages
  useEffect(() => {
    chatRef &&
      database.ref(chatRef).on(`value`, (snap) => {
        if (snap.exists) {
          const arr = [];
          const obj = snap.val();
          for (const key in obj) arr.push({ ...obj[key] });
          setMessageArr(arr);
        }
      });
    return () => setMessageArr([]);
  }, [chatRef, selectedUser?.id, uid]);

  // Scroll Down The Chats
  useEffect(() => {
    const chatConversation = document.querySelector("#chatConversation");
    if (messageArr.length && chatConversation) {
      chatConversation &&
        chatConversation.scrollTo({ top: 1000, behavior: "smooth" });
    }
    return () => {};
  }, [messageArr]);

  const sendChat = async (e) => {
    e.preventDefault();
    setDisableSend(true);
    try {
      const chat = {
        payload: message,
        timestamp: new Date().getTime(),
        uid: uid,
      };
      // Message
      if (message) {
        await database.ref(chatRef).push(chat);
      }

      // Empty Message After Message Sent
      setMessage("");

      // User to Stall
      if (!helpdesk && !admin && message) {
        const dbRef = `UnreadChats/byStall/${currentUserId}/${selectedUser?.id}`;
        database.ref(dbRef).once("value", (snap) => {
          if (snap.exists()) {
            database.ref(dbRef).set(snap.val() + 1);
          } else {
            database.ref(dbRef).set(1);
          }
        });
        await database
          .ref(
            `Visitors/Stall/${selectedUser?.stallID}/${selectedUser?.id}/${uid}/timestamp`
          )
          .set(new Date().getTime());
        await database
          .ref(`Visitors/User/${uid}/${selectedUser?.id}/timestamp`)
          .set(new Date().getTime());
      }

      // Stall to User
      if (admin && message) {
        const dbRef = `UnreadChats/byUser/${currentUserId}/${selectedUser?.id}`;
        database.ref(dbRef).once("value", (snap) => {
          if (snap.exists()) {
            database.ref(dbRef).set(snap.val() + 1);
          } else {
            database.ref(dbRef).set(1);
          }
        });

        await database
          .ref(
            `Visitors/Stall/${currentUserData?.stallID}/${uid}/${selectedUser?.id}/timestamp`
          )
          .set(new Date().getTime());
        await database
          .ref(
            `Visitors/Stall/${currentUserData?.stallID}/${uid}/${selectedUser?.id}/isSendMessage`
          )
          .set(true);

        await database
          .ref(`Visitors/User/${selectedUser?.id}/${uid}/timestamp`)
          .set(new Date().getTime());
        await database
          .ref(`Visitors/User/${selectedUser?.id}/${uid}/isSendMessage`)
          .set(true);
      }

      // HelpDesk to User (Updating Timestamp for Sorting in HelpDesk admin)
      if (helpdesk && message) {
        const helpDeskVisitorRef = `Visitors/Helpdesk/${selectedUser?.id}`;
        await database
          .ref(`${helpDeskVisitorRef}/timestamp`)
          .set(new Date().getTime());
        await database
          .ref(`${helpDeskVisitorRef}/unreadChats`)
          .once("value", (snap) => {
            if (snap.exists()) {
              database.ref(`${helpDeskVisitorRef}/unreadChats`).set({
                byUser: snap.val()?.byUser + 1,
                byHelpDesk: snap.val()?.byHelpDesk || 0,
              });
            } else {
              database.ref(`${helpDeskVisitorRef}/unreadChats`).set({
                byUser: 1,
                byHelpDesk: 0,
              });
            }
          });
      }

      // Send Push notifications to the user
      await database
        .ref(`Users/${selectedUser?.id}/fcmToken`)
        .on("value", (snap) => {
          if (snap.exists()) {
            const token = snap.val();
            sendNotification(
              {
                body: message,
                title: currentUserData?.name || "New Message",
                sound: "default",
              },
              token
            );
          }
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      setDisableSend(false);
    }
  };
  return (
    <>
      <div
        className={classes.chatConversation}
        id="chatConversation"
        style={{ height: admin ? "72vh" : "65vh" }}
      >
        {messageArr &&
          messageArr.map((item) => {
            const arr = allUsersData.filter((ele) => ele?.id === item?.uid);
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: uid === item?.uid ? "flex-end" : "flex-start",
                  width: "100%",
                }}
                key={item?.chatID}
              >
                <div
                  className={classes.msgBubble}
                  style={{
                    background: uid === item.uid ? "#3588f3" : "#eee",
                    color: uid === item.uid ? "#fff" : "#000",
                    borderBottomRightRadius: uid === item.uid ? "0" : "15px",
                    borderBottomLeftRadius: uid !== item.uid ? "0" : "15px",
                  }}
                >
                  <div className={classes.msgInfo}>
                    <div className={classes.msgInfoName}>
                      {uid === item.uid
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
      <Divider />
      <Paper
        component="form"
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "1vh",
        }}
        onSubmit={sendChat}
      >
        <IconButton>
          <ChatOutlined />
        </IconButton>
        <InputBase
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Start typing here"
          fullWidth
          required
        />
        <IconButton type="submit" color="primary" disabled={disableSend}>
          <Send />
        </IconButton>
      </Paper>
    </>
  );
};

export default SelectedChatUser;
