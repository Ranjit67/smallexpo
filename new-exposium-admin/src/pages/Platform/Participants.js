import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { Layout } from "../../components";
import { useAllUsersData, useCountry, useCurrentUser } from "../../hooks";
import { auth, database } from "../../config";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
}));
const Participants = () => {
  const classes = useStyles();
  const uid = auth?.currentUser?.uid;

  const { currentUserData } = useCurrentUser();
  const { countries } = useCountry();
  const { allUsersData } = useAllUsersData();
  const [stalls, setStalls] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const catagory = ["College", "Company", "University", "Other"];
  useEffect(() => {
    const arr = allUsersData.filter((item) => item?.role === "stall");
    setStalls(arr);
  }, [allUsersData]);

  useEffect(() => {
    if (searchTxt) {
      const resArr = stalls.filter(
        (stall) =>
          stall?.email?.toUpperCase().includes(searchTxt?.toUpperCase()) ||
          stall?.fname?.toUpperCase().includes(searchTxt?.toUpperCase()) ||
          stall?.ProfileInfo?.stallName
            ?.toUpperCase()
            .includes(searchTxt?.toUpperCase())
      );
      if (countryName) {
        const arr = resArr.filter((stall) =>
          stall?.country?.label
            ?.toUpperCase()
            .includes(countryName?.label?.toUpperCase())
        );
        setSearchRes(arr);
      } else setSearchRes(resArr);
    } else {
      setSearchRes(stalls);
    }
  }, [countryName, searchTxt, stalls]);

  useEffect(() => {
    if (countryName) {
      const resArr = stalls.filter((stall) =>
        stall?.country?.label
          ?.toUpperCase()
          .includes(countryName?.label?.toUpperCase())
      );
      setSearchRes(resArr);
    } else {
      setSearchRes(stalls);
    }
  }, [countryName, stalls]);
  useEffect(() => {
    if (selectCategory) {
      const resArr = stalls.filter((stall) =>
        stall?.category?.toUpperCase().includes(selectCategory?.toUpperCase())
      );
      setSearchRes(resArr);
    } else {
      setSearchRes(stalls);
    }
  }, [selectCategory, stalls]);
  const addVisitors = async (key) => {
    try {
      const arr = allUsersData.filter((item) => item?.stallID === key);

      arr.forEach(async (ele) => {
        await database.ref(`Visitors/Stall/${key}/${ele?.id}/${uid}/`).set({
          name: currentUserData?.name || "Not Provided",
          email: currentUserData?.email || "Not Provided",
          gender: currentUserData?.gender || "Not Provided",
          phone: currentUserData?.phone || "Not Provided",
        });
        await database.ref(`Visitors/User/${uid}/${ele?.id}/`).set({
          name: ele?.name || "Not Provided",
          email: ele?.email || "Not Provided",
          gender: ele?.gender || "Not Provided",
          phone: ele?.phone || "Not Provided",
          id: ele?.id,
        });
      });
    } catch (error) {}
  };

  return (
    <>
      <Layout>
        <div
          style={{
            width: "95%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper
                component="form"
                className={classes.root}
                style={{ width: "98%" }}
              >
                <IconButton type="submit" className={classes.iconButton}>
                  <Search />
                </IconButton>
                <InputBase
                  placeholder="Search Stall Here"
                  fullWidth
                  value={searchTxt}
                  onChange={(e) => setSearchTxt(e.target.value)}
                />
              </Paper>
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              {countries && (
                <Autocomplete
                  id="Country"
                  options={countries}
                  getOptionLabel={(option) => option.label}
                  onChange={(e, value) => setCountryName(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      variant="outlined"
                      value={countryName}
                      fullWidth
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item lg={3} md={3} sm={6} xs={6}>
              {catagory && (
                <Autocomplete
                  id="Catagory"
                  options={catagory}
                  getOptionLabel={(option) => option}
                  onChange={(e, value) => setSelectCategory(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Catagory"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {searchRes.map((item, i) => (
            <Card
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "center",
              }}
              key={i}
              component={Link}
              to={`/PlatformExhibitors/${item.id}`}
              onClick={() => addVisitors(item?.id)}
            >
              <CardContent>
                <>
                  {item?.logoUrl ? (
                    <img
                      style={{
                        width: "120px",
                        height: "105px",
                        objectFit: "contain",
                      }}
                      src={item?.logoUrl}
                      className=""
                      alt={item?.sName}
                    />
                  ) : (
                    <div
                      style={{
                        width: "120px",
                        height: "100px",
                        textAlign: "center",
                      }}
                    >
                      <h6>{item?.sName || "Comming Soon ...."}</h6>
                    </div>
                  )}
                </>
              </CardContent>
            </Card>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Participants;
