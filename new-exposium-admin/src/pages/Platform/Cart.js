import React from "react";
import { EmptyCart, Layout, MyBagProducts } from "../../components";
import { useMyBag } from "../../hooks";

const Cart = () => {
  const { bagProducts } = useMyBag();
  return (
    <Layout>{bagProducts.length ? <MyBagProducts /> : <EmptyCart />}</Layout>
  );
};

export default Cart;
