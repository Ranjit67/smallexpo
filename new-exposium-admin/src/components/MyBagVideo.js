import {
  Backdrop,
  CircularProgress,
  Fab,
  Grid,
  Snackbar,
} from "@material-ui/core";
import { Delete, VideoLibraryOutlined } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useState } from "react";
import { auth, database } from "../config";
import { useMyBag } from "../hooks";

const MyBagVideo = () => {
  const uid = auth.currentUser?.uid;
  const { bagVideo } = useMyBag();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });
  const handleDelete = async (id) => {
    try {
      setOpenBackDrop(true);
      await database.ref(`Users/${uid}/MyBag/Video/${id}`).remove();
      setShowAlert({
        msg: "Delete From Your Bag",
        isOpen: true,
        color: "warning",
      });
      if (bagVideo.length < 2) window.location.reload();
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);
    }
  };

  return (
    <div>
      <Backdrop open={openBackDrop} style={{ zIndex: 9999999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
      <Grid
        container
        spacing={2}
        style={{
          minHeight: "45vh",
        }}
      >
        {bagVideo.length ? (
          bagVideo.map((item, i) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={i}>
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
                  style={{ minHeight: "10vh" }}
                  src={
                    "https://www.youtube.com/embed/" +
                    item?.video?.split("/").reverse()[0]
                  }
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <Fab
                  size="small"
                  color="secondary"
                  style={{ marginTop: "8px" }}
                  onClick={() => handleDelete(item?.id)}
                >
                  <Delete />
                </Fab>
              </div>
            </Grid>
          ))
        ) : (
          <div
            style={{
              display: "grid",
              placeContent: "center",
              placeItems: "center",
              width: "100%",
              minHeight: "45vh",
            }}
          >
            <VideoLibraryOutlined fontSize="large" />
            <h1>No Videos Found</h1>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default MyBagVideo;
