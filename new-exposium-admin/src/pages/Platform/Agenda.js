import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import React from "react";
import { Layout } from "../../components";
import { useAgenda } from "../../hooks";

const Agenda = () => {
  const { agenda } = useAgenda();
  return (
    <Layout>
      <Container maxWidth="md">
        {agenda &&
          agenda?.map((data, i) => {
            const todayDate = moment().format("YYYY-MM-DD");
            const beginningTime = moment(data?.startTime, "h:mm:ss");
            const currentTime = moment(new Date(), "h:mm:ss");
            const isDisabled =
              !beginningTime.isBefore(currentTime) || todayDate !== data?.date;
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
                      {data.startTime && (
                        <Button
                          variant="contained"
                          style={{
                            background: "orange",
                            color: "white",
                            padding: "4px 5px",
                          }}
                          size="small"
                          disabled
                        >
                          {data?.startTime}
                        </Button>
                      )}
                      {data.date && (
                        <Button
                          variant="contained"
                          style={{
                            background: "orange",
                            color: "white",
                            padding: "4px 5px",
                            marginLeft: "1vh",
                          }}
                          size="small"
                          disabled
                        >
                          {fixDate}
                        </Button>
                      )}
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={10}>
                  <Card>
                    <Container
                      style={{
                        padding: "2vh",
                      }}
                    >
                      <div>
                        <Typography variant="subtitle1">
                          <span>{data?.startTime}</span>
                          {data?.endTime && <span> - {data?.endTime}</span>},
                          <span> {fixDate}</span>
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
                          href={data?.zoom}
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
      </Container>
    </Layout>
  );
};

export default Agenda;
