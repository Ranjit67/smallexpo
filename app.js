const express = require("express");
const socket = require("socket.io");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { AwakeHeroku } = require("awake-heroku");

AwakeHeroku.add({
  url: "https://exposium-api.herokuapp.com",
});

//https://exposium-live-2021.web.app
//http://localhost:5000/
//https://exposium-api.herokuapp.com/
const io = socket(server);
// , {
//   cors: {
//     origin: "*",
//   },
// }
app.use(express.static("./new-exposium-admin/build"));

const requestList = {};
// const timeList = {}
const stallId = {};
const userId = {};
const userWantToConnect = {};
const stallSoIdToId = {};
const userSoIdToId = {};
const stallToConnect = {};
const userToConnect = {};
const userTimeStamp = {};
//end verb
io.on("connection", (socket) => {
  socket.on("send request to stall", (payload) => {
    userWantToConnect[payload.user] = payload.stall;
    if (!requestList[payload.stall]) {
      requestList[payload.stall] = [];
    }
    if (userId[payload.user]) {
      userId[payload.user] = socket.id;

      userSoIdToId[socket.id] = payload.user;
    } else {
      userId[payload.user] = socket.id;
      userSoIdToId[socket.id] = payload.user;
      userTimeStamp[payload.user] = payload.time;

      requestList[payload.stall].push(payload.user);

      if (stallId[payload.stall]) {
        io.to(stallId[payload.stall]).emit("already exited stall owner", {
          user: payload.user,
          time: payload.time,
        });
      }
    }
  });
  //for stall
  socket.on("requested list", (payload) => {
    stallId[payload.stall] = socket.id;
    stallSoIdToId[socket.id] = payload.stall;
    if (requestList[payload?.stall]) {
      socket.emit("list of the request", { list: requestList[payload.stall] });
    }
  });
  socket.on("sending signal", async (payload) => {
    const { userToSignal, callerID, signal, stall } = payload;
    // update stallSoIdToId

    delete stallSoIdToId[stallId[stall]];
    delete userWantToConnect[userToSignal];
    stallSoIdToId[socket.id] = stall;
    stallId[stall] = socket.id;
    stallToConnect[stall] = userToSignal;
    userToConnect[userToSignal] = stall;
    const userSocketId = await userId?.[userToSignal];
    // console.log(userSocketId);
    io.to(userSocketId).emit("signal to user", { callerID, signal });
  });
  socket.on("returning signal", async (payload) => {
    const { signal, stall } = payload;
    const stallSocketId = await stallId?.[stall];
    // console.log(stallSocketId);
    io.to(stallSocketId).emit("send signal to stall", { signal });
  });

  socket.on("call reject", (payload) => {
    const { stallId, rejectedId } = payload;
    const afterReject = requestList[stallId].filter((id) => id !== rejectedId);
    requestList[stallId] = afterReject;
    io.to(userId[rejectedId]).emit("stall reject to user", "data");
  });
  //mic status
  socket.on("micro phone status", (payload) => {
    const { selfId, micStatus } = payload;
    if (stallToConnect[selfId]) {
      io.to(userId[stallToConnect[selfId]]).emit("send mic status to user", {
        micStatus,
      });
    } else if (userToConnect[selfId]) {
      io.to(stallId[userToConnect[selfId]]).emit("send mic status to stall", {
        micStatus,
      });
    } else {
      socket.emit("wait for connection", "audio");
    }
  });
  //mic end
  // video status
  socket.on("video status send", (payload) => {
    const { selfId, videoStatus } = payload;
    if (stallToConnect[selfId]) {
      io.to(userId[stallToConnect[selfId]]).emit("send video status to user", {
        videoStatus,
      });
    }
    if (userToConnect[selfId]) {
      io.to(stallId[userToConnect[selfId]]).emit("send video status to stall", {
        videoStatus,
      });
    }
  });
  socket.on("End call", (payload) => {
    const { selfId } = payload;
    if (stallToConnect[selfId]) {
      //stall
      const stillHave = requestList[selfId].filter(
        (id) => id !== stallToConnect[selfId]
      );
      requestList[selfId] = stillHave;
      const tempUserId = userId[stallToConnect[selfId]];
      delete userSoIdToId[userId[stallToConnect[selfId]]];
      delete userId[stallToConnect[selfId]];
      delete userToConnect[stallToConnect[selfId]];
      delete stallToConnect[selfId];
      io.to(tempUserId).emit("Disconnect call", "to user");
      socket.emit("you are disconnected", "self disconnected");
    }
    if (userId[selfId]) {
      if (userToConnect[selfId]) {
        const tempStallId = stallId[userToConnect[selfId]];
        const haveData = requestList[userToConnect[selfId]].filter(
          (id) => id !== selfId
        );
        requestList[userToConnect[selfId]] = haveData;
        delete userSoIdToId[userId[selfId]];
        delete userId[selfId];
        delete userToConnect[selfId];
        delete stallToConnect[userToConnect[selfId]];
        // console.log(tempStallId);
        io.to(tempStallId).emit("Disconnect call", {
          haveData,
          userUuid: selfId,
        });
        socket.emit("you are disconnected", "self disconnected");
      } else {
        delete userSoIdToId[userId[selfId]];
        delete userWantToConnect[selfId];
        socket.emit("you are disconnected", "self disconnected");
        console.log("hit");
      }
      // console.log("discconnect");
      socket.emit("you are disconnected", "self disconnected");
    }
  });
  socket.on("no one connected disconnect", (payload) => {
    const { selfId, stall } = payload;
    delete userId[selfId];
    delete userSoIdToId[socket.id];
    // console.log(userWantToConnect[selfId]);

    if (userWantToConnect[selfId]) {
      const exitUser = requestList[userWantToConnect[selfId]].filter(
        (id) => id !== selfId
      );
      requestList[userWantToConnect[selfId]] = exitUser;
      delete userWantToConnect[selfId];
      // console.log("d", stallId[stall]);
      io.to(stallId[stall]).emit("remove user", { newRequestList: exitUser });
    }

    //
    socket.emit("you are disconnected", "self disconnected");
  });

  //video status end
  //chat section
  socket.on("send message user", (payload) => {
    const { message, userSelf, date } = payload;

    io.to(stallId[userToConnect[userSelf]]).emit("receive message", {
      senderId: userSelf,
      message,
      hours: new Date().getHours(),
      minute: new Date().getMinutes(),
      year: new Date().getFullYear(),
      day: new Date().getDay(),
      month: new Date().getMonth(),
    });
  });
  socket.on("send message stall", (payload) => {
    const { message, stallSelf, date } = payload;
    io.to(userId[stallToConnect[stallSelf]]).emit("receive message", {
      senderId: stallSelf,
      message,
      hours: new Date().getHours(),
      minute: new Date().getMinutes(),
      year: new Date().getFullYear(),
      day: new Date().getDay(),
      month: new Date().getMonth(),
    });
  });
  //chat section end

  socket.on("disconnect", () => {
    //stall disconnected
    if (stallSoIdToId[socket.id]) {
      // console.log("This the stall");
      delete stallId[stallSoIdToId[socket.id]];
      // stallToConnect[stallSoIdToId[socket.id]] = userToSignal;
      if (stallToConnect[stallSoIdToId[socket.id]]) {
        io.to(userId[stallToConnect[stallSoIdToId[socket.id]]]).emit(
          "stall owner disconnect call",
          "data"
        );
      }
      // delete userSoIdToId[userId[stallToConnect[stallSoIdToId[socket.id]]]];
      // delete userId[stallToConnect[stallSoIdToId[socket.id]]];
      // delete userToConnect[stallToConnect[stallSoIdToId[socket.id]]];
      delete stallToConnect[stallSoIdToId[socket.id]];
      delete stallSoIdToId[socket.id];
    }
    //user Disconnected
    if (userSoIdToId[socket.id]) {
      if (userToConnect[userSoIdToId[socket.id]]) {
        const withdrawUser = requestList[
          userToConnect[userSoIdToId[socket.id]]
        ].filter((id) => id !== userSoIdToId[socket.id]);
        requestList[userToConnect[userSoIdToId[socket.id]]] = withdrawUser;
        //request lit remove end
        // console.log(stallId[userToConnect[userSoIdToId[socket.id]]]);
        io.to(stallId[userToConnect[userSoIdToId[socket.id]]]).emit(
          "User is disconnected",
          "data"
        );
        delete stallToConnect[userToConnect[userSoIdToId[socket.id]]];
        delete userToConnect[userSoIdToId[socket.id]];
        delete userId[userSoIdToId[socket.id]];
        delete userSoIdToId[socket.id];
      } else {
        delete userId[userSoIdToId[socket.id]];
        // console.log(userWantToConnect[userSoIdToId[socket.id]]);
        if (userWantToConnect[userSoIdToId[socket.id]]) {
          const exitRequest = requestList[
            userWantToConnect[userSoIdToId[socket.id]]
          ].filter((id) => id !== userSoIdToId[socket.id]);
          requestList[userWantToConnect[userSoIdToId[socket.id]]] = exitRequest;
          io.to(stallId[userWantToConnect[userSoIdToId[socket.id]]]).emit(
            "remove user",
            { newRequestList: exitRequest }
          );
          //delete data
          delete userWantToConnect[userSoIdToId[socket.id]];
          delete userSoIdToId[socket.id];
        }
      }
    }
  });
});
//end //data send

// group video stream
// const roomSpeaker = {};
const sRoomUser = {};
const sHostSpeakerUidToSoId = {};
const sHostSpeakerSoIdToUid = {};

//user verb
const sUserUidToSoId = {};
const sUserSoIdToUid = {};

// const sUserConnectedTo={}
io.of("/group").on("connection", (socket) => {
  try {
    //host speaker join..
    socket.on("host speaker join", (payload) => {
      const { hostSpeaker } = payload;
      if (sHostSpeakerUidToSoId[hostSpeaker]) {
        delete sHostSpeakerSoIdToUid[sHostSpeakerUidToSoId[hostSpeaker]];
        delete sHostSpeakerUidToSoId[hostSpeaker];
      }
      if (!sRoomUser[hostSpeaker]) {
        sRoomUser[hostSpeaker] = [];
      }
      sHostSpeakerSoIdToUid[socket.id] = hostSpeaker;
      sHostSpeakerUidToSoId[hostSpeaker] = socket.id; //both are maniculate reconnect
    });
    //user join want to connect
    socket.on("user want join", (payload) => {
      const { userUid, hostUid } = payload;
      sUserUidToSoId[userUid];
      if (sUserUidToSoId[userUid]) {
        delete sUserSoIdToUid[sUserUidToSoId[userUid]];
        delete sUserUidToSoId[userUid];
      }
      sUserSoIdToUid[socket.id] = userUid;
      sUserUidToSoId[userUid] = socket.id;
      // sUserConnectedTo[userUid]
      if (sHostSpeakerUidToSoId[hostUid]) {
        io.to(sHostSpeakerUidToSoId[hostUid]).emit(
          "user send connection request to host",
          { userUid }
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// if (process.env.NODE_ENV === "production") {
// app.use(express.static("new-exposium-admin/build"));
// }
server.listen(process.env.PORT || 5000, () => {
  console.log("5000 port ready to start");
});
