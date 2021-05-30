import React, { useState } from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  Close,
  CloudUpload,
  Delete,
  Edit,
  GetApp,
  Visibility,
} from "@material-ui/icons";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import Swal from "sweetalert2";
import { useAgenda } from "../../hooks";
import { database, storage } from "../../config";
import { Navigation } from "../../components";
const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  paper: { minWidth: "50vw", minHeight: "20vh" },
}));

const ViewAgenda = () => {
  const classes = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { agenda } = useAgenda();
  const [agendaId, setAgendaId] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedAgenda, setSelectedAgenda] = useState([]);
  const columns = [
    { field: "slno", headerName: "Sl No", width: 100 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "speakerName", headerName: "Speaker Name", width: 200 },
    { field: "startTime", headerName: "Start Time", width: 200 },
    { field: "endTime", headerName: "End Time", width: 200 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "description", headerName: "Description", width: 400 },
    { field: "zoomLink", headerName: "Zoom Link", width: 200 },
  ];
  const headers = [
    { label: "Sl No.", key: "id" },
    { label: "Title", key: "title" },
    { label: "Speaker Name", key: "speakerName" },
    { label: "Start Time", key: "startTime" },
    { label: "End Time", key: "endTime" },
    { label: "Date", key: "date" },
    { label: "Description", key: "description" },
    { label: "Zoom Link", key: "zoomLink" },
  ];
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    agendaId.forEach(async (aid) => {
      await database.ref(`Helpdesk/Agenda/${aid}`).remove();
      const arr = agenda.filter((item) => item.id === aid);
      await storage.ref(arr[0].storageref).delete();
    });
    setAgendaId([]);
    if (agenda.length < 2) window.location.reload();
  };

  const handlePhoto = () => {
    if (agendaId.length > 1) {
      Swal.fire({
        icon: "warning",
        title: "Sorry..",
        text: "Please Select only One Agenda",
      });
    } else {
      setOpen(true);
      const arr = agenda.filter((item) => item?.id === agendaId[0]);
      setSelectedAgenda(arr[0]);
    }
  };
  const handleEdit = () => {
    agendaId.length > 1 &&
      Swal.fire({
        icon: "warning",
        title: "Sorry..",
        text:
          "Please Select only One Agenda Now You Are Redirect to First Selcted Agenda",
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
          to="/AddAgenda"
          style={{ margin: "10px" }}
        >
          Add Agenda
        </Button>
        <CSVLink
          data={agenda}
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
      <Dialog
        onClose={handleClose}
        open={open}
        fullScreen={fullScreen}
        classes={{ paper: classes.paper }}
      >
        <DialogTitle onClose={handleClose}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">{selectedAgenda?.speakerName}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={selectedAgenda?.speakerPhotoUrl}
              alt={selectedAgenda?.speakerName}
              width="30%"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardActions>
          <div
            style={{
              display: agendaId?.length ? "block" : "none",
              transition: "ease-out",
            }}
          >
            <Button
              endIcon={<Delete />}
              variant="contained"
              color="secondary"
              style={{ margin: "10px" }}
              onClick={handleDelete}
            >
              Delete
            </Button>

            <Button
              endIcon={<Edit />}
              variant="contained"
              color="primary"
              style={{ margin: "10px" }}
              component={Link}
              onClick={handleEdit}
              to={`/EditAgenda/${agendaId[0]}`}
            >
              Edit
            </Button>
            <Button
              endIcon={<Visibility />}
              variant="contained"
              color="inherit"
              style={{ margin: "10px" }}
              onClick={handlePhoto}
            >
              View Speaker Photo
            </Button>
          </div>
        </CardActions>
        <CardContent>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={agenda}
              columns={columns}
              pageSize={8}
              checkboxSelection
              onRowSelected={(e) => {
                if (e?.isSelected) {
                  setAgendaId([...agendaId, e?.data?.id]);
                } else {
                  const index = agendaId?.indexOf(e?.data?.id);
                  if (index > -1) {
                    const array = agendaId;
                    array.splice(index, 1);
                    setAgendaId(array);
                  }
                  if (agendaId?.length < 1) setAgendaId([]);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default ViewAgenda;
