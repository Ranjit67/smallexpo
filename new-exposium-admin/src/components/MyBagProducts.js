import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { auth, database } from "../config";
import { useMyBag, useWindow } from "../hooks";

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
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  gridCenter: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
}));

const MyBagProducts = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;
  const { windowSize } = useWindow();
  const { bagProducts } = useMyBag();
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "info",
  });

  useEffect(() => {
    let subTotal = 0;
    bagProducts.forEach((item) => {
      let total = item?.quantity * item?.productPrice;
      subTotal += total;
    });
    setTotalPrice(subTotal);
  }, [bagProducts]);

  const handleIncrement = async (id, Quantity) => {
    if (Quantity < 10) {
      try {
        await database
          .ref(`Users/${uid}/MyBag/Products/${id}/quantity`)
          .set(Quantity + 1);
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Maximum Product Reached",
      });
    }
  };
  const handleDecrement = async (id, Quantity) => {
    if (Quantity > 1) {
      try {
        await database
          .ref(`Users/${uid}/MyBag/Products/${id}/quantity`)
          .set(Quantity - 1);
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Remove It from Cart",
      });
    }
  };

  return (
    <div>
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
          margin: "10vh 0vw 10vh 7vw",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h3">My Cart</Typography>
        <Typography variant="subtitle1" style={{ margin: "0px 0px 6px 20px" }}>
          {bagProducts.length} Items
        </Typography>
      </div>
      <Container style={{ marginTop: "20px" }}>
        {windowSize.width > 960 && (
          <Grid
            container
            spacing={2}
            style={{
              backgroundColor: "rgb(240, 243, 245)",
              borderBottom: "1px solid black",
            }}
          >
            <Grid item xs={4}>
              Product
            </Grid>
            <Grid item xs={2}>
              <div className={classes.gridCenter}>
                <Typography variant="subtitle1">Price</Typography>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className={classes.gridCenter}>
                <Typography variant="subtitle1"> Quantity</Typography>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={classes.gridCenter}>
                <Typography variant="subtitle1">Total</Typography>
              </div>
            </Grid>
          </Grid>
        )}
        {bagProducts.length &&
          bagProducts.map((item, i) => {
            return (
              <Grid
                key={i}
                container
                spacing={2}
                alignItems="center"
                style={{ marginTop: "20px", borderBottom: "1px solid black" }}
              >
                {windowSize.width < 960 && (
                  <Grid
                    item
                    container
                    spacing={2}
                    xs={12}
                    style={{
                      backgroundColor: "#e0e0e0",
                      borderBottom: "1px solid black",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography variant="subtitle1">
                      Product Name & Details
                    </Typography>
                  </Grid>
                )}
                <Grid item md={4} sm={12} xs={12}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <div>
                      <img
                        src={item?.productImgUrl}
                        alt=""
                        height="100px"
                        width="90px"
                      />
                    </div>
                    <div
                      style={{ lineHeight: "15px", margin: "5px 0px 0px 15px" }}
                    >
                      <Typography variant="h6" style={{ color: "black" }}>
                        <b>{item?.productName}</b>
                      </Typography>

                      <Typography
                        style={{
                          color: "#150c0c8c",
                          fontSize: "15px",
                          fontWeight: "lighter",
                        }}
                      >
                        Booth : {item?.stallName}
                      </Typography>
                      <Typography
                        style={{
                          color: "#150c0c8c",
                          fontSize: "15px",
                          fontWeight: "lighter",
                        }}
                      >
                        Category : {item?.category}
                      </Typography>
                    </div>
                  </div>
                </Grid>

                {windowSize.width < 960 && (
                  <Grid
                    container
                    spacing={2}
                    xs={12}
                    style={{
                      // backgroundColor: "#e0e0e0",
                      borderBottom: "1px solid black",
                      marginBottom: "10px",
                    }}
                  >
                    <Grid item sm={3} xs={3}>
                      <div className={classes.gridCenter}>
                        <Typography variant="subtitle1">Price</Typography>
                      </div>
                    </Grid>
                    <Grid item sm={6} xs={6}>
                      <div className={classes.gridCenter}>
                        <Typography variant="subtitle1">Quantity</Typography>
                      </div>
                    </Grid>
                    <Grid item sm={3} xs={3}>
                      <div className={classes.gridCenter}>
                        <Typography variant="subtitle1">Total</Typography>
                      </div>
                    </Grid>
                  </Grid>
                )}

                <Grid item md={2} sm={3} xs={3}>
                  <div className={classes.gridCenter}>
                    <Typography variant="subtitle1">
                      <b>{item?.productPrice}</b>
                    </Typography>
                  </div>
                </Grid>
                <Grid item md={4} sm={6} xs={6}>
                  <div className={classes.gridCenter}>
                    <ButtonGroup
                      size="small"
                      aria-label="small outlined button group"
                    >
                      <Button
                        onClick={() =>
                          handleIncrement(item?.id, item?.quantity)
                        }
                        variant="outlined"
                        color="primary"
                      >
                        +
                      </Button>
                      <Button disabled>{item?.quantity}</Button>
                      <Button
                        onClick={() =>
                          handleDecrement(item?.id, item?.quantity)
                        }
                      >
                        -
                      </Button>
                    </ButtonGroup>
                  </div>
                </Grid>
                <Grid item md={2} sm={3} xs={3}>
                  <div className={classes.gridCenter}>
                    <b>{item?.quantity * item?.productPrice}</b>
                  </div>
                </Grid>
              </Grid>
            );
          })}
      </Container>
      <div
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <Box
          color="default"
          style={{
            padding: "7px 25px 7px 25px",
            backgroundColor: "rgb(240, 243, 245)",
            borderRadius: "10px",
            border: "0.5px solid grey ",
          }}
        >
          <b>Total Price</b> : {totalPrice}/-
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: "20px",
          }}
          component={Link}
          to="/Checkout"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default MyBagProducts;
