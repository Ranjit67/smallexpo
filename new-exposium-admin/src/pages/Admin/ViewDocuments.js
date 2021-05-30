import { Button, Card, CardContent } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { CloudUpload, Delete, GetApp, Visibility } from "@material-ui/icons";
import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Navigation } from "../../components";
import { database, storage } from "../../config";
import { useCurrentUser, useDocuments } from "../../hooks";

const columns = [
  { field: "slno", headerName: "Sl No.", width: 100 },
  { field: "id", headerName: "ID", width: 400 },
  { field: "title", headerName: "Document Title", width: 400 },
  { field: "timestamp", headerName: "Timestamp", width: 250 },
];

const ViewDocuments = () => {
  const { currentUserData } = useCurrentUser();
  const { documents } = useDocuments();
  const [documentId, setDocumentId] = useState([]);

  const handleDelete = () => {
    documentId.forEach((did) => {
      database
        .ref(`Users/${currentUserData.stallID}/Documents/${did}`)
        .remove();
      const arr = documents.filter((item) => item.id === did);
      storage.ref(arr[0].storageref).delete();
    });
    setDocumentId([]);
  };
  const previewCatalog = () => {
    if (documentId.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "Sorry..",
        text: "Please Select One Document To View",
      });
    } else {
      const arr = documents.filter((item) => item.id === documentId[0]);
      window.open(arr[0].catalogUrl);
    }
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
          to="/AddDocument"
          style={{ margin: "10px" }}
        >
          Add
        </Button>
        <CSVLink
          data={documents}
          // headers={headers}
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
            display: documentId.length ? "block" : "none",
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
            startIcon={<Visibility />}
            variant="contained"
            color="primary"
            style={{ margin: "10px" }}
            onClick={previewCatalog}
          >
            View
          </Button>
        </div>

        <CardContent>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={documents}
              columns={columns}
              pageSize={8}
              checkboxSelection
              onRowSelected={(e) => {
                if (e?.isSelected) {
                  setDocumentId([...documentId, e?.data?.id]);
                } else {
                  const index = documentId?.indexOf(e?.data?.id);
                  if (index > -1) {
                    const array = documentId;
                    array.splice(index, 1);
                    setDocumentId(array);
                  }
                  if (documentId?.length < 1) setDocumentId([]);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewDocuments;
