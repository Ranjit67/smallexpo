import React, { useEffect, useState } from "react";
import {
  DialogAppointment,
  DialogDocuments,
  DialogProfile,
  DialogVideo,
  Layout,
} from "../../components";

import { Link } from "react-router-dom";
import { useAllUsersData, useMyBag, useWindow } from "../../hooks";
import LinkIcon from "@material-ui/icons/Link";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Slide,
  Snackbar,
  Typography,
} from "@material-ui/core";
import {
  Add,
  ArrowBack,
  CalendarToday,
  Cancel,
  Chat,
  Contacts,
  Description,
  Forum,
  PlayArrow,
  SyncAlt,
  ThumbsUpDownOutlined,
  VideoCallOutlined,
} from "@material-ui/icons";

import { useParams } from "react-router";
import { auth, database } from "../../config";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  Paper: {
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    position: "absolute",
    bottom: "2vh",
    zIndex: 99,
    boxShadow: "1px 0px 10px #0000001a",
  },
  Header: {
    width: "100%",
    height: "5vh",
    backgroundColor: "#3f51b5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    zIndex: 999,
  },
  Section: {
    width: "90%",
    backgroundColor: "white",
    padding: "15px",
    margin: "10px",
    cursor: "pointer",
    "&:hover": {
      background: "#bfbfbf",
    },
    opacity: 1,
    zIndex: 999,
  },
  Subsection: {
    maxHeight: "30vh",
    width: "100%",
    margin: "5px",
    cursor: "pointer",
    overflowY: "scroll",
    overflowX: "hidden",
  },
}));

const Exhibitors = () => {
  const classes = useStyles();
  const { windowSize } = useWindow();
  const { id } = useParams();
  const { allUsersData } = useAllUsersData();
  const { bagContacts } = useMyBag();
  const [links, setLinks] = useState([]);
  const [stallMember, setStallMember] = useState([]);
  const [stallData, setStallData] = useState({});
  const [videoOpen, setVideoOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openAppointment, setOpenAppointment] = useState(false);
  const [popup, setPopup] = useState(false);
  const [openPopupBody, setOpenPopupBody] = useState(true);
  const [openLink, setOpenLink] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });

  useEffect(() => {
    const arr = allUsersData.filter((item) => item?.id === id);
    const temp = allUsersData.filter((item) => item?.stallID === id);
    setStallMember(temp);
    setStallData(arr[0]);
    return () => {
      setStallData({});
    };
  }, [allUsersData, id]);

  useEffect(() => {
    const obj = stallData?.Links;
    const arr = [];
    if (obj) {
      for (const key in obj)
        arr.push({
          id: key,
          ...obj[key],
        });
      setLinks(arr);
    }
    return () => {
      setLinks([]);
    };
  }, [stallData?.Links]);

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
  stallMember.sort((x) => (x.isOnline ? -1 : 1));

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
      <div style={{ height: "90vh" }}>
        <DialogVideo
          videoOpen={videoOpen}
          setVideoOpen={setVideoOpen}
          video={stallData?.Video}
        />
        <DialogDocuments
          documentsOpen={documentsOpen}
          setDocumentsOpen={setDocumentsOpen}
          documents={stallData?.Documents}
        />
        <DialogProfile
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          description={stallData?.description}
        />
        <DialogAppointment
          openAppointment={openAppointment}
          setOpenAppointment={setOpenAppointment}
          stallID={stallData?.stallID}
        />

        <Slide direction="left" in={popup} mountOnEnter unmountOnExit>
          <div
            style={{
              width:
                windowSize.width > 700
                  ? "33vw"
                  : windowSize.width > 600
                  ? "55vw"
                  : "90vw",
              left:
                windowSize.width > 700
                  ? "66vw"
                  : windowSize.width > 600
                  ? "44vw"
                  : "9vw",
            }}
            className={classes.Paper}
          >
            <div className={classes.Header}>
              <IconButton>
                <ThumbsUpDownOutlined style={{ color: "white" }} />
              </IconButton>
              <Typography style={{ color: "white", marginLeft: "5px" }}>
                Let's Connect
              </Typography>
              {openLink || openChat ? (
                <IconButton
                  onClick={() => {
                    setOpenLink(false);
                    setOpenChat(false);
                    setOpenPopupBody(true);
                  }}
                >
                  <ArrowBack style={{ color: "white" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setPopup(!popup);
                    setOpenLink(false);
                    setOpenChat(false);
                  }}
                >
                  <Cancel style={{ color: "white" }} />
                </IconButton>
              )}
            </div>
            {openPopupBody && (
              <CardContent className={classes.Body}>
                <Card
                  className={classes.Section}
                  onClick={() => {
                    setOpenPopupBody(false);
                    setOpenChat(true);
                    setOpenLink(false);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>Chat with Us</Typography>
                    <Chat fontSize="large" color="primary" />
                  </div>
                </Card>
                <Card
                  onClick={() => {
                    setOpenAppointment(true);
                    setPopup(false);
                  }}
                  className={classes.Section}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>Make Appointment</Typography>
                    <CalendarToday fontSize="large" color="primary" />
                  </div>
                </Card>
                <Card
                  className={classes.Section}
                  onClick={() => {
                    setOpenPopupBody(false);
                    setOpenChat(false);
                    setOpenLink(true);
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>Link</Typography>
                    <LinkIcon fontSize="large" color="primary" />
                  </div>
                </Card>
              </CardContent>
            )}

            {openLink && (
              <CardContent className={classes.Subsection}>
                {links.length ? (
                  links.map((item, i) => (
                    <CardActionArea
                      key={i}
                      className={classes.Section}
                      href={item?.url}
                      target="_blank"
                      style={{ width: windowSize.width > 600 ? "90%" : "70%" }}
                    >
                      <Typography>{item?.linkTitle}</Typography>
                    </CardActionArea>
                  ))
                ) : (
                  <CardActionArea
                    className={classes.Section}
                    style={{ width: windowSize.width > 600 ? "90%" : "70%" }}
                  >
                    <Typography>No Links Found</Typography>
                  </CardActionArea>
                )}
              </CardContent>
            )}
            {openChat && (
              <CardContent
                className={classes.Subsection}
                style={{ padding: 0 }}
              >
                {stallMember.map(
                  (item, i) =>
                    (item?.isActive || item?.id === id) && (
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
                              <Avatar
                                alt=""
                                src={item?.ProfilePic || item?.logoUrl}
                              />
                            </Badge>
                          }
                          title={
                            item?.name || item?.stallName || "Not Provided"
                          }
                          subheader={
                            item?.id === id ? "Booth Owner" : "Booth member "
                          }
                        />
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {item?.zoom && (
                            <IconButton
                              disabled={!item?.videocallRequest}
                              onClick={() => {
                                window.open(item?.zoom);
                              }}
                              title={
                                !item?.zoom &&
                                "No Zoom Link Available For Connect"
                              }
                            >
                              {item?.videocallRequest ? (
                                <Avatar
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                  }}
                                  src="https://st1.zoom.us/static/94185/image/new/home/meetings.png"
                                />
                              ) : (
                                <Avatar
                                  style={{
                                    width: "25px",
                                    height: "25px",
                                  }}
                                  src="https://firebasestorage.googleapis.com/v0/b/university-of-sharjah-open-day.appspot.com/o/zoom%20grray%20colour.png?alt=media&token=be3cdcce-9d83-4139-b74b-fa1fd620be66"
                                />
                              )}
                            </IconButton>
                          )}

                          <IconButton
                            disabled={!item?.videocallRequest}
                            component={Link}
                            to={`/VideoCall/${item?.id}`}
                          >
                            <VideoCallOutlined
                              color={
                                item?.videocallRequest ? "secondary" : "default"
                              }
                            />
                          </IconButton>
                          <IconButton
                            component={Link}
                            to={`/LiveChat/${item?.id}`}
                          >
                            <Forum color="primary" />
                          </IconButton>

                          <IconButton
                            onClick={() => handleAddContact(item?.id)}
                          >
                            <Add />
                          </IconButton>
                        </div>
                      </Card>
                    )
                )}
              </CardContent>
            )}
          </div>
        </Slide>

        <div>
          {stallData?.bannerUrl ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {windowSize?.width > 500 ? (
                <img
                  src={stallData?.bannerUrl}
                  alt=""
                  style={{ width: "70vw", height: "auto" }}
                />
              ) : (
                <img
                  src={stallData?.logoUrl}
                  alt=""
                  width="70%"
                  style={{ marginBottom: "6vh" }}
                />
              )}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
              }}
            >
              <h2>Not Found</h2>
            </div>
          )}

          {windowSize.width > 600 && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
                height: "3vh",
              }}
            >
              <Typography variant="h4">{stallData?.stallName}</Typography>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "4vh",
              flexDirection: windowSize?.width > 500 ? "row" : "column",
            }}
          >
            {/* <Button
                variant="contained"
                color="secondary"
                style={{ margin: "10px" }}
              >
                <Add color="inherit" />
              </Button> */}
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: "10px", width: "180px" }}
              onClick={() => setVideoOpen(true)}
              startIcon={<PlayArrow />}
            >
              Videos
            </Button>
            <Button
              variant="contained"
              style={{
                margin: "10px",
                backgroundColor: "#AA66CC",
                color: "whitesmoke",
                width: "180px",
              }}
              onClick={() => setDocumentsOpen(true)}
              startIcon={<Description />}
            >
              Documents
            </Button>
            <Button
              variant="contained"
              // color="secondary"
              style={{
                margin: "10px",
                backgroundColor: "green",
                color: "whitesmoke",
                width: "180px",
              }}
              onClick={() => setProfileOpen(true)}
              startIcon={<Contacts />}
            >
              Profile
            </Button>

            <Button
              variant="contained"
              color="primary"
              style={{ margin: "10px", width: "180px" }}
              onClick={() => setPopup(!popup)}
              startIcon={<SyncAlt />}
            >
              Let's Connect
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Exhibitors;
