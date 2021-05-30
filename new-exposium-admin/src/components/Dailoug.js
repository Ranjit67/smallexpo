import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Close, Edit } from "@material-ui/icons";
import { DropzoneArea } from "material-ui-dropzone";
import { database, storage } from "../config";
import { useLeadpageData } from "../hooks";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: "2vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  DialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialog: {
    minWidth: "40%",
    minHeight: "80vh",
  },
  input: {
    display: "none",
  },
  absolute: {
    position: "fixed",
    bottom: "2vh",
    right: theme.spacing(3),
  },
  alert: {
    zIndex: theme.zIndex.drawer + 9,
  },
  backdrop: {
    zIndex: 99999999999999999999999,
    color: "#fff",
  },
  imgSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1vh",
  },
}));

const Dailoug = () => {
  const classes = useStyles();
  const { leadPageData } = useLeadpageData();
  const [open, setOpen] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [textvalue, setTextvalue] = useState("");
  const [dateTime, setDateTime] = useState();
  const [imageBanner, setImageBanner] = useState({});
  const [imageLogo, setImageLogo] = useState({});
  const [imageIcon, setImageIcon] = useState({});

  const [openBackDrop, setOpenBackDrop] = useState(false);

  useEffect(() => {
    leadPageData?.dateTime && setDateTime(leadPageData?.dateTime);
    leadPageData?.title && setTitleValue(leadPageData?.title);
    leadPageData?.description && setTextvalue(leadPageData?.description);
  }, [leadPageData]);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImage = (file, MaxSize, img) => {
    if (file) {
      const size = Math.round(file.size / 1024);
      if (size > MaxSize) {
        alert(
          `Sorry, you have chosen wrong image size. Kindly choose an image of size lesser ${MaxSize}KB for uploading. The preview shown is not uploaded to the database due to wrong size.`
        );
      } else {
        setImageLogo(file);
        switch (img) {
          case "Banner":
            setImageBanner(file);
            break;
          case "OrganizerLogo":
            setImageLogo(file);
            break;
          case "Icon":
            setImageIcon(file);
            break;

          default:
            break;
        }
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      const bannerStorageRef = `LeadPageData/Banner`;
      const logoStorageRef = `LeadPageData/Logo`;
      const iconStorageRef = `LeadPageData/Icon`;

      const bannerRes =
        imageBanner?.name &&
        (await storage.ref(bannerStorageRef).put(imageBanner));
      const bannerUrl =
        imageBanner?.name && (await bannerRes.ref.getDownloadURL());

      const logoRes =
        imageLogo?.name && (await storage.ref(logoStorageRef).put(imageLogo));
      const logoUrl = imageLogo?.name && (await logoRes.ref.getDownloadURL());

      const iconRes =
        imageIcon?.name && (await storage.ref(iconStorageRef).put(imageIcon));
      const iconUrl = imageIcon?.name && (await iconRes.ref.getDownloadURL());

      await database.ref(`Helpdesk/LeadPageData/`).set({
        title: titleValue,
        description: textvalue,
        dateTime: dateTime,
        banner: bannerUrl || leadPageData?.banner || "banner",
        logo: logoUrl || leadPageData?.logo || "Logo",
        icon: iconUrl || leadPageData?.icon || "Icon",
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setTitleValue("");
      setTextvalue("");
      setDateTime("");
      setImageBanner("");
      setImageLogo("");
      setImageIcon("");
      setOpen(false);
      setOpenBackDrop(false);
    }
  };
  return (
    <>
      <Tooltip title="edit">
        <Fab
          variant="round"
          color="primary"
          className={classes.absolute}
          onClick={handleClickOpen}
        >
          <Edit />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        classes={{
          paper: classes.dialog,
        }}
      >
        <DialogTitle>
          <div className={classes.DialogHeader}>
            <Typography variant="h6">Lead Page Data</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <form onSubmit={handleAdd}>
            <div className={classes.paper}>
              <TextField
                type="text"
                label="Title"
                fullWidth
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                variant="outlined"
              />
            </div>
            <div
              style={{
                marginBottom: "1vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                required
                type="text"
                fullWidth
                label={dateTime ? "" : "Date & Time"}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                variant="outlined"
              />
            </div>
            <div
              style={{
                marginBottom: "2vh",
                width: "100%",
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                data={`${textvalue}`}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setTextvalue(data);
                }}
              />
            </div>

            <div className={classes.imgSection}>
              <DropzoneArea
                filesLimit={1}
                dropzoneText={`Please Upload Event Banner`}
                value={imageBanner}
                onChange={(file) => handleImage(file[0], 300, "Banner")}
              />
            </div>
            <div className={classes.imgSection}>
              <DropzoneArea
                filesLimit={1}
                dropzoneText={`Please Upload Organiser Logo`}
                value={imageLogo}
                onChange={(flie) => handleImage(flie[0], 200, "OrganizerLogo")}
              />
            </div>

            <div className={classes.imgSection}>
              <DropzoneArea
                filesLimit={1}
                dropzoneText={`Please Upload Icon`}
                value={imageIcon}
                onChange={(flie) => handleImage(flie[0], 100, "Icon")}
              />
            </div>
            <Button fullWidth type="submit" color="primary" autoFocus>
              Add Lead PageData
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dailoug;
