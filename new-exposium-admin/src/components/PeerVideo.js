import { Card, makeStyles } from "@material-ui/core";
import { useRef, useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  peerVideo: {
    width: "100%",
    height: "90%",
    objectFit: "cover",
  },
  cardCover: {
    top: 0,
    width: "100%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  cardCoverOff: {
    overflow: "hidden",
    width: 0,
    height: 0,
  },
}));
export default function PeerVideo(props) {
  const ref = useRef();
  const classes = useStyles();
  useEffect(() => {
    if (props?.peer) {
      props?.peer?.on("stream", (stream) => {
        ref.current.srcObject = stream;
      });
    }
  }, [props.mic, props?.peer, props.videoCont]);

  return (
    props.peer && (
      <>
        <video
          playsInline
          autoPlay
          muted={props.mic}
          className={classes.peerVideo}
          ref={ref}
        />

        <Card
          elevation={3}
          className={props.videoCont ? classes.cardCoverOff : classes.cardCover}
        >
          <h3>Host has muted</h3>
        </Card>
      </>
    )
  );
}
