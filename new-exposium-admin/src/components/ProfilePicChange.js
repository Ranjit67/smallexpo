import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, CloudUpload } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useState } from "react";
import { auth, database, storage } from "../config";
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProfilePicChange = ({ openPic, setOpenPic }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [picFile, setPicFile] = useState({});
  

  const handleClose = () => setOpenPic(false);
  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);

      const storageRef = `Users/${auth?.currentUser?.uid}/ProfilePic`;
      const res = picFile?.name && (await storage.ref(storageRef).put(picFile));
      const ImgUrl = picFile?.name ? await res.ref.getDownloadURL() : "";
      ImgUrl &&
        (await database
          .ref(`Users/${auth?.currentUser?.uid}/ProfilePic`)
          .set(ImgUrl));
    } catch (error) {
    } finally {
      setOpenBackDrop(false);
      setOpenPic(false);
    }
  };
  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={openPic}
        onClose={handleClose}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minWidth: "20vw",
            }}
          >
            <Typography variant="h6">Upload Profile Pic</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleProfilePicSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DropzoneArea
                    filesLimit={1}
                    dropzoneText={`Upload Product Image`}
                    onChange={(flie) => setPicFile(flie[0])}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUpload />}
                >
                  Uplaod
                </Button>
              </Grid>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePicChange;
