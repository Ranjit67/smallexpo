import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Cancel, CheckCircle, GetApp, LocalShipping } from "@material-ui/icons";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useCurrentUser, useOrderDetails } from "../../hooks";

const ProductOrder = () => {
  const { currentUserId } = useCurrentUser();
  const { orderDetails } = useOrderDetails();
  const [orderID, setOrderID] = useState([]);

  const columns = [
    { field: "id", headerName: "Order Id", width: 180 },
    { field: "productName", headerName: "Product Name", width: 200 },
    { field: "productPrice", headerName: "Price", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 130 },
    { field: "name", headerName: " Name", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "phone", headerName: "Phone", width: 130 },
    { field: "selectState", headerName: "State", width: 150 },
    { field: "city", headerName: "City", width: 150 },
    { field: "address", headerName: "Address", width: 480 },
  ];
  const headers = [
    { label: "Product Name", key: "productName" },
    { label: "productPrice", key: "Price" },
    { label: "Quantity", key: "quantity" },
    { label: "productImgUrl", key: "productImgUrl" },
    { label: " Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "City", key: "city" },
    { label: "State", key: "selectState" },
    { label: "address", key: "Address" },
  ];
  const handleCancelOrder = async () => {
    const arr = orderDetails.filter((item) => orderID.includes(item?.id));
    try {
      await arr.forEach(async (item) => {
        await database
          .ref(`Users/${item?.uid}/MyBag/Order/${item?.userOrderID}/status`)
          .set("Order Cancel");
        await database
          .ref(`OrderProduct/${currentUserId}/${item?.id}/`)
          .remove();
      });
    } catch (error) {}
  };

  return (
    <Navigation>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
        }}
      >
        <CSVLink
          data={orderDetails}
          headers={headers}
          style={{ textDecoration: "none" }}
        >
          <Button
            startIcon={<GetApp />}
            variant="contained"
            component="label"
            style={{ margin: "10px" }}
          >
            Export
          </Button>
        </CSVLink>
      </div>
      <Card>
        <CardContent>
          <div
            style={{
              display: orderID.length ? "flex" : "none",
              flexDirection: "row",
              transition: "ease-out",
            }}
          >
            <Button
              startIcon={<Cancel />}
              variant="contained"
              color="secondary"
              style={{ margin: "10px" }}
              onClick={handleCancelOrder}
            >
              <Typography variant="subtitle1" style={{ color: "whitesmoke" }}>
                Cancel Order
              </Typography>
            </Button>
            <Button
              startIcon={<LocalShipping />}
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              // onClick={handleReport}
            >
              Shipped
            </Button>
            <Button
              startIcon={<CheckCircle />}
              variant="contained"
              style={{
                margin: "10px",
                backgroundColor: "green",
                color: "whitesmoke",
              }}
              // onClick={handleDetalis}
            >
              Delivered
            </Button>
          </div>
          <div style={{ height: 600, width: "100%" }}>
            {orderDetails && (
              <DataGrid
                rows={orderDetails}
                columns={columns}
                checkboxSelection
                pageSize={8}
                onRowSelected={(e) => {
                  if (e?.isSelected) {
                    setOrderID([...orderID, e?.data?.id]);
                  } else {
                    const index = orderID?.indexOf(e?.data?.id);
                    if (index > -1) {
                      const array = orderID;
                      array.splice(index, 1);
                      setOrderID(array);
                    }
                    if (orderID?.length < 1) setOrderID([]);
                  }
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ProductOrder;
