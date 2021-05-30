import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Slide,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Add, Cancel, Visibility } from "@material-ui/icons";
import { Alert, Skeleton } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { auth, database } from "../config";
import { useMyBag } from "../hooks";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogDocuments = ({ documentsOpen, setDocumentsOpen, documents }) => {
  const [documentsArr, setDocumentsArr] = useState([]);
  const [showAlert, setShowAlert] = useState({
    msg: "",
    isOpen: false,
    color: "",
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDocuments = () => setDocumentsOpen(false);
  const { bagDocuments } = useMyBag();

  useEffect(() => {
    const obj = documents;
    const arr = [];
    for (const key in obj) arr.push({ id: key, ...obj[key] });
    setDocumentsArr(arr);
    return () => {
      setDocumentsArr([]);
    };
  }, [documents]);
  const handleDocumentsAdd = async (item) => {
    const arr = bagDocuments.filter((ele) => ele.documents === item);

    if (arr.length) {
      setShowAlert({
        msg: "Already in Your Bag",
        isOpen: true,
        color: "warning",
      });
    } else {
      try {
        await database
          .ref(`Users/${auth?.currentUser?.uid}/MyBag/Documents`)
          .push(item);
        setShowAlert({
          msg: "Successfully Added to Bag ",
          isOpen: true,
          color: "success",
        });
      } catch (error) {
        setShowAlert({ msg: error.message, isOpen: true, color: "error" });
      }
    }
  };
  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        open={documentsOpen}
        onClose={handleDocuments}
      >
        <DialogTitle style={{ minWidth: "40vw" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6">Documents</Typography>
            <IconButton onClick={handleDocuments}>
              <Cancel />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent style={{ minHeight: "40vw" }} dividers>
          <Snackbar
            open={showAlert.isOpen}
            autoHideDuration={6000}
            onClose={() => setShowAlert({ msg: "", isOpen: false, color: "" })}
          >
            <Alert
              onClose={() =>
                setShowAlert({ msg: "", isOpen: false, color: "" })
              }
              severity={showAlert?.color}
            >
              {showAlert.msg}
            </Alert>
          </Snackbar>
          <Grid container spacing={2}>
            {documentsArr.length ? (
              documentsArr.map((item, i) => (
                <Grid item lg={6} md={6} sm={6} xs={12} key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    {item?.catalogUrl ? (
                      <iframe
                        title={new Date().getTime()}
                        width="100%"
                        height="100%"
                        style={{ minHeight: "10vh", minWidth: "15vw" }}
                        src={item?.catalogUrl}
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
                        onClick={() => handleDocumentsAdd(item?.catalogUrl)}
                      >
                        <Add />
                      </Fab>
                      <Fab
                        size="small"
                        color="primary"
                        style={{
                          margin: "5px",
                        }}
                        onClick={() => window.open(item?.catalogUrl)}
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
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20vh",
                }}
              >
                <Typography variant="h4">No Documents Found</Typography>
              </div>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogDocuments;
