import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Edit, Save } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DropzoneArea } from "material-ui-dropzone";
import { useCountry, useCurrentUser } from "../../hooks";
import { auth, database, storage } from "../../config";
import { Navigation } from "../../components";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
  formControl: {
    minWidth: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const UpdateStall = () => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { countries } = useCountry();
  const email = auth?.currentUser?.email;
  const uid = auth?.currentUser?.uid;
  const { currentUserData } = useCurrentUser();
  const [type, setType] = useState("");
  const [sName, setSName] = useState("");
  const [cName, setCName] = useState("");
  const [des, setDes] = useState("");
  const [country, setCountry] = useState({});
  const [logo, setLogo] = useState({});
  const [boothImg, setBoothImg] = useState({});

  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);

  const [dialog, setDialog] = useState("");
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  useEffect(() => {
    if (currentUserData) {
      currentUserData?.category && setType(currentUserData?.category);
      currentUserData?.companyName && setCName(currentUserData?.companyName);
      currentUserData?.description && setDes(currentUserData?.description);
      currentUserData?.stallName && setSName(currentUserData?.stallName);
      currentUserData?.country && setCountry(currentUserData?.country);
    }
  }, [currentUserData]);

  const handleChange = (event) => setType(event.target.value);
  const handlesName = (e) => setSName(e.target.value);
  const handlecName = (e) => setCName(e.target.value);
  const handleCountry = (e, value) => setCountry(value);
  const handleClose = () => setOpen(false);
  const handleLogo = (file) => {
    if (file) {
      const size = Math.round(file.size / 1024);

      if (size < 350) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          if (false) {
            // this.width > 2500 || this.height > 2500
            setDialog(
              `Sorry, You have chosen a wrong image size. Kindly choose an
              image of size lesser than width 300px and Height 200px
              for uploading.`
            );
            setOpen(true);
          } else {
            setLogo(file);
          }
        };
        img.src = url;
      } else {
        setDialog(
          "Sorry, You have chosen a wrong image size. Kindly choose an image of size lesser than 350KB."
        );
        setOpen(true);
      }
    }
  };
  const handleBoothImg = (file) => {
    if (file) {
      const size = Math.round(file.size / 1024);

      if (size < 2000) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          if (this.width > 1000 || this.height > 500) {
            setDialog(
              `Sorry, You have chosen a wrong image size. Kindly choose an
              image of size lesser than width 1000px and Height 500px
              for uploading.`
            );
            setOpen(true);
          } else {
            setBoothImg(file);
          }
        };
        img.src = url;
      } else {
        setDialog(
          "Sorry, You have chosen a wrong image size. Kindly choose an image of size lesser than 2MB."
        );
        setOpen(true);
      }
    }
  };

  const handleInfo = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      const logoRef = `EXHIBITORS/${uid}/logo`;
      const bannerRef = `EXHIBITORS/${uid}/banner`;
      const logoRes = logo?.name && (await storage.ref(logoRef).put(logo));
      const logoUrl = logo?.name && (await logoRes.ref.getDownloadURL());
      const bannerRes =
        boothImg?.name && (await storage.ref(bannerRef).put(boothImg));
      const bannerUrl =
        boothImg?.name && (await bannerRes.ref.getDownloadURL());

      sName && (await database.ref(`Users/${uid}/stallName`).set(sName));
      cName && (await database.ref(`Users/${uid}/companyName`).set(cName));
      type && (await database.ref(`Users/${uid}/category`).set(type));
      des && (await database.ref(`Users/${uid}/description`).set(des));
      country && (await database.ref(`Users/${uid}/country`).set(country));
      email && (await database.ref(`Users/${uid}/email`).set(email));
      logoUrl && (await database.ref(`Users/${uid}/logoUrl`).set(logoUrl));
      bannerUrl &&
        (await database.ref(`Users/${uid}/bannerUrl`).set(bannerUrl));

      setShowAlert({ msg: "Details Updated", isOpen: true, color: "success" });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);
    }
  };
  const [menuItem] = useState(["University", "College", "Company", "Other"]);

  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" maxWidth="sm">
        <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6">
                {/* Sorry, You have chosen a wrong image size. Kindly choose an
                image of size lesser than width 1000px and Height 500px
                for uploading. */}
                {dialog}
              </Typography>
              <br />
              <Typography variant="subtitle1" style={{ color: "red" }}>
                *The preview shown is not uploaded to the database due to wrong
                size.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>

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
                <Edit />
              </Avatar>
              <Typography component="h1" variant="h5">
                Edit Your Info
              </Typography>
              <form className={classes.form} onSubmit={handleInfo}>
                <Grid container spacing={2}>
                  <Grid item sm={7} xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={email}
                      type="email"
                      disabled
                    />
                  </Grid>
                  <Grid item sm={5} xs={12}>
                    {countries && (
                      <Autocomplete
                        options={countries}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, value) => handleCountry(e, value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={country?.label}
                            variant="outlined"
                            placeholder={country?.label}
                          />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="Sname"
                      name="SName"
                      variant="outlined"
                      required
                      fullWidth
                      id="SName"
                      label="Stall Name"
                      autoFocus
                      value={sName}
                      onChange={handlesName}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      autoComplete="cname"
                      name="CName"
                      variant="outlined"
                      required
                      fullWidth
                      id="CName"
                      label="Company Name"
                      autoFocus
                      value={cName}
                      onChange={handlecName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <InputLabel
                        id="select-label"
                        style={{ marginLeft: "10px" }}
                      >
                        {" "}
                        Select Category
                      </InputLabel>
                      <Select
                        variant="outlined"
                        required
                        labelId="type"
                        id="select-label"
                        label="Business Name"
                        value={type}
                        fullWidth
                        onChange={handleChange}
                      >
                        {menuItem.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    {/* <TextField
                      multiline
                      rows={3}
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="description"
                      label="Description"
                      name="description"
                      autoComplete="description"
                      autoFocus
                      value={des}
                      onChange={handleDes}
                    /> */}
                    <CKEditor
                      editor={ClassicEditor}
                      data={`${des}`}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setDes(data);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DropzoneArea
                      filesLimit={1}
                      dropzoneText={`Upload Your Company Logo (300 X 200) Maximumsize:350KB`}
                      onChange={(flie) => handleLogo(flie[0])}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DropzoneArea
                      filesLimit={1}
                      dropzoneText={`Upload Your Booth Design (1000 X 500) Maximumsize:2MB`}
                      onChange={(flie) => handleBoothImg(flie[0])}
                    />
                  </Grid>
                </Grid>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default UpdateStall;
