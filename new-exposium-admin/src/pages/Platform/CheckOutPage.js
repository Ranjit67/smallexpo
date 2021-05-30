import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Layout } from "../../components";
import { auth, database, useAuth } from "../../config";
import { useMyBag, useWindow } from "../../hooks";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../../hooks/Payment";
import { useHistory } from "react-router";
const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiFormLabel-root": {
      color: "white",
    },
    "&& .MuiInput-root::before": {
      borderColor: "white",
    },
    "&& .MuiInput-root::after": {
      borderColor: "white",
    },
  },
})(TextField);
const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
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

const CheckOutPage = (props) => {
  var re = /\S+@\S+\.\S+/;
  const classes = useStyles();
  const { sendNotification } = useAuth();

  const uid = auth?.currentUser?.uid;
  const history = useHistory();
  const { windowSize } = useWindow();
  const { bagProducts } = useMyBag();
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardHolderName, setCardHolderName] = useState();
  const [cardNumber, setCardNumber] = useState();
  const [cvv, setCvv] = useState();
  const [expiry, setExpiry] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectState, setSelectState] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [validPhone, setValidPhone] = useState("");
  const [validEmail, setValidEmail] = useState("");
  const [focus, setFocus] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);

  useEffect(() => {
    let subTotal = 0;
    bagProducts.forEach((item) => {
      let total = item?.quantity * item?.productPrice;
      subTotal += total;
    });
    setTotalPrice(subTotal);
  }, [bagProducts]);
  const handleDelete = async (id) => {
    console.log(id);
    try {
      await database.ref(`Users/${uid}/MyBag/Products/${id}`).remove();
    } catch (error) {
      console.log(error?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var numbers = /^[0-9]+$/;
    if (
      fullName &&
      re.test(email) &&
      phone.match(numbers) &&
      /^[0-9]{8,10}$/.test(phone) &&
      address &&
      selectState &&
      city &&
      cardHolderName &&
      cardNumber &&
      cvv.match(numbers) &&
      /^[0-9]{4}$/.test(cvv)
    ) {
      try {
        setOpenBackDrop(true);
        const res = await database.ref(`Users/${uid}/MyBag/Order`).push({
          bagProducts,
          fullName,
          email,
          phone,
          address,
          selectState,
          city,
          totalPrice,
          status: "Order Placed",
        });
        await bagProducts.forEach(async (item) => {
          const notification = {
            body: "New Order Placed",
            title: `${item?.quantity}${" "} of ${item?.productName} placed`,
            sound: "default",
            timestamp: new Date().toLocaleString(),
          };
          await database.ref(`OrderProduct/${item?.stallID}/`).push({
            productName: item?.productName,
            productPrice: item?.productPrice,
            quantity: item?.quantity,
            name: fullName,
            email: email,
            address: address,
            selectState: selectState,
            city: city,
            phone: phone,
            status: "Order Placed",
            uid: uid,
            userOrderID: res?.path?.pieces_[4],
          });
          await database
            .ref(`Users/${item?.stallID}/fcmToken`)
            .on("value", (snap) => {
              if (snap.exists()) {
                const token = snap.val();
                sendNotification(notification, token);
              }
            });
          await database
            .ref(`Notifications/${item?.stallID}/`)
            .push(notification);
        });
        await database.ref(`Users/${uid}/MyBag/Products`).remove();
        await history.push("/MyOrder");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      } finally {
        setOpenBackDrop(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fill All The Input Fields",
      });
    }
  };

  return (
    <Layout>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card style={{ margin: windowSize.width > 500 ? "50px" : " 0px" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item lg={6} md={12} sm={12} xs={12}>
              <div
                style={{
                  width: "90%",
                  backgroundColor: "white",
                }}
              >
                <div style={{ marginLeft: "2vw", color: "#9a9494" }}>
                  <Typography variant="h5">Shopping Cart</Typography>
                </div>
                {bagProducts.length &&
                  bagProducts.map((item, i) => {
                    return (
                      <div key={i}>
                        <Grid
                          container
                          spacing={4}
                          alignItems="center"
                          style={{
                            margin: "10px",
                            borderBottom: "2px solid #d9d9d9",
                          }}
                        >
                          <Grid item xs={9}>
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
                                  Price :{item?.productPrice}/-
                                </Typography>
                                <Typography
                                  style={{
                                    color: "#150c0c8c",
                                    fontSize: "15px",
                                    fontWeight: "lighter",
                                  }}
                                >
                                  Quantity : {item?.quantity}
                                </Typography>
                              </div>
                            </div>
                          </Grid>
                          <Grid item xs={3}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <IconButton
                                onClick={() => handleDelete(item?.id)}
                              >
                                <Cancel style={{ color: "#d9d9d9" }} />
                              </IconButton>
                            </div>
                          </Grid>
                        </Grid>
                      </div>
                    );
                  })}
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
                </div>
              </div>
            </Grid>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <div
                style={{
                  height: "75vh",
                  width: "100%",
                  backgroundColor: "#06114c",
                }}
              >
                <div style={{ padding: "20px", color: "whitesmoke" }}>
                  <Typography variant="h5">Address Details</Typography>
                </div>
                <div style={{ padding: "20px", color: "whitesmoke" }}>
                  <form>
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <CssTextField
                          required
                          label="Full Name"
                          fullWidth
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CssTextField
                          required
                          label="Phone"
                          fullWidth
                          value={phone}
                          //   onChange={(e) => setPhone(e.target.value)}
                          onChange={(e) => {
                            var numbers = /^[0-9]+$/;
                            if (
                              !e.target.value.match(numbers) ||
                              !/^[0-9]{8,12}$/.test(e.target.value)
                            ) {
                              setValidPhone("Enetr a Valid Phone Number");
                            } else {
                              setValidPhone("");
                            }
                            setPhone(e.target.value);
                          }}
                        />
                        <label
                          style={{
                            color: "red",
                            fontSize: "15px",
                            margin: "4px",
                          }}
                        >
                          <b>{validPhone}</b>
                        </label>
                      </Grid>
                      <Grid item xs={12}>
                        <CssTextField
                          required
                          label="Email"
                          type="email"
                          fullWidth
                          value={email}
                          onChange={(e) => {
                            if (!re.test(e.target.value)) {
                              setValidEmail("Enter a Valid Email");
                            } else {
                              setValidEmail("");
                            }
                            setEmail(e.target.value);
                          }}
                        />
                        <label
                          style={{
                            color: "red",
                            fontSize: "15px",
                            margin: "4px",
                          }}
                        >
                          <b>{validEmail}</b>
                        </label>
                      </Grid>
                      <br /> <br /> <br /> <br />
                      <Grid item xs={6}>
                        <CssTextField
                          required
                          select
                          label="State"
                          fullWidth
                          value={selectState}
                          onChange={(e) => setSelectState(e.target.value)}
                        >
                          <MenuItem value={`Odisha`}>Odisha</MenuItem>
                          <MenuItem value={`Delhi`}>Delhi</MenuItem>
                        </CssTextField>
                      </Grid>
                      <Grid item xs={6}>
                        <CssTextField
                          required
                          select
                          label="City"
                          fullWidth
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        >
                          <MenuItem value={`Cuttack`}>Cuttack</MenuItem>
                          <MenuItem value={`Bhubaneswar`}>Bhubaneswar</MenuItem>
                        </CssTextField>
                      </Grid>
                      <Grid item xs={12}>
                        <CssTextField
                          required
                          rows={3}
                          label="Address"
                          fullWidth
                          multiline
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Grid>
                      {/* <Grid item xs={12}>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button variant="contained" color="primary">
                            {" "}
                            Add Address
                          </Button>
                        </div>
                      </Grid> */}
                    </Grid>
                  </form>
                </div>
              </div>
            </Grid>
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <div
                style={{
                  height: "75vh",
                  width: "100%",
                  backgroundColor: "#06114c",
                }}
              >
                <div style={{ color: "whitesmoke" }}>
                  <div style={{ width: "100%", padding: "20px" }}>
                    <Typography variant="h5">Card Details</Typography>
                  </div>
                  <div
                    style={{
                      height: "25vh",
                      width: "100%",
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        <Cards
                          cvc={cvv}
                          expiry={expiry}
                          focused={focus}
                          number={cardNumber || 0}
                          name={cardHolderName}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <div style={{ padding: "20px", color: "whitesmoke" }}>
                    <form>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <CssTextField
                            required
                            label="Card Holder Name"
                            fullWidth
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CssTextField
                            required
                            label="Card Number"
                            fullWidth
                            value={cardNumber}
                            type="tel"
                            inputProps={{ maxLength: 19 }}
                            onChange={(e) => {
                              //   var numbers = /^[0-9/]+$/;
                              //   if (
                              //     !e.target.value.match(numbers) ||
                              //     !/^[0-9/]{0,19}$/.test(e.target.value)
                              //   ) {
                              //     setValidCardNumber("Enetr a Valid Card Number");
                              //   } else {
                              //     setValidCardNumber("");
                              //   }
                              setCardNumber(
                                formatCreditCardNumber(e.target.value)
                              );
                            }}
                          />
                        </Grid>

                        <Grid item xs={7}>
                          <CssTextField
                            required
                            type="tel"
                            label="Valid Thru"
                            inputProps={{ pattern: "", maxLength: 5 }}
                            value={expiry}
                            style={{ margin: "1vh 1vw 1vh 0" }}
                            onChange={(e) =>
                              setExpiry(formatExpirationDate(e.target.value))
                            }
                          />
                        </Grid>
                        {/* <Grid item xs={4}>
                          <CssTextField
                            required
                            select
                            label="YYYY"
                            fullWidth
                            value={expiryYear}
                            onChange={(e) => setExpiryYear(e.target.value)}
                          >
                            {year.map((item) => (
                              <MenuItem value={item} key={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </CssTextField>
                        </Grid> */}
                        <Grid item xs={5}>
                          <CssTextField
                            required
                            label="CVV"
                            fullWidth
                            value={cvv}
                            type="tel"
                            inputProps={{ maxLength: 4 }}
                            onChange={(e) => {
                              //   var numbers = /^[0-9]+$/;
                              //   if (
                              //     !e.target.value.match(numbers) ||
                              //     !/^[0-9]{4}$/.test(e.target.value)
                              //   ) {
                              //     setValidCvv("Invalid CVV");
                              //   } else {
                              //     setValidCvv("");
                              //   }
                              setCvv(formatCVC(e.target.value));
                            }}
                            onFocus={(e) => setFocus(e.target.name)}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleSubmit}
                            >
                              {" "}
                              Checkout
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </form>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CheckOutPage;
