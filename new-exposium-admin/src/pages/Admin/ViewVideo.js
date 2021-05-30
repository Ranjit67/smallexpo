import {
  Backdrop,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { useCurrentUser, useVideo } from "../../hooks";
import { database } from "../../config";
import { Navigation } from "../../components";
import { AddVideo } from ".";

const ViewVideo = () => {
  const { currentUserData } = useCurrentUser();
  const { video } = useVideo();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  const handleDelete = async (vid) => {
    try {
      setOpenBackDrop(true);
      await database
        .ref(`Users/${currentUserData?.stallID}/Video/${vid}`)
        .remove();
      setShowAlert({
        msg: "Video Deleted Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);
    }
  };

  return (
    <Navigation>
      <Backdrop open={openBackDrop} style={{ zIndex: 99999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
      >
        <Alert
          onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          severity={showAlert.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {video &&
          video.map((item, i) => (
            <Grid item lg={4} md={6} sm={12} xs={12} key={i}>
              <Card>
                <CardHeader title={item?.videoTitle} />
                <Divider />
                <CardContent>
                  <iframe
                    title={new Date().getTime()}
                    width="100%"
                    height="100%"
                    style={{ minHeight: "35vh" }}
                    src={
                      "https://www.youtube.com/embed/" +
                      item?.videoLink?.split("/").reverse()[0]
                    }
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </CardContent>
                <CardActionArea
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <IconButton onClick={(e) => handleDelete(item?.id)}>
                    <Delete color="secondary" />
                  </IconButton>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
      <AddVideo />
    </Navigation>
  );
};

export default ViewVideo;
