import { useEffect, useRef, useState } from "react";
import { Navigation } from "../../components";
import { auth } from "../../config";
import io from "socket.io-client";
import { makeStyles, Typography } from "@material-ui/core";
import LiveClassCard from "../../components/LiveClassCard";
import { useHistory } from "react-router";
import { Videocam } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  cardContRootDiv: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(18rem,1fr))",
    gridGap: "1rem",
    minHeight: "80vh",
  },
  zeroRequestOuterDiv: {
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  makeCard: {
    marginBottom: 20,
    height: 274,
    backgroundColor: "red",
  },
}));

const StallVideoCall = () => {
  const classes = useStyles();
  const history = useHistory();
  console.log(auth?.currentUser?.uid);
  const socketRef = useRef();
  const [requestList, setRequestList] = useState([]);
  const requestData = useRef([]);
  useEffect(() => {
    // https://exposium-api.herokuapp.com/
    //http://localhost:5000/
    socketRef.current = io.connect("/");
    socketRef.current.emit("requested list", { stall: auth?.currentUser?.uid });
    socketRef.current.on("list of the request", (payload) => {
      // console.log(payload);
      requestData.current = payload?.list;
      setRequestList(payload?.list);
    });
    socketRef.current.on("already exited stall owner", (payload) => {
      setRequestList((prev) => [...prev, payload?.user]);
      // console.log(payload?.user);
    });
    socketRef.current.on("remove user", (payload) => {
      const { newRequestList } = payload;
      console.log(newRequestList);
      setRequestList(newRequestList);
      // console.log(requestData.current);
    });
    socketRef.current.on("Disconnect call", (payload) => {
      // console.log(payload);
      const { haveData } = payload;
      console.log(haveData);
      setRequestList(haveData);
      // console.log(requestData.current);
    });
  }, []);
  //end
  //for rejection
  const rejectCall = (id) => {
    const tempArray = requestList.filter((req) => req !== id);
    setRequestList(tempArray);
    socketRef.current.emit("call reject", {
      stallId: auth?.currentUser?.uid,
      rejectedId: id,
    });
  };
  const acceptRequest = (id) => {
    history.push(`/StallVideoCall/${id}`);
  };
  // console.log(requestList);
  return (
    <Navigation>
      <div
        className={
          requestList?.length > 0
            ? classes.cardContRootDiv
            : classes.zeroRequestOuterDiv
        }
      >
        {requestList?.length > 0 ? (
          requestList?.map((item, index) => {
            console.log(item);
            return (
              <LiveClassCard
                key={index}
                user={item}
                rejectCall={rejectCall}
                acceptRequest={acceptRequest}
              />
            );
          })
        ) : (
          <>
            <Videocam fontSize="large" />
            <Typography variant="h4" component="h2">
              NO video call request found..
            </Typography>
          </>
        )}
      </div>
    </Navigation>
  );
};

export default StallVideoCall;
