import { useEffect, useState } from "react";
import { database } from "../config";

const useProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    database.ref(`Products/`).on(`value`, (snap) => {
      const arr = [];
      if (snap.exists()) {
        const obj = snap.val();
        for (const key in obj)
          arr.push({
            key,
            ...obj[key],
          });
        setAllProducts(arr);
      }
    });
    return () => {
      setAllProducts([]);
    };
  }, []);
  return { allProducts };
};

export default useProducts;
