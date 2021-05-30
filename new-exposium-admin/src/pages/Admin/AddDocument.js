import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import React, { useState } from "react";
import Alert from "@material-ui/lab/Alert";
import { useCurrentUser } from "../../hooks";
import { database, storage } from "../../config";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "#d1af4f",
    boxShadow: theme.shadows[5],
    fontSize: 14,
  },
}))(Tooltip);

const AddDocument = () => {
  const classes = useStyles();
  const { currentUserData, currentUserId } = useCurrentUser();
  const [catalog, setCatalog] = useState("");
  const [title, setTitle] = useState("");
  const [catalogUrl, setCatalogUrl] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  const addCatalog = (e) => {
    setCatalogUrl(URL.createObjectURL(e.target.files[0]));
    setCatalog(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      const timestamp = new Date().getTime();
      const storageref = `EXHIBITORS/${currentUserId}/Documents/${timestamp}/${title}.pdf`;
      const res = catalog && (await storage.ref(storageref).put(catalog));
      const catalogUrl = catalog && (await res.ref.getDownloadURL());

      await database.ref(`Users/${currentUserData?.stallID}/Documents/`).push({
        title,
        catalogUrl,
        storageref,
        timestamp: new Date().toLocaleString(),
      });
    } catch (error) {
    } finally {
      setTitle("");
      setCatalogUrl("");
      setOpenBackDrop(false);
    }
  };

  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="xs">
        <Card>
          <Snackbar
            open={showAlert.isOpen}
            autoHideDuration={6000}
            onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          >
            <Alert
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "" })
              }
              severity={showAlert.color}
            >
              {showAlert.msg}
            </Alert>
          </Snackbar>
          <CardContent>
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <CloudUpload />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add Document
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LightTooltip
                      title="Please Upload only PDF file as Documnets"
                      placement="top-start"
                    >
                      <TextField
                        autoComplete="title"
                        name="title"
                        variant="outlined"
                        required
                        fullWidth
                        id="title"
                        label="Document Title"
                        autoFocus
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </LightTooltip>
                  </Grid>

                  <Grid item xs={12}>
                    {catalogUrl && (
                      <iframe
                        title={new Date().getTime()}
                        width="100%"
                        height="100%"
                        style={{ minHeight: "35vh" }}
                        src={catalogUrl}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <LightTooltip
                      title="Please Upload only PDF file as Documnets"
                      placement="top-start"
                    >
                      <Button
                        startIcon={<CloudUpload />}
                        variant="contained"
                        component="label"
                        fullWidth
                      >
                        Upload Document
                        <input type="file" onChange={addCatalog} hidden />
                      </Button>
                    </LightTooltip>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  startIcon={<CloudUpload />}
                >
                  Uplaod
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default AddDocument;
