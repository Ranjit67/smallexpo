import { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  makeStyles,
} from "@material-ui/core";
import { database } from "../config";
const useStyles = makeStyles((theme) => ({
  cardRoot: {
    marginBottom: 20,
    height: 235,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  cardAction: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  attendClass: {
    backgroundColor: "blue",
    marginBottom: 10,
  },
  subName: {
    fontWeight: 500,
    fontSize: "2.5rem",
    textTransform: "capitalize",
  },
}));
export default function LiveClassCard(props) {
  const classes = useStyles();
  // console.log(props.user);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    console.log(props.user);
    database.ref(`Users/${props?.user}`).on("value", (snap) => {
      console.log(snap.val().name);
      setUserName(snap.val().name);
    });
  }, []);
  return (
    <Card elevation={5} className={classes.cardRoot}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" align="center" component="h2">
            {userName && userName}
          </Typography>
          <Typography gutterBottom variant="h6" align="center" component="h2">
            {/* Date formate */}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions classes={{ root: classes.cardAction }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.acceptRequest(props.user)}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.rejectCall(props.user)}
        >
          Reject
        </Button>
      </CardActions>
    </Card>
  );
}
