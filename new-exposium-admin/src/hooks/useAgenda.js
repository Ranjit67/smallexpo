import { useEffect, useState } from "react";
import { database } from "../config";

const useAgenda = () => {
  const [agenda, setAgenda] = useState([]);
  useEffect(() => {
    database.ref(`Helpdesk/Agenda`).on(`value`, (snap) => {
      const arr = [];
      let slno = 1;
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            slno: slno++,
            ...obj[key],
          });
        setAgenda(arr);
      }
    });
    return () => {
      setAgenda([]);
    };
  }, []);
  return { agenda };
};

export default useAgenda;
