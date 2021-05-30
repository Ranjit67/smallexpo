import {
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Delete, Search } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Navigation } from "../../components";
import { database } from "../../config";
import { usePartcipantsLogo } from "../../hooks";
import { AddLogo } from ".";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0px 10px 0px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const ViewLogo = () => {
  const classes = useStyles();
  const { participantsLogo } = usePartcipantsLogo();
  const [searchTxt, setSearchTxt] = useState("");
  const [searchRes, setSearchRes] = useState([]);

  const handleDelete = async (id) => {
    await database.ref(`Helpdesk/PartcipantsLogo/${id}`).remove();
  };
  useEffect(() => {
    if (searchTxt) {
      const arr = participantsLogo.filter((stall) =>
        stall?.logoTitle?.toUpperCase().includes(searchTxt.toUpperCase())
      );
      setSearchRes(arr);
    } else setSearchRes(participantsLogo);
  }, [participantsLogo, searchTxt]);

  return (
    <Navigation>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          component="form"
          className={classes.root}
          style={{ width: "60%" }}
        >
          <IconButton type="submit" className={classes.iconButton}>
            <Search />
          </IconButton>
          <InputBase
            placeholder="Enter Company Name Here"
            fullWidth
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
          />
        </Paper>
      </div>

      <Divider style={{ width: "10px" }} />

      <Grid container spacing={2} style={{ marginTop: "2vh" }}>
        {searchRes &&
          searchRes.map((item, i) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={i}>
              <Card style={{ height: "30vh", minWidth: "18vw" }}>
                <CardContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item?.logoUrl}
                    alt={item?.logoTitle}
                    width="100%"
                    height="100%"
                    style={{ height: "15vh" }}
                  />
                  <Typography variant="subtitle1">{item?.logoTitle}</Typography>
                </CardContent>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IconButton onClick={() => handleDelete(item?.id)}>
                    <Delete color="secondary" />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
      </Grid>
      <AddLogo />
    </Navigation>
  );
};

export default ViewLogo;
