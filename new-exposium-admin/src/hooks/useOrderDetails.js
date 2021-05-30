import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useOrderDetails = () => {
  const uid = auth?.currentUser?.uid;
  const [orderDetails, setOrderDetails] = useState([]);
  useEffect(() => {
    database.ref(`OrderProduct/${uid}/`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj) arr.push({ id: key, ...obj[key] });
        setOrderDetails(arr);
      }
    });
    return () => {
      setOrderDetails([]);
    };
  }, [uid]);
  return { orderDetails };
};

export default useOrderDetails;
