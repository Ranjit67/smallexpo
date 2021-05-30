import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Telegram, Videocam } from "@material-ui/icons";
import { Layout, SelectedChatUser } from "../../components";
import { PlatformChatUser } from "../../components/Chat";
import { database } from "../../config";
import { useCurrentUser, useWindow } from "../../hooks";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  DialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  Paper: {
    height: "87vh",
    width: "98%",
    border: "2px solid grey",
    margin: "10px",
  },
  ChatUserHeader: {
    boxShadow: "4px 0px 0px #0002",
    height: "90vh",
    cursor: "pointer",
    overflowY: "auto",
  },
  ChatNotFound: {
    height: "100%",
    display: "flex",
    justifyContent: " center",
    alignItems: "center",
  },
  TelegramIconButton: {
    marginBottom: "2vh",
    borderRadius: "50%",
    height: 80,
    width: 80,
  },
  table: {
    minWidth: 550,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function createData(name, data) {
  return { name, data };
}

const LiveChat = () => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { windowSize } = useWindow();
  const { currentUserData } = useCurrentUser();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [selectedUser, setSelectedUser] = useState({});
  const handleClose = () => setOpen(false);
  const handleChatUserClick = () => {
    if (windowSize.width < 600) setOpen(true);
  };

  const [openUserDetails, setOpenUserDetails] = useState(false);

  const [rows, setRows] = useState([]);
  const history = useHistory();
  const [selectedUserData, setSelectedUserData] = useState({});
  useEffect(() => {
    database.ref(`Users/${selectedUser?.id}`).on("value", (snap) => {
      if (snap.exists()) {
        setSelectedUserData(snap.val());
        if (snap.val()?.role === "StallMember") {
          console.log(snap.val()?.stallID);
          database
            .ref(`Users/${snap.val()?.stallID}`)
            .on("value", (snapshot) => {
              if (snapshot.exists()) {
                setRows([
                  createData("Name", snap.val()?.name),
                  createData("Email", snap.val()?.email),
                  createData("Phone", snap.val()?.phone),
                  createData("Gender", snap.val()?.gender),
                  createData("Stall Name", snapshot.val()?.stallName),
                  createData("Company Name", snapshot.val()?.companyName),
                  createData("Category", snapshot.val()?.category),
                ]);
                return;
              }
            });
        }
        if (snap.val()?.role === "stall") {
          setRows([
            createData("Name", snap.val()?.name),
            createData("Email", snap.val()?.email),
            createData("Phone", snap.val()?.phone),
            createData("Gender", snap.val()?.gender),
            createData("Stall Name", snap.val()?.stallName),
            createData("Company Name", snap.val()?.companyName),
            createData("Category", snap.val()?.category),
          ]);
          return;
        }
      }
    });
  }, [selectedUser]);
  console.log(selectedUser);

  return (
    <Layout>
      <Dialog
        fullScreen={fullScreen}
        open={openUserDetails}
        onClose={() => setOpenUserDetails(true)}
      >
        <DialogTitle>
          <CardHeader
            avatar={
              <Avatar
                src={selectedUserData?.logoUrl}
                alt={selectedUserData?.email}
              />
            }
            title={selectedUserData?.name || "Not Provided"}
            subheader={selectedUserData?.email || "Not Provided"}
          />
          <Divider />
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row?.name || "Not Provided"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.data || "Not Provided"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => setOpenUserDetails(false)}
            variant="outlined"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle style={{ padding: 0 }}>
          <div className={classes.DialogHeader}>
            <CardHeader
              avatar={
                <Avatar
                  src={
                    selectedUserData?.logoUrl || selectedUserData?.ProfilePic
                  }
                  alt={selectedUserData?.email}
                />
              }
              title={selectedUserData?.name || "Not Provided"}
              subheader={
                selectedUserData?.role === "stall"
                  ? "Booth Owner"
                  : "Booth Member"
              }
            />
            <IconButton
              disabled={!selectedUserData?.videocallRequest}
              onClick={() => {
                history.push(`/VideoCall/${selectedUser?.id}`);
              }}
              title={
                !selectedUserData?.videocallRequest &&
                "Video Call Disabled By User"
              }
            >
              <Videocam
                color={
                  selectedUserData?.videocallRequest ? "secondary" : "disabled"
                }
              />
            </IconButton>
            <IconButton
              disabled={!selectedUserData?.zoom}
              onClick={() => {
                window.open(selectedUserData?.zoom);
              }}
              title={
                !selectedUserData?.zoom && "No Zoom Link Available For Connect"
              }
            >
              <Avatar
                style={{
                  width: "25px",
                  height: "25px",
                }}
                src="https://st1.zoom.us/static/94185/image/new/home/meetings.png"
              />
            </IconButton>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          {(name || email) && (
            <SelectedChatUser
              name={name}
              email={email}
              selectedUser={selectedUser}
            />
          )}
        </DialogContent>
      </Dialog>
      <Card className={classes.Paper}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={5}
              md={5}
              lg={4}
              className={classes.ChatUserHeader}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={currentUserData?.ProfilePic}
                    alt={currentUserData?.email}
                  />
                }
                title={currentUserData?.name || "Me"}
                subheader={currentUserData?.email}
              />
              <Divider />
              <PlatformChatUser
                handleChatUserClick={handleChatUserClick}
                setName={setName}
                setEmail={setEmail}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            </Grid>
            {name || email ? (
              windowSize.width > 600 && (
                <Grid item xs={1} sm={7} md={7} lg={8}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <>
                      <CardHeader
                        avatar={
                          <Avatar
                            style={{
                              height: "40px",
                              width: "40px",
                              cursor: "pointer",
                            }}
                            alt={selectedUserData?.email}
                            src={
                              selectedUser?.ProfilePic ||
                              selectedUserData?.logoUrl
                            }
                          />
                        }
                        title={
                          selectedUserData?.name ||
                          selectedUserData?.stallName ||
                          "Not Provided"
                        }
                        subheader={selectedUserData?.email || "Not Provided"}
                        onClick={() => setOpenUserDetails(true)}
                      />
                    </>
                    <div>
                      <IconButton
                        disabled={!selectedUserData?.videocallRequest}
                        onClick={() => {
                          history.push(`/VideoCall/${selectedUser?.id}`);
                        }}
                        title={
                          !selectedUserData?.videocallRequest &&
                          "Video Call Disabled By User"
                        }
                      >
                        <Videocam
                          color={
                            selectedUserData?.videocallRequest
                              ? "secondary"
                              : "disabled"
                          }
                        />
                      </IconButton>
                      <IconButton
                        disabled={!selectedUserData?.zoom}
                        onClick={() => {
                          window.open(selectedUserData?.zoom);
                        }}
                        title={
                          !selectedUserData?.zoom &&
                          "No Zoom Link Available For Connect"
                        }
                      >
                        <Avatar
                          style={{
                            width: "25px",
                            height: "25px",
                          }}
                          src="https://st1.zoom.us/static/94185/image/new/home/meetings.png"
                        />
                      </IconButton>
                    </div>
                  </div>
                  <Divider />
                  <SelectedChatUser
                    name={name}
                    email={email}
                    selectedUser={selectedUser}
                  />
                </Grid>
              )
            ) : windowSize.width > 600 ? (
              <CardContent>
                <div
                  style={{
                    width:
                      windowSize.width > 1050
                        ? "350%"
                        : windowSize.width > 850
                        ? "250%"
                        : "150%",
                  }}
                  className={classes.ChatNotFound}
                >
                  <div style={{ textAlign: "center" }}>
                    <Button
                      size="large"
                      color="primary"
                      className={classes.TelegramIconButton}
                    >
                      <Telegram fontSize="large" />
                    </Button>
                    <Typography
                      variant="h4"
                      style={{
                        fontFamily: "cursive",
                      }}
                    >
                      No Chats Found
                    </Typography>
                  </div>
                </div>
              </CardContent>
            ) : (
              <div></div>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default LiveChat;
