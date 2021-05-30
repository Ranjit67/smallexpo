import { Button, Container } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  return (
    <Container component="main" maxWidth="sm">
      <div style={{ textAlign: "center" }}>
        <img
          src={"/img/404.png"}
          alt="404 Not Found"
          style={{ width: "100%", height: "100%" }}
        />
        <Button startIcon={<ArrowBackIos />} onClick={() => history.push("/")}>
          Go Back
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
