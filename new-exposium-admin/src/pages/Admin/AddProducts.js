import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Add, Close, CloudUpload } from "@material-ui/icons";
import React, { useState } from "react";

import Alert from "@material-ui/lab/Alert";
import { auth, database, storage } from "../../config";
import { Navigation } from "../../components";
import { DropzoneArea } from "material-ui-dropzone";
import { useCurrentUser } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  absolute: {
    position: "fixed",
    bottom: "2vh",
    right: theme.spacing(3),
  },
}));
const placeholderImg =
  "https://firebasestorage.googleapis.com/v0/b/exposium-2021.appspot.com/o/placeholder.png?alt=media&token=5a768d5f-f0ad-49aa-88fe-58f80360b15e";

const AddProducts = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);

  const [productImg, setProductImg] = useState({});
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(``);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleProductImg = (file) => setProductImg(file[0]);

  const handleProductName = (e) => setProductName(e.target.value);

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    if (productImg?.name) {
      try {
        setOpenBackDrop(true);

        const storageRef = `ParticipantsLogo/${Math.floor(
          Math.random() * 100
        )}`;
        const res =
          productImg && (await storage.ref(storageRef).put(productImg));
        const productImgUrl = productImg
          ? await res.ref.getDownloadURL()
          : placeholderImg;

        await database.ref(`Products/`).push({
          productName,
          productPrice,
          productQuantity,
          productImgUrl,
          storageRef,

          category,
          stallName: currentUserData?.stallName,
          stallID: auth?.currentUser?.uid,
        });
        setShowAlert({
          msg: "Product Added Successfully",
          isOpen: true,
          color: "success",
        });
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      } finally {
        setProductName("");
        setProductPrice(0);
        setProductQuantity(0);

        setProductImg({});
        setOpen(false);
        setOpenBackDrop(false);
      }
    } else {
      setShowAlert({
        msg: "Add a Product picture",
        isOpen: true,
        color: "warning",
      });
    }
  };
  return (
    <Navigation>
      <Tooltip title="edit">
        <Fab
          variant="round"
          color="primary"
          className={classes.absolute}
          onClick={handleClickOpen}
        >
          <Add />
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Add Product</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="inherit" />
          </Backdrop>

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

          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleLogoSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="title"
                    name="title"
                    variant="outlined"
                    required
                    fullWidth
                    id="title"
                    label="Product Name"
                    autoFocus
                    type="text"
                    value={productName}
                    onChange={handleProductName}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="price"
                    name="price"
                    variant="outlined"
                    required
                    fullWidth
                    id="price"
                    label="Product Price"
                    autoFocus
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="quantity"
                    name="quantity"
                    variant="outlined"
                    required
                    fullWidth
                    id="quantity"
                    label="Product Quantity"
                    autoFocus
                    type="number"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="Category"
                    select
                    placeholder="Category"
                    variant="outlined"
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value={`IT Service`}>IT Service</MenuItem>
                    <MenuItem value={`Hardware & Networling`}>
                      Hardware & Networling
                    </MenuItem>
                    <MenuItem value={`Health Care`}>Health Care</MenuItem>
                    <MenuItem value={`Other`}>Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <DropzoneArea
                    filesLimit={1}
                    dropzoneText={`Upload Product Image`}
                    onChange={(flie) => handleProductImg(flie)}
                  />
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
        </DialogContent>
      </Dialog>
    </Navigation>
  );
};

export default AddProducts;
