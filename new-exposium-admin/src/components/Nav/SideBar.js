import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Badge,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import {
  ExitToApp,
  ExpandLess,
  ExpandMore,
  HeadsetMic,
} from "@material-ui/icons";
import useMenuList from "../../hooks/useMenuList";
import useCurrentUser from "../../hooks/useCurrentUser";
import { Skeleton } from "@material-ui/lab";
import { useLeadpageData, useVisitors } from "../../hooks";
import { database } from "../../config";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    width: 300,
  },
}));

function Sidebar() {
  const classes = useStyles();
  const { menu } = useMenuList();
  const { leadPageData } = useLeadpageData();
  const { currentUserData, currentUserId } = useCurrentUser();

  const history = useHistory();

  const [unreadMessages, setUnreadMessages] = useState(0);
  const { visitors } = useVisitors();
  useEffect(() => {
    let totalMessages = 0;
    visitors?.forEach((visitor) => {
      const dbRef = `UnreadChats/byStall/${visitor?.id}/${currentUserId}/`;
      database.ref(dbRef).on("value", (snap) => {
        if (snap.exists()) {
          totalMessages += snap.val();
        } else {
          totalMessages += 0;
        }
      });
      setUnreadMessages(totalMessages);
    });
  }, [currentUserId, visitors]);
  return (
    <div>
      <List>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => history.push("/")}
        >
          {leadPageData?.logo ? (
            <img
              src={leadPageData?.logo}
              alt="EXPOSIUM"
              style={{ width: "85%" }}
            />
          ) : (
            <Skeleton variant="rect" width="20vw" height="13vh" />
          )}
        </div>

        <Divider />

        {menu ? (
          menu.map(
            (item, i) =>
              item[currentUserData?.role] && (
                <div key={i}>
                  {item.hasOwnProperty("collapsedItems") ? (
                    <>
                      <ListItem button onClick={item.onClick}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                        {item.collapsed ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse
                        in={item.collapsed}
                        timeout="auto"
                        unmountOnExit
                      >
                        {item.collapsedItems.map((item, i) => {
                          return (
                            <div key={i}>
                              <List component="div" disablePadding>
                                <ListItem
                                  button
                                  component={Link}
                                  to={`/${item.route}`}
                                  className={classes.nested}
                                >
                                  <ListItemIcon>{item.icon}</ListItemIcon>
                                  <ListItemText primary={item.name} />
                                </ListItem>
                              </List>
                            </div>
                          );
                        })}
                      </Collapse>
                    </>
                  ) : (
                    <ListItem button component={Link} to={`/${item.route}`}>
                      <Badge
                        color="secondary"
                        badgeContent={item.name === "Chat" ? unreadMessages : 0}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                      </Badge>
                    </ListItem>
                  )}
                </div>
              )
          )
        ) : (
          <div className={classes.root}>
            <Skeleton />
            <Skeleton animation={false} />
            <Skeleton animation="wave" />
          </div>
        )}
        <Divider />
        <a
          href="https://wa.me/message/BYHFWJKIHHNFC1"
          rel="noreferrer"
          target="_blank"
          style={{ textDecoration: "none", color: "black" }}
        >
          <ListItem button>
            <ListItemIcon>
              <HeadsetMic style={{ color: "greenyellow" }} />
            </ListItemIcon>
            <ListItemText primary="Support" />
          </ListItem>
        </a>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <ExitToApp color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Platform" />
        </ListItem>
      </List>
    </div>
  );
}

export default Sidebar;
