import { Container } from "@material-ui/core";
import React from "react";
import IMG from "../assets/s.gif";

const Loading = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        top: "45%",
      }}
    >
      <img src={IMG} alt="Loading" />
    </Container>
  );
};

export default Loading;
