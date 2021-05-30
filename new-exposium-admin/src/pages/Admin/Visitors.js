import { Button, Card, CardContent } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { GetApp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Navigation } from "../../components";
import { useAllUsersData, useVisitors } from "../../hooks";

const columns = [
  { field: "name", headerName: "Display Name", width: 230 },
  { field: "email", headerName: "Email", width: 280 },
  { field: "phone", headerName: "Phone Number", width: 230 },
  { field: "gender", headerName: "Gender", width: 130 },
  { field: "ageRef", headerName: "Age", width: 130 },
  { field: "countryRef", headerName: "Country", width: 130 },
  { field: "resident", headerName: "City", width: 230 },
  {
    field: "dateOfRegistration",
    headerName: "Date Of Registation",
    width: 180,
  },

  { field: "gradeRef", headerName: "Grade", width: 230 },
  { field: "organization", headerName: "Organisation", width: 230 },
  { field: "schoolRef", headerName: "School", width: 230 },
  { field: "systemRef", headerName: "System", width: 230 },
  { field: "studyAreaRef", headerName: "Study Area", width: 230 },
];

const Visitors = () => {
  const [visitorsData, setVisitorsData] = useState([]);
  const { visitors } = useVisitors();
  const { allUsersData } = useAllUsersData();
  const [visitorsID, setVisitorsID] = useState([]);
  console.log(visitors);
  useEffect(() => {
    const arr = [];
    visitors.forEach((item) => {
      arr.push(item?.id);
    });
    setVisitorsID(arr);
  }, [visitors]);
  console.log(visitorsID);
  useEffect(() => {
    const arr = allUsersData.filter((item) => visitorsID.includes(item.id));
    setVisitorsData(arr);
    return () => {
      setVisitorsData([]);
    };
  }, [allUsersData, visitorsID]);

  return (
    <Navigation>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <CSVLink data={visitorsData} style={{ textDecoration: "none" }}>
          <Button startIcon={<GetApp />} variant="contained" component="label">
            Export
          </Button>
        </CSVLink>
      </div>
      <Card>
        <CardContent>
          <div style={{ height: 650, width: "100%" }}>
            <DataGrid rows={visitorsData} columns={columns} pageSize={10} />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default Visitors;
