import React from "react";
import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import TopBarSide from "./TopBarSide";
import { Menu } from "@material-ui/icons";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

function Topbar({ handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <div>
      <AppBar
        className={classes.appBar}
        style={{ background: "rgb(202 83 83)", color: "whitesmoke" }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <Menu style={{ color: "white" }} />
          </IconButton>

          <Typography variant="h6">Admin Page</Typography>
          <TopBarSide />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Topbar;
