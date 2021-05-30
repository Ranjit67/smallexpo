import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Delete, Search } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { AddProducts } from ".";
import { Navigation } from "../../components";
import { auth, database } from "../../config";
import { useProducts, useWindow } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0px 10px 0px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const Products = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const { allProducts } = useProducts();
  const { windowSize } = useWindow();
  const [searchTxt, setSearchTxt] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [productsArr, setProductsArr] = useState([]);
  const [openBackDrop, setOpenBackDrop] = useState(false);

  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });

  useEffect(() => {
    if (searchTxt) {
      const arr = productsArr.filter((stall) =>
        stall?.productName?.toUpperCase().includes(searchTxt.toUpperCase())
      );
      setSearchRes(arr);
    } else setSearchRes(productsArr);
    return () => {
      setSearchRes([]);
    };
  }, [productsArr, searchTxt]);

  useEffect(() => {
    const arr = allProducts.filter((item) => item.stallID === uid);
    setProductsArr(arr);
    return () => {
      setProductsArr([]);
    };
  }, [allProducts, uid]);

  const handleDelete = async (key) => {
    try {
      setOpenBackDrop(true);
      await database.ref(`Products/${key}`).remove();

      setShowAlert({
        msg: "Product Deleted Successfully",
        isOpen: true,
        color: "warning",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);
    }
  };

  return (
    <Navigation>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
      >
        <Alert
          onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          severity={showAlert.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          component="form"
          className={classes.root}
          style={{ width: "60%" }}
        >
          <IconButton type="submit" className={classes.iconButton}>
            <Search />
          </IconButton>
          <InputBase
            placeholder="Enter Products Name Here"
            fullWidth
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
          />
        </Paper>
      </div>

      <Divider style={{ width: "10px" }} />

      <div style={{ margin: "10px" }}>
        <Grid container spacing={2}>
          {searchRes &&
            searchRes.map((item, i) => {
              return (
                <Grid item lg={3} md={4} sm={6} xs={12} key={i}>
                  <Card
                    style={{
                      borderRadius: "15px",
                      border: "1px solid grey",
                      height: "40vh",
                    }}
                  >
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={item?.productImgUrl}
                        alt={item?.productName}
                        width="50%"
                        height="50%"
                        style={{ height: "15vh" }}
                      />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          marginTop: "20px",
                          lineHeight: "1px",
                        }}
                      >
                        <div
                          style={{
                            lineHeight: "15px",
                            margin: "5px 0px 0px 15px",
                          }}
                        >
                          <Typography variant="h6" style={{ color: "black" }}>
                            <b>{item?.productName}</b>
                          </Typography>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              style={{
                                color: "#150c0c8c",
                                fontSize: "15px",
                                fontWeight: "lighter",
                              }}
                            >
                              Price :{item?.productPrice}/-
                            </Typography>
                            <Typography
                              style={{
                                color: "#150c0c8c",
                                fontSize: "15px",
                                fontWeight: "lighter",
                              }}
                            >
                              Quantity : {item?.productQuantity}
                            </Typography>
                          </div>
                          <Typography
                            style={{
                              color: "#150c0c8c",
                              fontSize: "15px",
                              fontWeight: "lighter",
                            }}
                          >
                            Catagory : {item?.category}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleDelete(item?.key)}
                        endIcon={<Delete color="inherit" />}
                        color="secondary"
                        style={{
                          color: "white",
                          borderRadius: "8px",
                          margin: "0px 5px 20px 5px",
                          marginBottom: "20px",
                          marginLeft: windowSize.width > 450 ? "20px" : "5px",
                          marginRight: windowSize.width > 450 ? "20px" : "5px",
                        }}
                      >
                        <Typography variant="subtitle2">Remove</Typography>
                      </Button>
                    </div>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </div>
      <AddProducts />
    </Navigation>
  );
};

export default Products;
