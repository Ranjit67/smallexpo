import { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Navigation, ProfilePicChange } from "../../components";
import { auth, database } from "../../config";
import { useCurrentUser } from "../../hooks";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.black,
    color: "#d1af4f",
    boxShadow: theme.shadows[5],
    fontSize: 14,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) => ({
  large: {
    width: "150px",
    height: "150px",

    marginBottom: "20px",
  },

  imgCard: {
    marginBottom: "10px",
    height: "39vh",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const { currentUserData, currentUserId } = useCurrentUser();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const email = auth?.currentUser?.email;
  const [name, setName] = useState("");
  const [gender, setGender] = useState(`Male`);
  const [phone, setPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [web, setWeb] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [zoom, setZoom] = useState("");
  const [openPic, setOpenPic] = useState(false);

  const [msg, setMsg] = useState({
    text: "",
    type: "error",
    show: false,
  });
  useEffect(() => {
    currentUserData?.name && setName(currentUserData?.name);
    currentUserData?.gender && setGender(currentUserData?.gender);
    currentUserData?.phone && setPhone(currentUserData?.phone);
    currentUserData?.facebook && setFacebook(currentUserData?.facebook);
    currentUserData?.web && setWeb(currentUserData?.web);
    currentUserData?.linkedin && setLinkedin(currentUserData?.linkedin);
    currentUserData?.twitter && setTwitter(currentUserData?.twitter);
    currentUserData?.zoom && setZoom(currentUserData?.zoom);
  }, [currentUserData]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpenBackDrop(true);
      name && (await database.ref(`Users/${currentUserId}/name`).set(name));
      gender &&
        (await database.ref(`Users/${currentUserId}/gender`).set(gender));
      phone && (await database.ref(`Users/${currentUserId}/phone`).set(phone));
      facebook &&
        (await database.ref(`Users/${currentUserId}/facebook`).set(facebook));
      web && (await database.ref(`Users/${currentUserId}/web`).set(web));
      linkedin &&
        (await database.ref(`Users/${currentUserId}/linkedin`).set(linkedin));

      twitter &&
        (await database.ref(`Users/${currentUserId}/twitter`).set(twitter));
      zoom && (await database.ref(`Users/${currentUserId}/zoom`).set(zoom));

      setMsg({
        show: true,
        text: "Updated Successfully",
        type: "success",
      });
    } catch (error) {
      setMsg({
        show: true,
        text: error.message,
        type: "error",
      });
    } finally {
      setOpenBackDrop(false);
    }
  };
  return (
    <Navigation>
      <Backdrop open={openBackDrop} style={{ zIndex: "10000", color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        autoHideDuration={6000}
        open={msg.show}
        onClose={() =>
          setMsg({
            show: false,
            text: "",
            type: "error",
          })
        }
      >
        <Alert
          onClose={() =>
            setMsg({
              show: false,
              text: "",
              type: "error",
            })
          }
          severity={msg.type}
        >
          {msg.text}
        </Alert>
      </Snackbar>
      <div>
        <ProfilePicChange openPic={openPic} setOpenPic={setOpenPic} />
        <Card className={classes.imgCard}>
          <CardContent>
            <Avatar
              alt={currentUserData?.name}
              src={
                currentUserData?.ProfilePic ||
                "https://cdn1.iconfinder.com/data/icons/people-cultures/512/_saudi_arabian_man-512.png"
              }
              className={classes.large}
            />
            <Button
              variant="contained"
              style={{
                backgroundColor: "#2778c4c9",
                color: "whitesmoke",
              }}
              onClick={() => setOpenPic(true)}
            >
              <Typography variant="subtitle2">Change Picture</Typography>
            </Button>
          </CardContent>
        </Card>
      </div>
      <form className="card w-50 mx-auto my-5" onSubmit={handelSubmit}>
        <div className="card-header">
          <Typography variant="h4">Edit Profile</Typography>
        </div>
        <div className="card-body">
          <TextField
            fullWidth
            value={email}
            disabled
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="My Name is"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            value={phone}
            label="Phone Number"
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
            margin="normal"
          />

          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>My Gender is</InputLabel>
            <Select
              value={gender}
              label="My Gender is"
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value={`Male`}>Male</MenuItem>
              <MenuItem value={`Female`}>Female</MenuItem>
            </Select>
          </FormControl>

          <LightTooltip
            title="Please Enter The URL Starting with https://"
            placement="top-start"
          >
            <TextField
              fullWidth
              value={web}
              label="My Website URL is"
              onChange={(e) => setWeb(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </LightTooltip>
          <LightTooltip
            title="Please Enter The URL Starting with https://"
            placement="top-start"
          >
            <TextField
              fullWidth
              value={facebook}
              label="My Facebook URL is"
              onChange={(e) => setFacebook(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </LightTooltip>
          <LightTooltip
            title="Please Enter The URL Starting with https://"
            placement="top-start"
          >
            <TextField
              fullWidth
              value={twitter}
              label="My Twitter URL is"
              onChange={(e) => setTwitter(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </LightTooltip>
          <LightTooltip
            title="Please Enter The URL Starting with https://"
            placement="top-start"
          >
            <TextField
              fullWidth
              value={linkedin}
              label="My Linkedin URL is"
              onChange={(e) => setLinkedin(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </LightTooltip>
          <LightTooltip
            title="Please Enter The URL Starting with https://"
            placement="top-start"
          >
            <TextField
              fullWidth
              value={zoom}
              label="My ZOOM URL is"
              onChange={(e) => setZoom(e.target.value)}
              variant="outlined"
              margin="normal"
            />
          </LightTooltip>
        </div>
        <div>
          <Button variant="contained" type="submit" color="primary" fullWidth>
            Save Changes
          </Button>
        </div>
      </form>
    </Navigation>
  );
};

export default EditProfile;
