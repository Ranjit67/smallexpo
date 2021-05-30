import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import React from "react";
import { EmptyCart } from ".";
import { database } from "../config";
import { useCurrentUser, useOrderItem, useWindow } from "../hooks";
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

const Order = () => {
  const classes = useStyles();
  const { currentUserId } = useCurrentUser();
  const { orderItems } = useOrderItem();

  const { windowSize } = useWindow();
  const handelCancel = async (order) => {
    try {
      await database
        .ref(`Users/${currentUserId}/MyBag/Order/${order?.orderID}/status`)
        .set("Order Cancel");
    } catch (error) {}
  };

  return (
    <div>
      {orderItems.length ? (
        <Container style={{ marginTop: "20px" }}>
          {windowSize.width > 960 && (
            <Grid
              container
              spacing={2}
              style={{
                backgroundColor: "rgb(240, 243, 245)",
                borderBottom: "1px solid black",
                margin: "0px 12px",
                padding: "10px",
                width: "98%",
              }}
            >
              <Grid item xs={7}>
                Product
              </Grid>
              <Grid item xs={2}>
                <div className={classes.gridCenter}>
                  <Typography variant="subtitle1">Price</Typography>
                </div>
              </Grid>
              <Grid item xs={1}>
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
          {orderItems.length &&
            orderItems.map((order, index) => {
              console.log(order);
              return (
                <div
                  style={{
                    padding: "10px",
                    margin: "10px",
                  }}
                >
                  {order?.bagProducts.length &&
                    order?.bagProducts.map((item, i) => {
                      return (
                        <Card style={{ marginTop: "10px" }}>
                          <Grid
                            key={i}
                            container
                            spacing={2}
                            alignItems="center"
                            style={{
                              marginTop: "20px",
                              borderBottom: "1px solid black",
                            }}
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

                                  margin: "5px 12px",
                                  padding: "10px",
                                  width: "98%",
                                }}
                              >
                                <Typography variant="subtitle1">
                                  Product Name & Details
                                </Typography>
                              </Grid>
                            )}

                            <Grid item xs={7}>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                }}
                              >
                                <div style={{ marginLeft: "5px" }}>
                                  <img
                                    src={item?.productImgUrl}
                                    alt=""
                                    height="100px"
                                    width="90px"
                                  />
                                </div>
                                <div
                                  style={{
                                    lineHeight: "15px",
                                    margin: "5px 0px 0px 15px",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    style={{ color: "black" }}
                                  >
                                    <b>{item?.productName}</b>
                                  </Typography>

                                  <Typography
                                    style={{
                                      color: "#150c0c8c",
                                      fontSize: "15px",
                                      fontWeight: "lighter",
                                    }}
                                  >
                                    Booth :{windowSize.width < 500 && <br />}{" "}
                                    {item?.stallName}
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

                            {/* {windowSize.width < 960 && (
                  <Grid
                    container
                    spacing={2}
                    xs={12}
                    style={{
                      backgroundColor: "#e0e0e0",
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
                )} */}

                            <Grid item xs={2}>
                              <div className={classes.gridCenter}>
                                <Typography variant="subtitle1">
                                  <b>{item?.productPrice}</b>
                                </Typography>
                              </div>
                            </Grid>
                            <Grid item xs={1}>
                              <div className={classes.gridCenter}>
                                <Typography variant="subtitle1">
                                  <b>{item?.quantity}</b>
                                </Typography>
                              </div>
                            </Grid>
                            <Grid item xs={2}>
                              <div className={classes.gridCenter}>
                                <b>{item?.quantity * item?.productPrice}</b>
                              </div>
                            </Grid>
                          </Grid>
                        </Card>
                      );
                    })}
                  <div
                    style={{
                      width: "90%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "20px",
                    }}
                  >
                    <Box
                      color="default"
                      style={{
                        padding: "7px 25px ",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "15%",
                        border: "1px solid rgb(240, 243, 245)",
                        borderRadius: "10px",
                      }}
                    >
                      <FiberManualRecord
                        style={{
                          color:
                            order?.status === "Order Placed"
                              ? "green"
                              : order?.status === "Order Cancel"
                              ? "red"
                              : order?.status === "Shipped"
                              ? "yellowgreen"
                              : " grey",
                        }}
                      />
                      <Typography variant="h6">{order?.status}</Typography>
                    </Box>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          margin: "20px",
                          borderRadius: "10px",
                          padding: "5px 30px ",
                        }}
                      >
                        <Typography variant="subtitle1">
                          View Details
                        </Typography>
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{
                          margin: "20px",
                          borderRadius: "10px",
                          padding: "5px 30px ",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          onClick={() => handelCancel(order)}
                        >
                          Cancel Order
                        </Typography>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

          {}
        </Container>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default Order;
