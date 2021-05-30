import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Check, Close, CloudUpload, Delete, GetApp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CSVLink } from "react-csv";
import { DataGrid } from "@material-ui/data-grid";
import { useAllUsersData } from "../../hooks";
import { auth, database } from "../../config";
import { Navigation } from "../../components";

const ViewMember = () => {
  const { allUsersData } = useAllUsersData();
  const uid = auth?.currentUser?.uid;
  const [memberId, setMemberId] = useState([]);
  const [teamMember, setTeamMember] = useState([]);

  const columns = [
    { field: "name", headerName: "Display Name", width: 230 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "phone", headerName: "Phone Number", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  const handleDelete = async () => {
    memberId.forEach(async (mid) => {
      await database.ref(`EXHIBITORS/${uid}/StallMember/${mid}`).remove();
      await database.ref(`Users/${mid}/role`).remove();
      await database.ref(`Users/${mid}/stallID`).remove();
    });
    setMemberId([]);
  };
  // useEffect(() => {
  //   database.ref(`EXHIBITORS/${uid}/StallMember`).on(`value`, (snap) => {
  //     const arr = [];
  //     if (snap.exists()) {
  //       const obj = snap.val();
  //       for (const key in obj) arr.push(obj[key]);

  //       const teamMemberArr = allUsersData.filter((item) =>
  //         arr.includes(item.id)
  //       );
  //       setTeamMember(teamMemberArr);
  //     }
  //   });
  // }, [allUsersData, uid]);
  useEffect(() => {
    const newArr = [];
    const arr = allUsersData.filter(
      (item) => item.stallID === uid && item?.id !== uid
    );
    arr.forEach((item) => {
      newArr.push({
        id: item?.id,
        name: item?.name,
        email: item?.email,
        phone: item?.phone || "Not provided",
        status: item?.isActive ? "Active" : " In-Active",
      });
    });

    setTeamMember(newArr);
    return () => {
      setTeamMember(arr);
    };
  }, [allUsersData, uid]);
  const handleBlock = async () => {
    memberId.forEach(async (mid) => {
      await database.ref(`Users/${mid}/isActive`).set(false);
    });
  };
  const handleUnBlock = async () => {
    memberId.forEach(async (mid) => {
      await database.ref(`Users/${mid}/isActive`).set(true);
    });
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
          to="/AddMember"
          style={{ margin: "10px" }}
        >
          Add
        </Button>
        <CSVLink data={teamMember} style={{ textDecoration: "none" }}>
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
            style={{
              margin: "10px",
              backgroundColor: "orangered",
              color: "whitesmoke",
            }}
            onClick={handleDelete}
          >
            <Typography variant="subtitle1">Delete</Typography>
          </Button>
          <Button
            startIcon={<Check />}
            variant="contained"
            style={{
              margin: "10px",
              backgroundColor: "green",
              color: "whitesmoke",
            }}
            onClick={handleUnBlock}
          >
            <Typography variant="subtitle1">Active</Typography>
          </Button>
          <Button
            startIcon={<Close />}
            variant="contained"
            color="secondary"
            style={{
              margin: "10px",
              backgroundColor: "brown",
              color: "whitesmoke",
            }}
            onClick={handleBlock}
          >
            <Typography variant="subtitle1">InActive</Typography>
          </Button>
        </div>

        <CardContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={teamMember}
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

export default ViewMember;
