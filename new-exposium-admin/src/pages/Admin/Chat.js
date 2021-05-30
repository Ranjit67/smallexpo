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
import { ArrowBackIos, Telegram } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Navigation, SelectedChatUser } from "../../components";
import { StallChatUser } from "../../components/Chat";
import { database } from "../../config";
import { useCurrentUser, useWindow } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  DialogHeader: {
    display: "flex",
    alignItems: "center",
    width: "90%",
  },
  Paper: {
    minHeight: "80vh",
    width: "100%",
  },
  ChatUserHeader: {
    boxShadow: ".4px 0px 0px #0002",
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

const ChatScreen = () => {
  const classes = useStyles();
  const { windowSize } = useWindow();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { currentUserData } = useCurrentUser();
  const [selectedUser, setSelectedUser] = useState({});
  const handleClose = () => setOpen(false);
  const handleChatUserClick = () => {
    if (windowSize.width < 600) setOpen(true);
  };
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState({});
  useEffect(() => {
    database.ref(`Users/${selectedUser?.id}`).on("value", (snap) => {
      if (snap.exists()) {
        setSelectedUserData(snap.val());

        setRows([
          createData("Name", snap.val()?.name),
          createData("Email", snap.val()?.email),
          createData("Phone", snap.val()?.phone),
          createData("Gender", snap.val()?.gender),
        ]);
      }
    });
  }, [selectedUser?.id]);

  return (
    <Navigation>
      <Dialog
        fullScreen={fullScreen}
        open={openUserDetails}
        onClose={() => setOpenUserDetails(true)}
      >
        <DialogTitle>
          <CardHeader
            avatar={
              <Avatar
                alt={selectedUserData?.email}
                src={selectedUserData?.ProfilePic}
              />
            }
            title={selectedUserData?.name || "Not Provided"}
            subheader={selectedUserData?.email || "Not Provided"}
          />
        </DialogTitle>
        <Divider />
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
        style={{ width: "97%", padding: 0 }}
      >
        <DialogTitle style={{ padding: 0, marginTop: "7vh", width: "97%" }}>
          <div className={classes.DialogHeader}>
            <IconButton onClick={handleClose} color="secondary">
              <ArrowBackIos />
            </IconButton>
            <CardHeader
              avatar={
                <Avatar
                  alt={selectedUserData?.email}
                  src={selectedUserData?.ProfilePic}
                />
              }
              title={selectedUserData?.name || "Not Provided"}
              subheader={selectedUserData?.email || "Not Provided"}
            />
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <SelectedChatUser
            name={name}
            email={email}
            admin={true}
            selectedUser={selectedUser}
          />
        </DialogContent>
      </Dialog>
      <Card className={classes.Paper}>
        <CardContent style={{ height: "100%" }}>
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
                    src={currentUserData?.logoUrl}
                    alt={currentUserData?.email}
                  />
                }
                title={
                  currentUserData?.stallName || currentUserData?.name || "Me"
                }
                subheader={currentUserData?.email}
              />
              <Divider />
              <StallChatUser
                handleChatUserClick={handleChatUserClick}
                setName={setName}
                setEmail={setEmail}
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
              />
            </Grid>
            {name || email ? (
              windowSize.width > 600 && (
                <Grid item xs={1} sm={7} md={7} lg={8}>
                  <>
                    <CardHeader
                      avatar={
                        <Avatar
                          alt={selectedUserData?.email}
                          src={selectedUserData?.ProfilePic}
                          onClick={() => setOpenUserDetails(true)}
                          style={{ cursor: "pointer" }}
                        />
                      }
                      title={selectedUserData?.name || "Not Provided"}
                      subheader={selectedUserData?.email || "Not Provided"}
                    />
                  </>
                  <Divider />
                  <SelectedChatUser
                    name={name}
                    email={email}
                    admin={true}
                    selectedUser={selectedUser}
                  />
                </Grid>
              )
            ) : (
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
            )}
          </Grid>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ChatScreen;
