import { Button, Card, CardContent } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { CloudUpload, Delete, GetApp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useAllUsersData, useCurrentUser } from "../../hooks";

const ViewSpeakerMember = () => {
  const { currentUserId } = useCurrentUser();
  const { allUsersData } = useAllUsersData();
  const [speakerMember, setSpeakerMember] = useState([]);
  const [memberId, setMemberId] = useState([]);

  useEffect(() => {
    const arr = allUsersData.filter(
      (item) => item?.speakerID === currentUserId
    );
    setSpeakerMember(arr);
  }, [allUsersData, currentUserId]);
  const columns = [
    { field: "name", headerName: "Display Name", width: 230 },
    { field: "email", headerName: "Email", width: 280 },
    { field: "phone", headerName: "Phone Number", width: 230 },
    { field: "gender", headerName: "Gender", width: 130 },
    { field: "ageRef", headerName: "Age", width: 130 },
    { field: "country", headerName: "Country", width: 130 },
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
  const handleDelete = async () => {
    memberId.forEach(async (mid) => {
      await database.ref(`Users/${mid}/role`).remove();
      await database.ref(`Users/${mid}/speakerID`).remove();
    });
    setMemberId([]);
  };
  return (
    <Navigation>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
        }}
      >
        <Button
          startIcon={<CloudUpload />}
          variant="contained"
          component={Link}
          to="/AddSpeakerMember"
          style={{ margin: "10px" }}
        >
          Add
        </Button>
        <CSVLink data={speakerMember} style={{ textDecoration: "none" }}>
          <Button
            startIcon={<GetApp />}
            variant="contained"
            component="label"
            style={{ margin: "10px" }}
          >
            Export
          </Button>
        </CSVLink>
      </div>
      <Card>
        <div
          style={{
            display: memberId.length ? "block" : "none",
            transition: "ease-out",
          }}
        >
          <Button
            startIcon={<Delete />}
            variant="contained"
            color="secondary"
            style={{ margin: "10px" }}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>

        <CardContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={speakerMember}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onRowSelected={(e) => {
                if (e?.isSelected) setMemberId([...memberId, e.data.id]);
                else {
                  const index = memberId.indexOf(e.data.id);
                  if (index > -1) {
                    const array = memberId;
                    array.splice(index, 1);
                    setMemberId(array);
                  }
                  if (memberId.length < 1) setMemberId([]);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewSpeakerMember;
