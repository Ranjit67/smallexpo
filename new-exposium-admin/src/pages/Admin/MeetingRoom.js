import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  AppBar,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@material-ui/core";

import { Send } from "@material-ui/icons";

import { useCurrentUser, useWindow } from "../../hooks";
import { Navigation } from "../../components";

const MeetingRoom = () => {
  const video = null;
  const [message, setMessage] = useState("");
  const { windowSize } = useWindow();
  const { currentUserData, currentUserId } = useCurrentUser();
  const socketRef = useRef();
  const myVideo = useRef();
  console.log(currentUserData);
  console.log(currentUserId);
  useEffect(() => {
    socketRef.current = io("http://localhost:5000/group");
    socketRef.current.emit("host speaker join", { hostSpeaker: currentUserId });
    // console.log(socketRef.current);
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        myVideo.current.srcObject = stream;
      });

    // .then((stream) => {
    //    = stream;
    // });
    socketRef.current.emit(
      "user send connection request to host",
      (payload) => {}
    );
  }, [currentUserId]);
  return (
    <Navigation>
      <Grid container>
        <Grid item sm={12} xs={12} md={8}>
          <div>
            {windowSize.width > 970 && (
              <div
                style={{
                  height: "83vh",
                  border: "1px solid grey",
                  marginLeft: "10px ",
                }}
              >
                {/* {video && (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${
                      video?.split("/").reverse()[0]
                    }?autoplay=1&controls=0`}
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullscreen
                    title="Video"
                  ></iframe>
                )} */}
                <video
                  style={{ width: "100%", height: "100%" }}
                  ref={myVideo}
                  muted
                  autoPlay
                  playsInline
                />
              </div>
            )}
          </div>
        </Grid>
        <Grid item sm={12} xs={12} md={4} style={{ border: "1px solid grey" }}>
          <AppBar position="relative">
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Typography>Q&A</Typography>
            </div>
          </AppBar>
          <div style={{ minHeight: "70vh" }}>
            <div
              style={{
                maxHeight: "50%",
                overflowY: "scroll",
              }}
            >
              {/* {chatarr?.map((chat, i) => (
                    <div key={i} className={`right-msg my-4`}>
                      <Paper className="msg-text p-2">{chat.message}</Paper>
                    </div>
                  ))} */}
            </div>
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
            <IconButton type="submit" color="primary">
              <Send />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>
    </Navigation>
  );
};

export default MeetingRoom;
