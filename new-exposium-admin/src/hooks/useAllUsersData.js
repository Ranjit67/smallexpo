import { useEffect, useState } from "react";
import { database } from "../config";

const useAllUsersData = () => {
  const [allUsersData, setAllUsersData] = useState([]);

  useEffect(() => {
    database.ref(`Users/`).on("value", (snap) => {
      if (snap.exists()) {
        const arr = [];
        let slno = 1;
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            slno: slno++,
            email: obj[key]?.email || "Not Found",
            ...obj[key],
          });
        setAllUsersData(arr);
      }
    });
    return () => {
      setAllUsersData([]);
    };
  }, []);

  return { allUsersData };
};

export default useAllUsersData;
