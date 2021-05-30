import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Cancel } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { auth, database } from "../config";
import { useMyBag } from "../hooks";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogVideo = ({ videoOpen, setVideoOpen, video }) => {
  const { bagVideo } = useMyBag();
  const [videoArr, setVideoArr] = useState([]);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleVideo = () => setVideoOpen(false);

  useEffect(() => {
    const obj = video;
    const arr = [];
    for (const key in obj)
      arr.push({
        ...obj[key],
      });
    setVideoArr(arr);
    return () => {
      setVideoArr([]);
    };
  }, [video]);
  const handleVideoAdd = async (item) => {
    const arr = bagVideo.filter((ele) => ele.video === item);
    if (arr.length) {
      setShowAlert({
        msg: "Already in Your Bag",
        isOpen: true,
        color: "warning",
      });
    } else {
      try {
        await database
          .ref(`Users/${auth?.currentUser?.uid}/MyBag/Video/`)
          .push(item);
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
  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={videoOpen}
        onClose={handleVideo}
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
            <Typography variant="h6">Video</Typography>
            <IconButton onClick={handleVideo}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ minHeight: "40vw" }} dividers>
          <Snackbar
            open={showAlert.isOpen}
            autoHideDuration={6000}
            onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          >
            <Alert
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "" })
              }
              severity={showAlert?.color}
            >
              {showAlert.msg}
            </Alert>
          </Snackbar>
          <Grid container spacing={2}>
            {videoArr.length ? (
              videoArr.map((item, i) => (
                <Grid item lg={6} md={6} sm={4} xs={12} key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <iframe
                      title={new Date().getTime()}
                      width="100%"
                      height="100%"
                      style={{ minHeight: "10vh", minWidth: "15vw" }}
                      src={
                        "https://www.youtube.com/embed/" +
                        item?.videoLink?.split("/").reverse()[0]
                      }
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <Fab
                      size="small"
                      color="secondary"
                      style={{ marginTop: "8px" }}
                      onClick={() => handleVideoAdd(item?.videoLink)}
                    >
                      <Add />
                    </Fab>
                  </div>
                </Grid>
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20vh",
                }}
              >
                <Typography variant="h4">No Video Found</Typography>
              </div>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogVideo;
