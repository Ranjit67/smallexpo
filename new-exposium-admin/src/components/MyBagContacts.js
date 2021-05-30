import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import {
  Close,
  ContactsOutlined,
  Delete,
  Visibility,
} from "@material-ui/icons";

import React, { useEffect, useState } from "react";
import { auth, database } from "../config";
import { useAllUsersData, useMyBag } from "../hooks";
const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
  paper: { minWidth: "900px" },
}));

const MyBagContacts = () => {
  const uid = auth?.currentUser?.uid;
  const theme = useTheme();
  const classes = useStyles();
  const { bagContacts } = useMyBag();
  const { allUsersData } = useAllUsersData();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedContacts, setSelectedContacts] = useState({});
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);

  const handleClose = () => setOpen(false);
  useEffect(() => {
    const arr = allUsersData.filter((elem) =>
      bagContacts.find(({ personID }) => elem.id === personID)
    );
    setContacts(arr);
  }, [allUsersData, bagContacts]);

  function createData(name, field) {
    return { name, field };
  }
  useEffect(() => {
    const row = [
      createData("Name", selectedContacts?.name),
      createData("Email", selectedContacts?.email),
      createData("Phone", selectedContacts?.phone),
      createData("Country", selectedContacts?.country?.label || "Not Provided"),
      createData("Resident", selectedContacts?.resident),
      createData("Company", selectedContacts?.companyName),
      createData("Stall name", selectedContacts?.stallName),
    ];
    setRows(row);
  }, [selectedContacts]);

  const handleClick = (item) => {
    setSelectedContacts(item);
    setOpen(true);
  };
  const handleDelete = async (key) => {
    const arr = bagContacts.filter((item) => item.personID === key);
    await database.ref(`Users/${uid}/MyBag/Contact/${arr[0].id}`).remove();
    if (bagContacts.length < 2) window.location.reload();
  };

  return (
    <div>
      <Grid
        container
        spacing={4}
        style={{
          minHeight: "45vh",
        }}
      >
        {contacts?.length ? (
          <>
            {contacts.map((item, i) => (
              <Grid item lg={3} sm={4} xs={6} md={3} key={i}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Typography>{item?.name}</Typography>
                    </CardContent>
                  </Card>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                    }}
                  >
                    <Fab
                      size="small"
                      color="secondary"
                      style={{
                        margin: "3px",
                      }}
                      onClick={() => handleDelete(item?.id)}
                    >
                      <Delete />
                    </Fab>
                    <Fab
                      size="small"
                      color="primary"
                      style={{
                        margin: "3px",
                      }}
                      onClick={() => handleClick(item)}
                    >
                      <Visibility />
                    </Fab>
                  </div>
                </div>
              </Grid>
            ))}
          </>
        ) : (
          <div
            style={{
              display: "grid",
              placeContent: "center",
              placeItems: "center",
              width: "100%",
              minHeight: "45vh",
            }}
          >
            <ContactsOutlined fontSize="large" />
            <h1>No Contacts Found</h1>
          </div>
        )}
      </Grid>

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
            <Typography variant="h5">Profile Info</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Details</TableCell>
                  <TableCell align="right">Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length &&
                  rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {row?.name}
                      </TableCell>
                      <TableCell align="right">
                        {row?.field || "Not Provided"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBagContacts;
