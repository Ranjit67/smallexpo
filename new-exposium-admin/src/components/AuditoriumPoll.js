import { Button, Card, Typography } from "@material-ui/core";
import { Poll } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import { auth, database } from "../config";

const AuditoriumPoll = ({ id, mobile }) => {
  const uid = auth?.currentUser?.uid;
  const [pollData, setPollData] = useState([]);

  useEffect(() => {
    database.ref(`Poll/${id}`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            pollID: key,
            ...obj[key],
          });
        setPollData(arr);
      }
      return () => {
        setPollData([]);
      };
    });
  }, [id]);

  const handleOption = async (pollID, option) => {
    try {
      await database.ref(`Poll/${id}/${pollID}/Votes/${uid}`).set(option);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div style={{ maxHeight: "84vh", overflowY: "scroll" }}>
      {pollData.length ? (
        pollData.map((item, i) => {
          const arr = [];
          const obj = item?.Votes;
          if (obj) {
            for (const key in obj) arr.push(obj[key]);
          }

          const res1 = arr.filter((ele) => ele === item?.option1);
          const res2 = arr.filter((ele) => ele === item?.option2);
          const data = {
            labels: [item?.option1, item?.option2],
            datasets: [
              {
                label: " of data",
                data: [res1.length, res2?.length],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.9)",
                  "rgba(235, 220, 91, 0.9)",
                ],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(235, 220, 91, 1)"],
                borderWidth: 2,
              },
            ],
          };
          const max = Math.max(res1.length, res2?.length);

          return (
            item?.live && (
              <div key={i}>
                <Typography variant="h5">{item?.question}</Typography>
                <Card>
                  <HorizontalBar
                    data={data}
                    width={mobile ? 100 : 50}
                    height={mobile ? 50 : 10}
                    options={{
                      scales: {
                        xAxes: [
                          {
                            ticks: {
                              beginAtZero: true,
                              max: max + 2,
                            },
                          },
                        ],
                      },
                    }}
                  />
                </Card>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      margin: "20px",
                      opacity: item?.Votes
                        ? item?.Votes[uid] === item?.option1
                          ? 1
                          : 0.3
                        : 1,
                    }}
                    onClick={() => handleOption(item?.pollID, item?.option1)}
                  >
                    {item?.option1}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      margin: "20px",
                      opacity: item?.Votes
                        ? item?.Votes[uid] === item?.option2
                          ? 1
                          : 0.3
                        : 1,
                    }}
                    onClick={() => handleOption(item?.pollID, item?.option2)}
                  >
                    {item?.option2}
                  </Button>
                </div>
              </div>
            )
          );
        })
      ) : (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Poll fontSize="large" color="primary" />
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            {" "}
            No Poll Found
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AuditoriumPoll;
