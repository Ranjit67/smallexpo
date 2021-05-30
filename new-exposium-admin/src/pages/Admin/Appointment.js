import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import React, { useState } from "react";

import { CSVLink } from "react-csv";
import { DataGrid } from "@material-ui/data-grid";
import { useAppointment } from "../../hooks";
import { Navigation } from "../../components";
const useStyles = makeStyles({
  table: {
    minWidth: 550,
  },
});
function createData(name, data) {
  return { name, data };
}

const Appointment = () => {
  const { appointment } = useAppointment();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const columns = [
    { field: "slno", headerName: "SL No.", width: 100 },
    { field: "name", headerName: " Name", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "subject", headerName: "Subject", width: 130 },
    { field: "date", headerName: "Date", width: 180 },
    { field: "message", headerName: "Message", width: 480 },
  ];
  const headers = [
    { label: "SL No.", key: "slno" },
    { label: " Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Subject", key: "subject" },
    { label: "Date", key: "date" },
    { label: "Message", key: "message" },
  ];
  const rows = [
    createData("Date", data?.date),
    createData("Subject", data?.subject),
    createData("Message", data?.message),
  ];

  return (
    <Navigation>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <CardHeader
            avatar={
              <Avatar
                style={{
                  height: "40px",
                  width: "40px",
                }}
                alt=""
                src=""
              />
            }
            title={data?.name || "Not Provided"}
            subheader={data?.email || "Not Provided"}
          />
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table className={classes.table}>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row?.name || "Not Provided"}
                    </TableCell>
                    <TableCell align="left">
                      {row?.data || "Not Provided"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px",
        }}
      >
        <CSVLink
          data={appointment}
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
        <CardContent>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={appointment}
              columns={columns}
              pageSize={8}
              onRowClick={(e) => {
                setOpen(true);
                setData(e.row);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Navigation>
  );
};

export default Appointment;
