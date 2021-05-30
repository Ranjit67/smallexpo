import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useAdminPoll = () => {
  const uid = auth?.currentUser?.uid;
  const [pollData, setPollData] = useState([]);

  useEffect(() => {
    database.ref(`Poll/${uid}`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            pollID: key,
            ...obj[key],
          });
        setPollData(arr);
      }
    });

    return () => {
      setPollData([]);
    };
  }, [uid]);
  return { pollData };
};

export default useAdminPoll;
