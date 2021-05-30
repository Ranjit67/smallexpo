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
import { Cancel, Telegram } from "@material-ui/icons";
import React, { useState } from "react";
import { Navigation, SelectedChatUser } from "../../components";
import { HelpDeskChat } from "../../components/Chat";
import { useCurrentUser, useWindow } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  DialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  Paper: {
    minHeight: "90vh",
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
  const rows = [
    createData("Name", selectedUser?.name),
    createData("Email", selectedUser?.email),
    createData("Phone", selectedUser?.phone),
  ];
  return (
    <Navigation>
      <Dialog
        fullScreen={fullScreen}
        open={openUserDetails}
        onClose={() => setOpenUserDetails(true)}
      >
        <DialogTitle>{"User Details"}</DialogTitle>
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
                    <TableCell>{row?.data || "Not Provided"}</TableCell>
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
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle style={{ minWidth: "40vw" }}>
          <div className={classes.DialogHeader}>
            <CardHeader
              avatar={
                <Avatar
                  style={{
                    height: "40px",
                    width: "40px",
                  }}
                  alt=""
                  src=""
                />
              }
              title={name}
              subheader={email}
            />

            <IconButton onClick={handleClose}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent style={{ minHeight: "40vw" }} dividers>
          <SelectedChatUser
            name={name}
            email={email}
            helpdesk={true}
            selectedUser={selectedUser}
          />
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
                avatar={<Avatar>H</Avatar>}
                title={currentUserData?.name}
                subheader={currentUserData?.email}
              />
              <Divider />
              <HelpDeskChat
                handleChatUserClick={handleChatUserClick}
                setName={setName}
                setEmail={setEmail}
                setSelectedUser={setSelectedUser}
                selectedUser={selectedUser}
              />
            </Grid>
            {name || email ? (
              windowSize.width > 600 && (
                <Grid item xs={0} sm={7} md={7} lg={8}>
                  <div>
                    <CardHeader
                      avatar={
                        <Avatar
                          alt={selectedUser?.email}
                          src={
                            selectedUser?.ProfilePic || selectedUser?.logoUrl
                          }
                        />
                      }
                      title={selectedUser?.name || "Not Provided"}
                      subheader={selectedUser?.email || "Not Provided"}
                      onClick={() => setOpenUserDetails(true)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <Divider />
                  <SelectedChatUser
                    name={name}
                    email={email}
                    helpdesk={true}
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

export default LiveChat;
