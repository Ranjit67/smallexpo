import { Card, CardContent, Grid } from "@material-ui/core";
import {
  AssessmentSharp,
  EmojiPeopleSharp,
  Event,
  Person,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { DashboardCard } from "../../components";

const SuperAdminDashBoard = () => {
  const [chartData, setChartData] = useState({});
  const [max, setMax] = useState(0);

  useEffect(() => {
    setChartData({
      labels: ["Visitors", "Participants", "Total Events"],
      datasets: [
        {
          label: " of data",

          data: [1, 3, 7],
          backgroundColor: [
            "rgba(255, 99, 132, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(235, 220, 91, 0.9)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(235, 220, 91, 1)",
          ],
          borderWidth: 2,
        },
      ],
    });
    setMax(Math.max(1, 3, 7));
  }, []);
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12}>
          <DashboardCard
            title={"Visitors"}
            data={12}
            icon={<EmojiPeopleSharp color="primary" />}
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <DashboardCard
            title={"participants"}
            data={10}
            icon={<AssessmentSharp color="primary" />}
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <DashboardCard
            title={"Total Events"}
            data={10}
            icon={<Event color="action" />}
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <DashboardCard
            title={"Total User"}
            data={11}
            icon={<Person style={{ color: "yellowgreen" }} />}
          />
        </Grid>

        <Grid item lg={6} sm={12} xs={12}>
          <Card>
            <CardContent>
              <Bar
                data={chartData}
                width={100}
                height={70}
                options={{
                  scales: {
                    yAxes: [
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
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={6} sm={12} xs={12}>
          <Card>
            <CardContent>
              <Pie data={chartData} width={100} height={70} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default SuperAdminDashBoard;
