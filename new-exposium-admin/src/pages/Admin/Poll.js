import { Button, Card, Typography } from "@material-ui/core";
import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import { Navigation, PollQuestion } from "../../components";
import { auth, database } from "../../config";
import { useAdminPoll } from "../../hooks";

const Poll = () => {
  const uid = auth?.currentUser?.uid;
  const { pollData } = useAdminPoll();
  pollData.sort((x) => (x.live ? -1 : 1));

  const handleClosePoll = async (id) => {
    try {
      await database.ref(`Poll/${uid}/${id}/live`).set(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navigation>
      {pollData.length &&
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
            <div style={{ opacity: item?.live ? 1 : 0.3 }} key={i}>
              <Typography variant="h5">{item?.question}</Typography>
              <Card>
                <HorizontalBar
                  data={data}
                  width={50}
                  height={10}
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
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "20px" }}
                onClick={() => handleClosePoll(item?.pollID)}
              >
                Close Poll
              </Button>
            </div>
          );
        })}

      <PollQuestion />
    </Navigation>
  );
};

export default Poll;
