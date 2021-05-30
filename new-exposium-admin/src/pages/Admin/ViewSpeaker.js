import { Button, Card, CardContent } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { CloudUpload, Delete, GetApp } from "@material-ui/icons";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { Navigation } from "../../components";


const columns = [
  { field: "slno", headerName: "Sl No.", width: 100 },
  { field: "name", headerName: "Name", width: 250 },
  { field: "email", headerName: "Email", width: 350 },
  { field: "degination", headerName: "Degination", width: 300 },
];

const ViewSpeaker = () => {
  const [speakerId, setSpeakerId] = useState([]);
  const speaker = [];

  const headers = [
    { label: "Sl No.", key: "slno" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Degination", key: "degination" },
  ];
  const handleDelete = async () => {
    // await speakerId.forEach((sid) => {
    //   database.ref(`Auditoriums/${uid}/Speakers//${sid}`).remove();
    //   database.ref(`Users/${sid}/role`).remove();
    // });
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
          to="/AddSpeaker"
          style={{ margin: "10px" }}
        >
          Add
        </Button>
        <CSVLink
          data={speaker}
          headers={headers}
          style={{ textDecoration: "none" }}
        >
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
            display: speakerId.length ? "block" : "none",
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
              rows={speaker}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onRowSelected={(e) => {
                if (e?.isSelected) setSpeakerId([...speakerId, e.data.id]);
                else {
                  const index = speakerId.indexOf(e.data.id);
                  if (index > -1) {
                    const array = speakerId;
                    array.splice(index, 1);
                    setSpeakerId(array);
                  }
                  if (speakerId.length < 1) setSpeakerId([]);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewSpeaker;
