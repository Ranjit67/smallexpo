import { Card, CardContent, Fab, Grid } from "@material-ui/core";
import {
  AssignmentReturned,
  DirectionsWalkOutlined,
  EventNote,
  Person,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { DashboardCard } from "../../components";
import { useAllUsersData, useAppointment, useVisitors } from "../../hooks";
import jsPDF from "jspdf";
import "jspdf-autotable";

function StallDashboard() {
  const { visitors } = useVisitors();
  const { allUsersData } = useAllUsersData();
  const { appointment } = useAppointment();
  const [chartData, setChartData] = useState({});
  const [max, setMax] = useState(0);
  const [reportPromition, setReportPromition] = useState([]);
  const [reportUser, setReportUser] = useState([]);
  const [reportBudget, setReportBudget] = useState([]);
  const [onlineUser, setOnlineUser] = useState(0);
  const [reportVisitors, setReportVisitors] = useState(0);

  useEffect(() => {
    const arr = allUsersData.filter((item) => item.isOnline);
    setOnlineUser(arr.length);
    const temp = allUsersData.filter((item) => visitors.includes(item.id));
    setReportVisitors(temp);
    return () => {
      setOnlineUser([]);
    };
  }, [allUsersData, visitors]);
  useEffect(() => {
    setChartData({
      labels: ["Videos", "Documents", "Appointment"],
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
  useEffect(() => {
    setReportPromition([
      { name: "Total Added Video", value: 10 },
      { name: "Total Video View", value: 20 },
      { name: "Total Added Documents", value: 11 },
      { name: "Total Documents View", value: 10 },
      { name: "Total Added link", value: 10 },
      { name: "Total Link Click", value: 20 },
    ]);
    setReportUser([
      { name: "Total Users", value: 1000 },
      { name: "Total Visitied Users", value: 400 },
      { name: "Total Chat Users", value: 400 },
      { name: "Total Click Save Contacts", value: 200 },
      { name: "Total Appointment", value: 200 },
    ]);
    setReportBudget([
      { name: "Total Added Product", value: 70 },
      { name: "Total selled Product", value: 300 },
      { name: "Total Income", value: "$ 400" },
      { name: "Budget Expense", value: "$ 200" },
    ]);

    return () => {
      setReportPromition([]);
      setReportBudget([]);
      setReportUser([]);
    };
  }, []);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    const data = reportPromition.map((elt) => [elt.name, elt.value]);
    let content = {
      startY: 130,
      body: data,
    };
    let content1 = {
      startY: 290,
      body: reportUser,
    };
    let content2 = {
      startY: 430,
      body: reportBudget,
    };
    const arr = reportVisitors.map((elt) => [
      elt?.name,
      elt?.email,
      elt?.phone,
    ]);
    let contentVisitor = {
      startY: 50,
      body: arr,
    };

    doc.text(15, 30, "Date: 11/04/21");
    doc.text(15, 50, "Event: Exposium Demo Day");
    doc.text(15, 70, "Stall Name: Yard Hotel");
    doc.text(15, 90, "Company Name: Searching Yard PVT LTD");
    doc.setFont("times");
    // doc.setFontType("italic");

    //append last name in pdf
    // doc.addPage(); // add new page in pdf
    // doc.setTextColor(165, 0, 0);
    // doc.text(10, 20, "extra page to write");
    doc.text(10, 120, "1.Promotion:");
    doc.autoTable(content);
    doc.text(10, 280, "2.User:");
    doc.autoTable(content1);
    doc.text(10, 420, "3.Budget:");
    doc.autoTable(content2);
    doc.addPage(); // add new page in pdf
    doc.text(15, 30, "Visited User Data");
    doc.autoTable(contentVisitor);

    doc.save("StallReport.pdf");
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={6}>
          <DashboardCard
            title={"Visitors"}
            data={visitors.length}
            icon={<DirectionsWalkOutlined color="primary" />}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={6}>
          <DashboardCard
            title={"Appointment"}
            data={appointment.length}
            icon={<EventNote color="primary" />}
          />
        </Grid>

        <Grid item lg={4} md={6} xs={6}>
          <DashboardCard
            title={"OnlineUser"}
            data={onlineUser}
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
      <Fab
        color="primary"
        aria-label="Report"
        style={{ position: "absolute", bottom: "2vh", right: "2vw" }}
        onClick={exportPDF}
      >
        <AssignmentReturned />
      </Fab>
    </>
  );
}

export default StallDashboard;
