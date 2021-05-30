import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  InputLabel,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close, Create } from "@material-ui/icons";

import React, { useState } from "react";
import { auth, database } from "../config";
const useStyles = makeStyles((theme) => ({
  absolute: {
    position: "fixed",
    bottom: "2vh",
    right: theme.spacing(3),
  },
  DialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alert: {
    zIndex: theme.zIndex.drawer + 9,
  },
  backdrop: {
    zIndex: 99999999999999999999999,
    color: "#fff",
  },
  label: {
    margin: "20px 0px 10px 0px",
  },
  dialog: {
    minWidth: "40%",
    minHeight: "50vh",
  },
}));

const PollQuestion = () => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      await database.ref(`Poll/${auth?.currentUser?.uid}`).push({
        question,
        option1,
        option2,
        live: true,
      });
    } catch (error) {
      console.log(error.mssage);
    } finally {
      setOpenBackDrop(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Tooltip title="Add Question">
        <Fab
          variant="round"
          color="primary"
          className={classes.absolute}
          onClick={() => setOpen(true)}
        >
          <Create />
        </Fab>
      </Tooltip>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.dialog,
        }}
      >
        <DialogTitle>
          <div className={classes.DialogHeader}>
            <Typography variant="h6">Question</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent dividers>
          <Backdrop className={classes.backdrop} open={openBackDrop}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <form onSubmit={handleSubmit}>
            <div className={classes.paper}>
              <InputLabel htmlFor="question" className={classes.label}>
                <b>Enter Question *</b>
              </InputLabel>
              <TextField
                id="question"
                type="text"
                label="Question"
                required
                fullWidth
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="outlined"
              />
              <InputLabel htmlFor="option1" className={classes.label}>
                <b>First Option *</b>
              </InputLabel>
              <TextField
                required
                id="option1"
                type="text"
                label="First Option"
                fullWidth
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
                variant="outlined"
              />
              <InputLabel htmlFor="option2" className={classes.label}>
                <b>Second Option *</b>
              </InputLabel>
              <TextField
                required
                id="option2"
                type="text"
                label="Second Option"
                fullWidth
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
                variant="outlined"
              />
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                autoFocus
                style={{ margin: "30px" }}
              >
                Add Question
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PollQuestion;
