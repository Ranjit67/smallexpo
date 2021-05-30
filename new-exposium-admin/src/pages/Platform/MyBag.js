import {
  AppBar,
  Box,
  Card,
  Container,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  Layout,
  MyBagContacts,
  MyBagDocuments,
  MyBagVideo,
} from "../../components";
import PropTypes from "prop-types";
import { useWindow } from "../../hooks";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span" variant="h6">
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  };
}
function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const MyBag = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const { windowSize } = useWindow();

  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <Layout>
      <Container maxWidth="md" style={{ marginTop: "10vh" }}>
        <Card>
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs
                variant={windowSize.width > 450 ? "fullWidth" : "scrollable"}
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
              >
                <LinkTab label="Documents" {...a11yProps(0)} />
                <LinkTab label="Videos" {...a11yProps(1)} />
                <LinkTab label="Contacts" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <MyBagDocuments />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MyBagVideo />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MyBagContacts />
            </TabPanel>
          </div>
        </Card>
      </Container>
    </Layout>
  );
};

export default MyBag;
