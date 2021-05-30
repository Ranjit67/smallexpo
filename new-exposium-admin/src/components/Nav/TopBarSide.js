import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AccountCircle,
  Mail,
  MoreVert,
  Notifications,
  SettingsPower,
} from "@material-ui/icons";
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { useCurrentUser } from "../../hooks";
import { auth, database } from "../../config";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
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
}));

function TopBarSide() {
  const classes = useStyles();
  const history = useHistory();
  const { currentUserData } = useCurrentUser();
  const [role, setRole] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    switch (currentUserData?.role) {
      case "stall":
        setRole("Booth");

        break;
      case "StallMember":
        setRole("Booth Member");

        break;
      case "helpdesk":
        setRole("HelpDesk");

        break;
      case "superadmin":
        setRole("Super Admin");

        break;

      default:
        setRole("Loading...");
        break;
    }
  }, [currentUserData?.role]);
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <Mail color="action" />
        </ListItemIcon>
        <ListItemText primary={currentUserData?.email || " Loading..."} />
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <AccountCircle color="action" />
        </ListItemIcon>
        <ListItemText primary={role} />
      </MenuItem>

      <MenuItem
        onClick={async () => {
          handleMenuClose();
          await database
            .ref(`Users/${auth?.currentUser?.uid}/isOnline`)
            .set(false);
          await auth.signOut();
          history.push("/");
        }}
      >
        <ListItemIcon>
          <SettingsPower color="secondary" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <Notifications />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  return (
    <div>
      <div className={classes.grow}>
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreVert />
          </IconButton>
        </div>

        {renderMobileMenu}
        {renderMenu}
      </div>
    </div>
  );
}

export default TopBarSide;
