import { Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../../components";
import { useWindow } from "../../hooks";
import IMG from "../../assets/DashboardLobby.png";
import IMAGE from "../../assets/LandingPageMobileView.png";

const Lobby = () => {
  const { windowSize } = useWindow();
  return (
    <Layout>
      {windowSize.width > 600 ? (
        <div style={{ height: "99vh" }}>
          <img src={IMG} alt="Exposium" width="100%" height="100%" />
          <Button
            component={Link}
            to="/AllExhibitors"
            style={{
              position: "absolute",
              top: "52vh",
              left: "70vw",
              padding: "5% 8% 5% 8%",
              zIndex: "999",
              backgroundColor: "transparent",
            }}
          ></Button>
          <Button
            component={Link}
            to="/Auditorium"
            style={{
              position: "absolute",
              top: "60vh",
              left: "57vw",
              padding: "5% 7% 5% 7%",
              backgroundColor: "transparent",
            }}
          ></Button>
          {/* <Button
            component={Link}
            to="/Networking"
            style={{
              position: "absolute",
              top: "56vh",
              left: "65vw",
              padding: "5% 7% 5% 7%",
              backgroundColor: "transparent",
            }}
          ></Button> */}
          <Button
            component={Link}
            to="/HelpDesk"
            style={{
              position: "absolute",
              top: "62vh",
              left: "36vw",
              padding: "10% 9%",
              backgroundColor: "transparent",
            }}
          ></Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
            backgroundImage: `url(${IMAGE})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Button
            component={Link}
            to="/AllExhibitors"
            variant="contained"
            color="secondary"
            style={{ width: "40vw", margin: "10px" }}
          >
            Exhibitons
          </Button>
          <Button
            component={Link}
            to="/Auditorium"
            variant="contained"
            color="secondary"
            style={{ width: "40vw", margin: "10px" }}
          >
            Auditorium
          </Button>
          {/* <Button
            component={Link}
            to="/Networking"
            variant="contained"
            color="secondary"
            style={{ width: "40vw", margin: "10px" }}
          >
            Networking
          </Button> */}
          <Button
            component={Link}
            to="/HelpDesk"
            variant="contained"
            color="secondary"
            style={{ width: "40vw", margin: "10px" }}
          >
            HelpDesk
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default Lobby;
