import {
  AppBar,
  Badge,
  Button,
  ClickAwayListener,
  Collapse,
  Drawer,
  Grow,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Popper,
  Toolbar,
} from "@material-ui/core";
import {
  ShoppingCartOutlined,
  ChatOutlined,
  EditOutlined,
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
  Menu,
  PersonOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
  ShoppingBasketOutlined,
  LocalOfferOutlined,
  VerifiedUserOutlined,
  PersonAddOutlined,
  SettingsPowerOutlined,
  Chat,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, database } from "../config";
import { useCurrentUser, useLeadpageData, useVisitedStalls } from "../hooks";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  headerButton: {
    marginRight: "1vw",
  },
}));

const User = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState(false);
  const { currentUserData, currentUserId } = useCurrentUser();

  const { leadPageData } = useLeadpageData();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const anchorRef = useRef(null);
  const toggle = () => setState(!state);
  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpen((prevOpen) => !prevOpen);
  const menu = [
    { label: "Lobby", route: "Lobby" },
    { label: "Exhibitors", route: "AllExhibitors" },
    { label: "Participants", route: "Participants" },
    { label: "Agenda", route: "Agenda" },
    { label: "HelpDesk", route: "HelpDesk" },
    { label: "Auditorium", route: "Auditorium" },
    // { label: "Networking", route: "Networking" },
    { label: "Shop", route: "Shop" },
  ];
  const submenu = [
    {
      label: "View Profile",
      route: "ViewProfile",
      icon: <PersonOutlineOutlined />,
      role: true,
    },
    {
      label: "Edit Profile",
      route: "EditProfile",
      icon: <EditOutlined />,
      role: true,
    },

    {
      label: "My Cart",
      route: "Products",
      icon: <ShoppingCartOutlined />,
      role: false,
    },
    {
      label: "My Bag",
      route: "MyBag",
      icon: <ShoppingBasketOutlined />,
      role: false,
    },
    {
      label: "My Order",
      route: "MyOrder",
      icon: <LocalOfferOutlined />,
      role: false,
    },
    {
      label: "LiveChat",
      route: "LiveChat",
      icon: <ChatOutlined />,
      role: false,
    },
    {
      label: "Setting",
      route: "Setting",
      icon: <SettingsOutlined />,
      role: false,
    },
  ];

  const [unreadMessages, setUnreadMessages] = useState(0);
  const { visitedStall } = useVisitedStalls();
  useEffect(() => {
    let totalMessages = 0;
    visitedStall?.forEach((visitor) => {
      const dbRef = `UnreadChats/byUser/${visitor?.id}/${currentUserId}`;
      database.ref(dbRef).on("value", (snap) => {
        if (snap.exists()) {
          totalMessages = snap.val() + totalMessages;
        } else {
          totalMessages = 0 + totalMessages;
        }
      });
    });
    setUnreadMessages(totalMessages);
  }, [currentUserId, visitedStall]);

  return (
    <div>
      <AppBar position="sticky" color="inherit">
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: "17%" }}>
            <Link to="/">
              {leadPageData?.logo ? (
                <div>
                  <img src={leadPageData?.icon} alt="EXPOSIUM" width="200px" />
                </div>
              ) : (
                <Skeleton animation="pulse" width="18vw" height="10vh" />
              )}
            </Link>
          </div>
          {!auth?.currentUser?.uid ? (
            <div className={classes.sectionDesktop}>
              <Button
                className="headerButton"
                startIcon={<PersonOutlined />}
                component={Link}
                to="/Login"
              >
                Login
              </Button>
              <Button
                className="headerButton"
                startIcon={<PersonAddOutlined />}
                component={Link}
                to="/Register"
              >
                Register
              </Button>
            </div>
          ) : (
            <div className={classes.sectionDesktop}>
              {menu.map((item, i) => (
                <Button
                  key={i}
                  className={classes.headerButton}
                  component={Link}
                  to={`/${item?.route}`}
                >
                  {item?.label}
                </Button>
              ))}
            </div>
          )}
          {auth?.currentUser?.uid && (
            <div className={classes.sectionDesktop}>
              <IconButton onClick={() => history.push("/LiveChat")}>
                <Badge color="secondary" badgeContent={unreadMessages}>
                  <Chat />
                </Badge>
              </IconButton>

              <Button
                style={{ marginLeft: "1vw" }}
                startIcon={<PersonOutlined />}
                endIcon={!open ? <ExpandMore /> : <ExpandLess />}
                ref={anchorRef}
                onClick={handleToggle}
              >
                Profile
              </Button>

              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 9999 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <List>
                          {submenu.map(
                            (item, i) =>
                              !(
                                currentUserData.hasOwnProperty("role") &&
                                item?.role
                              ) && (
                                <ListItem
                                  key={i}
                                  button
                                  onClick={handleClose}
                                  component={Link}
                                  to={`/${item?.route}`}
                                >
                                  <ListItemIcon style={{ color: "#333" }}>
                                    {item?.icon}
                                  </ListItemIcon>
                                  <ListItemText primary={item?.label} />
                                </ListItem>
                              )
                          )}

                          {currentUserData.hasOwnProperty("role") && (
                            <ListItem
                              button
                              component={Link}
                              to="/Dashboard"
                              onClick={handleClose}
                            >
                              <ListItemIcon>
                                <VerifiedUserOutlined />
                              </ListItemIcon>
                              <ListItemText primary="My Panel" />
                            </ListItem>
                          )}

                          <ListItem
                            button
                            onClick={async () => {
                              await database
                                .ref(`Users/${auth?.currentUser?.uid}/isOnline`)
                                .set(false);
                              await auth?.signOut();
                              await history.push("/");
                            }}
                          >
                            <ListItemIcon>
                              <SettingsPowerOutlined color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                          </ListItem>
                        </List>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          )}

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-haspopup="true"
              onClick={toggle}
            >
              <Menu color="primary" />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer open={state} onClose={toggle}>
        <div role="presentation">
          {!auth?.currentUser?.uid ? (
            <div className="loginHeader">
              <ListItem
                button
                onClick={handleClose}
                component={Link}
                to="/Login"
              >
                <ListItemIcon>
                  <PersonOutlined />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem
                button
                onClick={handleClose}
                component={Link}
                to="/Register"
              >
                <ListItemIcon>
                  <PersonAddOutlined />
                </ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </div>
          ) : (
            <div className="loginHeader">
              {menu.map((item, i) => (
                <ListItem
                  key={i}
                  button
                  onClick={handleClose}
                  component={Link}
                  to={`/${item?.route}`}
                >
                  <ListItemIcon>
                    <FiberManualRecord color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={item?.label} />
                </ListItem>
              ))}

              <ListItem button onClick={() => setProfileOpen(!profileOpen)}>
                <ListItemIcon>
                  <FiberManualRecord color="primary" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
                {profileOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={profileOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {submenu.map((item, i) => (
                    <ListItem
                      key={i}
                      button
                      onClick={handleClose}
                      component={Link}
                      to={`/${item?.route}`}
                    >
                      <ListItemIcon>{item?.icon}</ListItemIcon>
                      <ListItemText primary={item?.label} />
                    </ListItem>
                  ))}
                  {currentUserData.hasOwnProperty("role") && (
                    <ListItem
                      button
                      component={Link}
                      to="/Dashboard"
                      onClick={handleClose}
                    >
                      <ListItemIcon>
                        <VerifiedUserOutlined />
                      </ListItemIcon>
                      <ListItemText primary="My Panel" />
                    </ListItem>
                  )}

                  <ListItem
                    button
                    onClick={async () => {
                      await auth?.signOut();
                      await history.push("/");
                    }}
                  >
                    <ListItemIcon>
                      <SettingsPowerOutlined color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItem>
                </List>
              </Collapse>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default User;
