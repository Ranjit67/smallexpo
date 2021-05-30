import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useVisitedStalls = () => {
  const uid = auth?.currentUser?.uid;
  const [visitedStall, setVisitedStall] = useState([]);
  useEffect(() => {
    database.ref(`Visitors/User/${uid}`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj) arr.push({ ...obj[key] });
        setVisitedStall(arr);
      }
    });
    return () => {
      setVisitedStall([]);
      
    };
  }, [uid]);
  return { visitedStall };
};

export default useVisitedStalls;
