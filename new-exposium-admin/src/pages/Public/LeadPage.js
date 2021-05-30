import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Layout } from "../../components";

import { Schedule } from "@material-ui/icons";
import PropTypes from "prop-types";
import { useAgenda, useLeadpageData, usePartcipantsLogo } from "../../hooks";
import { Skeleton } from "@material-ui/lab";
import moment from "moment";
const useStyles = makeStyles({
  root: {
    width: "80%",
    marginTop: "5vh",
  },
  tab: {
    flexGrow: 1,
    margin: "2vw",
  },
  Skeleton: {
    width: "30vw",
  },
});
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const LeadPage = () => {
  const classes = useStyles();
  const { leadPageData } = useLeadpageData();
  const { participantsLogo } = usePartcipantsLogo();
  const { agenda } = useAgenda();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => setValue(newValue);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const icon = new Image();
    icon.onload = function () {
      if (this.width > 600) setWidth(30);
      else setWidth(10);
    };
    icon.src = leadPageData?.logo;
  }, [leadPageData?.logo]);

  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item lg={7} md={6} sm={12} xs={12}>
          <div style={{ textAlign: "center", margin: "5vh 0 5vh 0" }}>
            {leadPageData?.title ? (
              <Typography component="span" variant="h2">
                {leadPageData?.title}
              </Typography>
            ) : (
              <Typography
                component="div"
                variant="h2"
                style={{ textAlign: "center", margin: "5vh" }}
              >
                <Skeleton />
              </Typography>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Schedule color="primary" />
              {leadPageData?.dateTime ? (
                <Typography
                  component="span"
                  variant="h6"
                  style={{ marginLeft: "1vw" }}
                  color="primary"
                >
                  {leadPageData?.dateTime}
                </Typography>
              ) : (
                <Typography component="div" variant="h6">
                  <Skeleton className={classes.Skeleton} />
                </Typography>
              )}
            </div>
          </div>
          <div className={classes.tab}>
            <Paper>
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <Tab label="Description" />
                <Tab label="Participants" />
                <Tab label="Agenda" />
              </Tabs>
            </Paper>
            <TabPanel value={value} index={0}>
              <div
                style={{
                  maxHeight: "90vh",
                  overflowY: "scroll",
                  paddingLeft: "5px",
                }}
              >
                {leadPageData?.description ? (
                  <>
                    {leadPageData?.description &&
                      parse("" + leadPageData?.description)}
                  </>
                ) : (
                  <div>
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="pulse" />
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div
                // className="d-flex flex-wrap justify-content-between align-items-center"
                style={{
                  maxHeight: "113vh",
                  overflowY: "scroll",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {participantsLogo ? (
                  participantsLogo.map((item, i) => (
                    <Card key={i} style={{ margin: "20px" }}>
                      <CardContent>
                        {item?.logoUrl ? (
                          <img
                            style={{
                              width: "170px",
                              height: "150px",
                              objectFit: "contain",
                            }}
                            src={item?.logoUrl}
                            alt=""
                          />
                        ) : (
                          <div style={{ width: "70vw" }}>
                            <Skeleton />
                            <Skeleton animation={false} />
                            <Skeleton animation="wave" />
                            <Skeleton />
                            <Skeleton animation={false} />
                            <Skeleton animation="palse" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div style={{ width: "70vw" }}>
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="palse" />
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div style={{ maxHeight: "90vh", overflowY: "scroll" }}>
                {agenda &&
                  agenda.map((data, i) => {
                    const todayDate = moment().format("YYYY-MM-DD");
                    const beginningTime = moment(data?.startTime, "h:mm:ss");
                    const currentTime = moment(new Date(), "h:mm:ss");
                    const isDisabled =
                      !beginningTime.isBefore(currentTime) ||
                      todayDate !== data?.date;
                    const fixDate = moment(data?.date).format("Do MMM ");

                    return (
                      <Grid
                        key={i}
                        container
                        style={{
                          display: "flex",
                          fontFamily: "sans-serif",
                          width: "100%",
                          padding: "2vh",
                        }}
                      >
                        <Grid item xs={12} sm={2}>
                          <div>
                            <div
                              style={{
                                display: "flex",

                                alignItems: "center",
                                position: "relative",
                                top: "2vh",
                              }}
                            >
                              <Button
                                variant="contained"
                                style={{
                                  background: "orange",
                                  color: "white",
                                }}
                                size="small"
                                disabled
                              >
                                {`${data?.startTime}${" "}${fixDate}`}
                              </Button>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Card>
                            <Container
                              style={{
                                padding: "2vh",
                                minHeight: "30vh",
                              }}
                            >
                              <div>
                                <Typography variant="subtitle1">
                                  <span>{data?.startTime}</span>
                                  {data?.endTime && (
                                    <span> - {data?.endTime}</span>
                                  )}
                                  ,<span> {fixDate}</span>
                                </Typography>
                              </div>
                              <Typography
                                variant="subtitle1"
                                style={{ color: "#40ace1" }}
                              >
                                {data?.title}
                              </Typography>
                              <Typography variant="subtitle1">
                                {data?.description}
                              </Typography>

                              <Grid container>
                                <Grid item xs={12} key={i}>
                                  <div>
                                    <CardHeader
                                      avatar={
                                        <Avatar
                                          style={{
                                            height: "70px",
                                            width: "70px",
                                          }}
                                          alt=""
                                          src={data?.speakerPhotoUrl}
                                        />
                                      }
                                      title={data?.speakerName}
                                      subheader={data?.degination}
                                    />
                                  </div>
                                </Grid>
                              </Grid>
                            </Container>
                            {data.zoomLink && (
                              <CardActions>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  href={data?.zoomLink}
                                  target="_blank"
                                  disabled={isDisabled}
                                >
                                  {isDisabled ? "Coming Soon" : "Attend Now"}
                                </Button>
                              </CardActions>
                            )}
                          </Card>
                        </Grid>
                      </Grid>
                    );
                  })}
              </div>
            </TabPanel>
          </div>
        </Grid>
        <Grid item lg={5} md={6} sm={12} xs={12}>
          <Container
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              margin: "5vh 0 5vh 0",
            }}
          >
            {leadPageData?.banner ? (
              <img src={leadPageData?.banner} alt="Banner" width="80%" />
            ) : (
              <Skeleton variant="rect" width={"80%"} height={"70vh"} />
            )}

            <Card className={classes.root}>
              <CardHeader title="Organized By " />
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: `${width}vh`,
                }}
              >
                {leadPageData?.logo ? (
                  <img
                    src={leadPageData?.logo}
                    alt="ICON"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div>
                    <Skeleton variant="circle" width="20vw" height="35vh" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Container>
        </Grid>
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          minHeight: "10vh",
          backgroundColor: "#1b1f2966",
        }}
      >
        <Typography component="span" style={{ color: "#575656" }}>
          Platform By{" "}
          <a
            href="http://exposium.live/"
            style={{ textDecoration: "none", color: "rgb(237 70 47)" }}
          >
            Exposium
          </a>
        </Typography>
        <Typography component="span" style={{ color: "#575656" }}>
          © Exposium 2021
        </Typography>
      </div>
    </Layout>
  );
};

export default LeadPage;
