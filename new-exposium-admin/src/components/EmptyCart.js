import { Button } from "@material-ui/core";
import { RemoveShoppingCart } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "30%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <RemoveShoppingCart style={{ fontSize: "150px" }} color="secondary" />

        <Button variant="contained" color="primary" component={Link} to="/Shop">
          GoTo Shop
        </Button>
      </div>
    </div>
  );
};

export default EmptyCart;
