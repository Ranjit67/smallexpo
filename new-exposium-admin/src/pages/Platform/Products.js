import {
  Backdrop,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Close, Delete, Search } from "@material-ui/icons";
import { Alert, Autocomplete } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Layout } from "../../components";
import { auth, database } from "../../config";
import { useMyBag, useProducts, useWindow } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Products = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const { windowSize } = useWindow();

  const { allProducts } = useProducts();
  const [searchTxt, setSearchTxt] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [productsArr, setProductsArr] = useState([]);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const { bagProducts } = useMyBag();
  const [stallName, setStallName] = useState("");
  const [category, setCategory] = useState("");
  const [stallList, setStallList] = useState([]);
  const [view, setView] = useState({
    key: null,
    show: false,
  });

  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
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
    if (stallName) {
      const arr = productsArr.filter((stall) =>
        stall?.stallName?.toUpperCase().includes(stallName.toUpperCase())
      );
      setSearchRes(arr);
    } else setSearchRes(productsArr);
    return () => {
      setSearchRes([]);
    };
  }, [productsArr, stallName]);
  useEffect(() => {
    if (category) {
      const arr = productsArr.filter((stall) =>
        stall?.category?.toUpperCase().includes(category.toUpperCase())
      );
      setSearchRes(arr);
    } else setSearchRes(productsArr);
    return () => {
      setSearchRes([]);
    };
  }, [category, productsArr]);

  const handleAdd = async (item, i) => {
    try {
      setOpenBackDrop(true);
      await database.ref(`Users/${uid}/MyBag/Products/`).push({
        ...item,
        quantity: 1,
      });

      setShowAlert({
        msg: "Product Added Successfully",
        isOpen: true,
        color: "success",
      });
    } catch (error) {
      setShowAlert({ msg: error.message, isOpen: true, color: "error" });
    } finally {
      setOpenBackDrop(false);
    }
  };
  const handleDelete = async (key) => {
    try {
      setOpenBackDrop(true);
      await database.ref(`Users/${uid}/MyBag/Products/${key}`).remove();

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

  useEffect(() => {
    setProductsArr(allProducts);
    return () => {
      setProductsArr([]);
    };
  }, [allProducts, bagProducts]);
  const catagory = [
    "IT Service",
    "Hardware & Networling",
    "Health Care",
    "Other",
  ];
  useEffect(() => {
    const arr = [];

    allProducts.forEach((item) => {
      // if (!stallList.includes(item?.stallName)) {
      //   setStallList([...stallList, item?.stallName]);
      //}
      arr.push(item?.stallName);
    });
    let uniq = Array.from(new Set(arr));
    setStallList(uniq);
  }, [allProducts]);

  return (
    <Layout>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "info" })}
      >
        <Alert
          onClose={() =>
            setShowAlert({ msg: "", isOpen: false, color: "info" })
          }
          severity={showAlert.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>
      <div
        style={{
          width: "95%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper
              component="form"
              className={classes.root}
              style={{ width: "98%" }}
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
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            <Autocomplete
              id="stallList"
              options={stallList}
              getOptionLabel={(option) => option}
              onChange={(e, value) => setStallName(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stall Name"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={6}>
            {catagory && (
              <Autocomplete
                id="Catagory"
                options={catagory}
                getOptionLabel={(option) => option}
                onChange={(e, value) => setCategory(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Catagory"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
      </div>

      <Divider style={{ width: "10px" }} />
      <div style={{ margin: "10px" }}>
        <Grid container spacing={2}>
          {searchRes &&
            searchRes.map((item, i) => {
              // const obj = bagProducts.find(
              //   ({ productID }) => item.key === productID
              // );
              const arr = bagProducts.filter(
                (ele) => item.key === ele.productID
              );
 
              return (
                <Grid item lg={2} md={3} sm={4} xs={6} key={i}>
                  {!(view.key === i && view.show) ? (
                    <Card
                      style={{ borderRadius: "15px", border: "1px solid grey" }}
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
                          onClick={() => setView({ key: i, show: true })}
                        />
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            marginTop: "20px",
                          }}
                        >
                          <Typography variant="subtitle1">
                            <b>{item?.productName}</b>
                          </Typography>
                          <Typography variant="subtitle1">
                            {`Rs:${item?.productPrice}/-`}
                          </Typography>
                        </div>
                      </CardContent>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {!arr[0] ? (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleAdd(item)}
                            endIcon={<Add color="inherit" />}
                            style={{
                              backgroundColor: "#008ecc",
                              color: "white",
                              borderRadius: "8px",
                              margin: "0px 5px 20px 5px",
                              marginBottom: "20px",
                              marginLeft:
                                windowSize.width > 450 ? "20px" : "5px",
                              marginRight:
                                windowSize.width > 450 ? "20px" : "5px",
                            }}
                          >
                            <Typography variant="subtitle2">
                              Add to Cart
                            </Typography>
                          </Button>
                        ) : (
                          // <IconButton onClick={() => handleDelete(arr[0]?.id)}>
                          //   <Delete color="secondary" />
                          // </IconButton>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleDelete(arr[0]?.id)}
                            endIcon={<Delete color="inherit" />}
                            color="secondary"
                            style={{
                              color: "white",
                              borderRadius: "8px",
                              margin: "0px 5px 20px 5px",
                              marginBottom: "20px",
                              marginLeft:
                                windowSize.width > 450 ? "20px" : "5px",
                              marginRight:
                                windowSize.width > 450 ? "20px" : "5px",
                            }}
                          >
                            <Typography variant="subtitle2">Remove</Typography>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ) : (
                    <Card
                      style={{
                        height: "36vh",
                        overflowY: "scroll",
                        borderRadius: "15px",
                        border: "1px solid grey",
                      }}
                    >
                      <CardHeader title="Description" />
                      <CardContent
                        style={{ minHeight: "27vh", overflowY: "scroll" }}
                      >
                        <Typography component="span" variant="h6">
                          {item?.description || "Not Provided"}
                        </Typography>
                      </CardContent>
                      <CardActionArea>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {!arr[0] ? (
                            <IconButton onClick={() => handleAdd(item?.key)}>
                              <Add color="secondary" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleDelete(arr[0]?.id)}
                            >
                              <Delete color="secondary" />
                            </IconButton>
                          )}
                          <IconButton
                            onClick={() => setView({ key: null, show: false })}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      </CardActionArea>
                    </Card>
                  )}
                </Grid>
              );
            })}
        </Grid>
      </div>
    </Layout>
  );
};

export default Products;
