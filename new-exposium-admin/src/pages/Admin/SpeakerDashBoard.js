import { Grid } from "@material-ui/core";
import { EmojiPeopleSharp, Event, Person } from "@material-ui/icons";
import React from "react";

import { DashboardCard } from "../../components";

const SpeakerDashBoard = () => {
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <DashboardCard
            title={"Visitors"}
            data={0}
            icon={<EmojiPeopleSharp color="primary" />}
          />
        </Grid>

        <Grid item lg={4} md={4} sm={6} xs={12}>
          <DashboardCard
            title={"Total Users"}
            data={10}
            icon={<Event color="action" />}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={12}>
          <DashboardCard
            title={"Total Online User"}
            data={0}
            icon={<Person style={{ color: "yellowgreen" }} />}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SpeakerDashBoard;
