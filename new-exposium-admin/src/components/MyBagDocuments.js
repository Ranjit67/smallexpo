import {
  Backdrop,
  CircularProgress,
  Fab,
  Grid,
  Snackbar,
} from "@material-ui/core";
import { Delete, DescriptionOutlined, Visibility } from "@material-ui/icons";
import { Alert, Skeleton } from "@material-ui/lab";
import React, { useState } from "react";
import { auth, database } from "../config";
import { useMyBag } from "../hooks";
const MyBagDocuments = () => {
  const { bagDocuments } = useMyBag();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const handleDelete = async (id) => {
    try {
      setOpenBackDrop(true);
      await database
        .ref(`Users/${auth?.currentUser?.uid}/MyBag/Documents/${id}`)
        .remove();
      if (bagDocuments.length < 2) window.location.reload();
    } catch (error) {
    } finally {
      setOpenBackDrop(false);
    }
  };
  return (
    <div>
      <Backdrop open={openBackDrop} style={{ zIndex: 9999999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={showAlert.isOpen}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
      >
        <Alert
          onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          severity={showAlert?.color}
        >
          {showAlert.msg}
        </Alert>
      </Snackbar>
      <Grid
        container
        spacing={2}
        style={{
          minHeight: "45vh",
        }}
      >
        {bagDocuments.length ? (
          bagDocuments.map((item, i) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                {item?.documents ? (
                  <iframe
                    title={new Date().getTime()}
                    width="100%"
                    height="100%"
                    style={{ minHeight: "10vh" }}
                    src={item?.documents}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Skeleton animation="pulse" />
                )}

                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                  }}
                >
                  <Fab
                    size="small"
                    color="secondary"
                    style={{
                      margin: "5px",
                    }}
                    onClick={() => handleDelete(item?.id)}
                  >
                    <Delete />
                  </Fab>
                  <Fab
                    size="small"
                    color="primary"
                    style={{
                      margin: "5px",
                    }}
                    onClick={() => window.open(item?.documents)}
                  >
                    <Visibility />
                  </Fab>
                </div>
              </div>
            </Grid>
          ))
        ) : (
          <div
            style={{
              display: "grid",
              placeContent: "center",
              placeItems: "center",
              width: "100%",
              minHeight: "45vh",
            }}
          >
            <DescriptionOutlined fontSize="large" />
            <h1>No Documents Found</h1>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default MyBagDocuments;
