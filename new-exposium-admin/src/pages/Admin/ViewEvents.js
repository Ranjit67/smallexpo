import { Card, CardContent, Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Delete, Edit, GetApp } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { Navigation } from "../../components";
import { database } from "../../config";
import { useViewEvents } from "../../hooks";

const columns = [
  { field: "slno", headerName: "Sl No.", width: 100 },
  { field: "title", headerName: "Title", width: 200 },
  { field: "eventDate", headerName: "Date", width: 150 },
  { field: "eventTime", headerName: "Start Time", width: 150 },
  { field: "eventEndTime", headerName: "End Time", width: 150 },
  { field: "videoUrl", headerName: "URL", width: 250 },

  { field: "agenda", headerName: "Agenda", width: 500 },
];

const ViewEvents = () => {
  const { allEvents } = useViewEvents();
  const [eventId, setEventId] = useState("");
  const [data, setData] = useState([]);
  const handleDelete = async () => {
    eventId.forEach(async (eid) => {
      await database.ref(`Helpdesk/Events/${eid}`).remove();
    });
    setEventId([]);
    if (allEvents.length < 2) window.location.reload();
  };
  useEffect(() => {
    setData(allEvents);
  }, [allEvents]);

  return (
    <Navigation>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
        }}
      >
        <CSVLink data={data} style={{ textDecoration: "none" }}>
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
            display: eventId.length ? "block" : "none",
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
          <Button
            startIcon={<Edit />}
            variant="contained"
            component={Link}
            to={`/EditEvent/${eventId}`}
            style={{ margin: "10px" }}
            color="primary"
          >
            Edit
          </Button>
        </div>

        <CardContent>
          <div style={{ height: 600, width: "100%" }}>
            {data && (
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={8}
                checkboxSelection
                onRowSelected={(e) => {
                  if (e?.isSelected) setEventId([...eventId, e.data.id]);
                  else {
                    const index = eventId.indexOf(e.data.id);
                    if (index > -1) {
                      const array = eventId;
                      array.splice(index, 1);
                      setEventId(array);
                    }
                    if (eventId.length < 1) setEventId([]);
                  }
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewEvents;
