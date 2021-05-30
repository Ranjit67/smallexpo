import React from "react";

import {
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  CardHeader,
} from "@material-ui/core";

import { Edit } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../../hooks";
import { Navigation } from "../../components";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  grid: {
    border: "1px solid grey",
  },
  frame: {
    margin: "10px",
  },
  table: {
    minWidth: 650,
  },
  root: {
    maxWidth: "40vw",
    maxHeight: "40vh",
  },
}));

const StallDetails = () => {
  const classes = useStyles();
  const { currentUserData } = useCurrentUser();
  const createData = (name, Data) => {
    return { name, Data };
  };

  const rows = [
    createData("STALLNAME", currentUserData?.stallName),
    createData("COMPANYNAME", currentUserData?.companyName),
    createData("EMAIL", currentUserData?.email),
    createData("COUNTRY", currentUserData?.country?.label),
    createData("CATEGORY", currentUserData?.category),
    createData("DESCRIPTION", currentUserData?.description),
  ];
  return (
    <Navigation>
      <Container component="main" maxWidth="lg">
        <Card>
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {currentUserData?.logoUrl && (
                <div className={classes.root}>
                  <img src={currentUserData?.logoUrl} alt="" />
                </div>
              )}
            </div>
            <CssBaseline />

            <TableContainer component={Paper} style={{ marginTop: "50px" }}>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row?.name}>
                      <TableCell component="th" scope="row">
                        {row?.name}
                      </TableCell>
                      <TableCell>{row?.Data || "Not Provided"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Card>
              <CardHeader title="Booth Design :" />

              <CardContent>
                {currentUserData?.bannerUrl ? (
                  <img
                    src={currentUserData?.bannerUrl}
                    alt="Booth Design"
                    width="100%"
                  />
                ) : (
                  <Typography variant="h6">Not Provided</Typography>
                )}
              </CardContent>
            </Card>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                className={classes.submit}
                startIcon={<Edit />}
                component={Link}
                to="/UpdateStall"
              >
                Edit Stall
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Navigation>
  );
};

export default StallDetails;
