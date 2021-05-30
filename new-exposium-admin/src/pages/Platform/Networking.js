import React, { useState } from "react";
import { Layout } from "../../components";
import IMG from "../../assets/Networking.png";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function createData(name, number) {
  return { name, number };
}

const Networking = () => {
  const classes = useStyles();
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState(0);
  const [popup, setPopup] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleClose = () => setPopup(false);
  const rows = [
    createData("Table Number", table),
    createData("Total Available Space", 4),
    createData("Total Remaining Space", 3),
  ];

  return (
    <Layout>
      <div style={{ height: "90vh" }}>
        <img src={IMG} alt="" width="100%" height="103%" />
      </div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={popup}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          style={{
            minWidth: "40vw",
            backgroundColor: "#ff746afa",
            color: "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Table Details</Typography>
            <IconButton color="inherit" onClick={handleClose}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row?.number || 4}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "20px",
            }}
          >
            <Button
              style={{ border: "2px solid red", margin: "5px" }}
              onClick={() => setPopup(false)}
            >
              {" "}
              Close
            </Button>
            <Button
              style={{ border: "2px solid blue", margin: "5px" }}
              onClick={() => setPopup(false)}
            >
              {" "}
              Take me In
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Fade in={open}>
        <Card
          style={{
            height: "25vh",
            width: "30vw",
            position: "absolute",
            top: `${top}vh`,
            left: `${left}vw`,
            overflowY: "scroll",
          }}
        >
          <CardHeader
            title={`Table ${table}`}
            style={{ backgroundColor: "#d9d9d9" }}
          />
          <CardContent>
            Sed posuere consectetur est at lobortis. Aenean eu leo quam.
            Pellentesque ornare sem lacinia quam venenatis vestibulum.
          </CardContent>
          <CardActions
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Button
              style={{ border: "2px solid red", margin: "5px" }}
              onClick={() => setOpen(false)}
            >
              {" "}
              Close
            </Button>
            <Button
              style={{ border: "2px solid blue", margin: "5px" }}
              onClick={() => {
                setPopup(true);
                setOpen(false);
              }}
            >
              {" "}
              View Details
            </Button>
          </CardActions>
        </Card>
      </Fade>
      <Button
        style={{ position: "absolute", top: "52vh", left: "13vw", padding: 20 }}
        onClick={() => {
          setTable(1);
          setOpen(!open);
          setTop(26);
          setLeft(5);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "52vh", left: "27vw", padding: 20 }}
        onClick={() => {
          setTable(2);
          setOpen(!open);
          setTop(26);
          setLeft(15);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "52vh", left: "40vw", padding: 20 }}
        onClick={() => {
          setTable(3);
          setOpen(!open);
          setTop(26);
          setLeft(28);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "52vh", left: "54vw", padding: 20 }}
        onClick={() => {
          setTable(4);
          setOpen(!open);
          setTop(26);
          setLeft(40);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "52vh", left: "68vw", padding: 20 }}
        onClick={() => {
          setTable(5);
          setOpen(!open);
          setTop(26);
          setLeft(55);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "52vh", left: "82vw", padding: 20 }}
        onClick={() => {
          setTable(6);
          setOpen(!open);
          setTop(26);
          setLeft(67);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "7vw", padding: 20 }}
        onClick={() => {
          setTable(7);
          setOpen(!open);
          setTop(40);
          setLeft(1);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "23vw", padding: 20 }}
        onClick={() => {
          setTable(8);
          setOpen(!open);
          setTop(40);
          setLeft(12);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "39vw", padding: 20 }}
        onClick={() => {
          setTable(9);
          setOpen(!open);
          setTop(40);
          setLeft(27);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "55vw", padding: 20 }}
        onClick={() => {
          setTable(10);
          setOpen(!open);
          setTop(40);
          setLeft(41);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "71vw", padding: 20 }}
        onClick={() => {
          setTable(11);
          setOpen(!open);
          setTop(40);
          setLeft(57);
        }}
      ></Button>
      <Button
        style={{ position: "absolute", top: "64vh", left: "86vw", padding: 20 }}
        onClick={() => {
          setTable(12);
          setOpen(!open);
          setTop(40);
          setLeft(69);
        }}
      ></Button>
    </Layout>
  );
};

export default Networking;
