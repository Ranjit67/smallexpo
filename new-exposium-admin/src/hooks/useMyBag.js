import { useEffect, useState } from "react";
import { auth, database } from "../config";

const useMyBag = () => {
  const uid = auth?.currentUser?.uid;
  const [bagVideo, setBagVideo] = useState([]);
  const [bagDocuments, setBagDocuments] = useState([]);
  const [bagProducts, setBagProducts] = useState([]);
  const [bagContacts, setBagContacts] = useState([]);
  useEffect(() => {
    database.ref(`Users/${uid}/MyBag/Video`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            video: obj[key],
          });
        setBagVideo(arr);
      }
    });
    database.ref(`Users/${uid}/MyBag/Documents`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            documents: obj[key],
          });
        setBagDocuments(arr);
      }
    });
    database.ref(`Users/${uid}/MyBag/Products`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            productID: obj[key]?.key,
            ...obj[key],
          });
        setBagProducts(arr);
      }
    });
    database.ref(`Users/${uid}/MyBag/Contact`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            id: key,
            personID: obj[key]?.personID,
          });
        setBagContacts(arr);
      }
    });
    return () => {
      setBagDocuments([]);
      setBagVideo([]);
      setBagProducts([]);
      setBagContacts([]);
    };
  }, [uid]);
  return { bagVideo, bagDocuments, bagProducts, bagContacts };
};

export default useMyBag;
