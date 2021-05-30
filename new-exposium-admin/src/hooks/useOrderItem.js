import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useOrderItem = () => {
  const uid = auth?.currentUser?.uid;
  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    database.ref(`Users/${uid}/MyBag/Order/`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj) arr.push({ orderID: key, ...obj[key] });
        setOrderItems(arr);
      }
    });
    return () => {
      setOrderItems([]);
    };
  }, [uid]);
  return { orderItems };
};

export default useOrderItem;
