import React from "react";
import { Layout } from "../../components";
import IMG from "../../assets/Landingpage.png";
import { Button } from "@material-ui/core";

import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <Layout>
      <div style={{ height: "92vh" }}>
        <img src={IMG} alt="Exposium" width="100%" height="100%" />
        <Button
          component={Link}
          to="/Lobby"
          variant="contained"
          color="secondary"
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Enter Into Lobby
        </Button>
      </div>
    </Layout>
  );
};

export default LandingPage;
