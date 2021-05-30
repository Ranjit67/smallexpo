import React, { useEffect, useState } from "react";
import { Layout } from "../../components";
import IMG from "../../assets/AllExhibitor.png";
import Carousel, { consts } from "react-elastic-carousel";
import { Button, Card } from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { useAllUsersData, useCurrentUser } from "../../hooks";
import { Link } from "react-router-dom";
import { auth, database } from "../../config";

const breakPoint = [
  { width: 100, itemsToShow: 1 },
  { width: 300, itemsToShow: 2 },
  { width: 420, itemsToShow: 2 },
  { width: 500, itemsToShow: 2 },
  { width: 768, itemsToShow: 2 },
  { width: 1020, itemsToShow: 2 },
  { width: 1500, itemsToShow: 3 },
];
const AllExhibitors = () => {
  const uid = auth?.currentUser?.uid;
  const { currentUserData } = useCurrentUser();
  const [stallIMG, setStallIMG] = useState([]);
  const { allUsersData } = useAllUsersData();
  useEffect(() => {
    const arr = allUsersData.filter((item) => item?.role === "stall");
    setStallIMG(arr);
  }, [allUsersData]);

  const addVisitors = async (key) => {
    try {
      const arr = allUsersData.filter((item) => item?.stallID === key);
      arr.forEach(async (ele) => {
        await database.ref(`Visitors/Stall/${key}/${ele?.id}/${uid}/`).set({
          name: currentUserData?.name || "Not Provided",
          email: currentUserData?.email || "Not Provided",
          gender: currentUserData?.gender || "Not Provided",
          phone: currentUserData?.phone || "Not Provided",
        });
        await database.ref(`Visitors/User/${uid}/${ele?.id}/`).set({
          name: ele?.name || "Not Provided",
          email: ele?.email || "Not Provided",
          gender: ele?.gender || "Not Provided",
          phone: ele?.phone || "Not Provided",
          id: ele?.id,
        });
      });
    } catch (error) {}
  };

  return (
    <Layout>
      <div style={{ height: "90vh" }}>
        <img src={IMG} alt="" width="100%" height="103%" />
        <div style={{ position: "absolute", top: "40vh", width: "100%" }}>
          <Carousel
            breakPoints={breakPoint}
            pagination={false}
            renderArrow={({ type, onClick, isEdge }) => {
              const pointer =
                type === consts.PREV ? (
                  <ChevronLeft
                    style={{
                      fontSize: 40,
                      color: "red",
                      display: isEdge ? "none" : "",
                    }}
                  />
                ) : (
                  <ChevronRight
                    style={{
                      fontSize: 40,
                      color: "red",
                      display: isEdge ? "none" : "",
                    }}
                  />
                );
              return (
                <Button
                  disableRipple
                  color="primary"
                  onClick={onClick}
                  style={{ height: "100%", background: "none" }}
                >
                  {pointer}
                </Button>
              );
            }}
          >
            {stallIMG.map((item, i) => {
              return item?.bannerUrl ? (
                <Card
                  key={i}
                  style={{ cursor: "pointer", backgroundColor: "transparent" }}
                  component={Link}
                  to={`/PlatformExhibitors/${item?.id}`}
                  onClick={() => addVisitors(item?.id)}
                >
                  <img src={item?.bannerUrl} alt="" width="100%" key={i} />
                </Card>
              ) : (
                <Card
                  key={i}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                  }}
                  component={Link}
                  to={`/PlatformExhibitors/${item?.id}`}
                  onClick={() => addVisitors(item?.id)}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/exposium-live-2021.appspot.com/o/EXHIBITORS%2Fvm0uEpKXaHVuBK8Gk8ZIgMvCZbS2%2Fbanner?alt=media&token=85d97b9a-9036-4858-b62b-42c3c08200ee"
                    alt=""
                    width="100%"
                    key={i}
                  />
                </Card>
              );
            })}
          </Carousel>
        </div>
      </div>
    </Layout>
  );
};

export default AllExhibitors;
