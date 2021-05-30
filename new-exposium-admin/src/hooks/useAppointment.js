import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useAppointment = () => {
  const uid = auth?.currentUser?.uid;
  const [appointment, setAppointment] = useState([]);
  useEffect(() => {
    database.ref(`Users/${uid}/Appointment`).on(`value`, (snap) => {
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
        setAppointment(arr);
      }
      return () => {
        setAppointment([]);
      };
    });
  }, [uid]);
  return { appointment };
};

export default useAppointment;
