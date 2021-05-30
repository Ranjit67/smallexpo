import { Card, CardContent, Divider } from "@material-ui/core";
import React from "react";
import parse from "html-react-parser";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import { useLeadpageData } from "../../hooks";
import { Dailoug, Navigation } from "../../components";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const LeadPageData = () => {
  const classes = useStyles();
  const { leadPageData } = useLeadpageData();
  function createData(title, value) {
    return { title, value };
  }

  const rows = [
    createData("Title:", leadPageData?.title),
    createData("Date&Time:", leadPageData?.dateTime),
    createData(
      "Description:",
      leadPageData?.description && parse("" + leadPageData?.description)
    ),
  ];
  return (
    <Navigation>
      <Grid
        container
        spacing={3}
        style={{
          marginTop: "2vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item>
          <Card>
            <CardContent>
              <div
                style={{
                  marginBottom: "2vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <TableContainer>
                  <Table className={classes.table}>
                    <TableBody>
                      {rows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell align="left">
                            <Typography variant="subtitle1">
                              {row.title}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="subtitle1">
                              {row.value}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
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
                <Typography variant="subtitle1">Event Banner</Typography>
                <img
                  src={leadPageData?.banner}
                  alt="not found"
                  height="500vh"
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} xs={12}>
          <Card>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  minHeight: "67vh",
                }}
              >
                <div>
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ marginBottom: "2vh" }}
                  >
                    Icon
                  </Typography>

                  <Card>
                    <img
                      src={leadPageData?.icon}
                      alt="not found"
                      style={{
                        margin: "3vh",
                        maxWidth: "80%",
                      }}
                    />
                  </Card>
                </div>
                <Divider />

                <div>
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ marginBottom: "2vh" }}
                  >
                    Organizer Logo
                  </Typography>
                  <Card>
                    <img
                      src={leadPageData?.logo}
                      alt="not found"
                      style={{
                        marginBottom: "1vh",
                        maxWidth: "80%",
                      }}
                    />
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dailoug />
    </Navigation>
  );
};

export default LeadPageData;
