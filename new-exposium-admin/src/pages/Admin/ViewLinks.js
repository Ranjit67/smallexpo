import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Button, Card, CardContent } from "@material-ui/core";
import { Delete, GetApp } from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";
import { useCurrentUser, useLinks } from "../../hooks";
import { database } from "../../config";
import { Navigation } from "../../components";

const ViewLinks = () => {
  const { links } = useLinks();
  const { currentUserData } = useCurrentUser();

  const [urlId, setUrlId] = useState([]);
  const columns = [
    { field: "slno", headerName: "Sl No.", width: 100 },
    { field: "linkTitle", headerName: "Link Title", width: 300 },
    { field: "url", headerName: "URL", width: 350 },
    { field: "timestamp", headerName: "Timestamp", width: 250 },
  ];
  const headers = [
    { label: "Sl No.", key: "slno" },
    { label: "Link Title", key: "linkTitle" },
    { label: "URL", key: "url" },
    { label: "Timestamp", key: "timestamp" },
  ];
  const handleDelete = async () => {
    urlId.forEach(async (lid) => {
      try {
        await database
          .ref(`Users/${currentUserData?.stallID}/Links/${lid}`)
          .remove();
      } catch (error) {
        console.log(error.message);
      }
    });
    setUrlId([]);
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
        <CSVLink
          data={links}
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
            display: urlId.length ? "block" : "none",
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
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={links}
              columns={columns}
              pageSize={8}
              checkboxSelection
              onRowSelected={(e) => {
                if (e?.isSelected) {
                  setUrlId([...urlId, e?.data?.id]);
                } else {
                  const index = urlId?.indexOf(e?.data?.id);
                  if (index > -1) {
                    const array = urlId;
                    array.splice(index, 1);
                    setUrlId(array);
                  }
                  if (urlId?.length < 1) setUrlId([]);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewLinks;
