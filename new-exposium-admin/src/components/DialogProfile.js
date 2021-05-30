import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import parse from "html-react-parser";
import React from "react";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogProfile = ({ profileOpen, setProfileOpen, description }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDocuments = () => setProfileOpen(false);
  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={profileOpen}
        onClose={handleDocuments}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle style={{ minWidth: "40vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",

              width: "100%",
            }}
          >
            <Typography variant="h6">Profile</Typography>
            <IconButton onClick={handleDocuments}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {description ? (
              parse("" + description)
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20vh",
                }}
              >
                <Typography variant="h4">No Video Found</Typography>
              </div>
            )}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogProfile;
