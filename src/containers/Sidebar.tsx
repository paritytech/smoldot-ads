import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import {
  Box,
  createStyles,
  Button,
  makeStyles,
  Theme,
  Typography,
  MenuList,
  MenuItem,
  ListItemIcon,
} from "@material-ui/core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import ForumIcon from "@material-ui/icons/Forum"

import { createAd } from "../services"
import { AppContext } from "../contexts/AppContext"

// For dummy data
import { Keyring } from "@polkadot/api"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemRoot: {
      color: theme.palette.text.secondary,
      paddingLeft: "0px",
    },
    menuItemSelected: {
      "&$menuItemSelected, &$menuItemSelected:focus, &$menuItemSelected:hover":
        {
          backgroundColor: "transparent",
          color: theme.palette.text.primary,
        },
    },
    sidebar: {
      backgroundColor: "#FCFCFC",
      padding: theme.spacing(2.4),
      color: theme.palette.text.primary,
      minHeight: "100vh",
      borderRight: "1px solid #EAEEF1",
    },
    menuIcon: {
      color: "inherit",
      minWidth: "0",
      "&:hover": {
        color: "inherit",
        background: "transparent",
      },
    },
    buttonAdd: {
      backgroundColor: "#F5EFF6",
      color: "#334048",
      marginLeft: "8px",
      borderRadius: "10px",
    },
    links: {
      marginLeft: "15px",
    },
    linksNotification: {
      color: theme.palette.text.primary,
      marginLeft: "5px",
    },
    helpGrid: {
      position: "absolute",
      bottom: "20px",
      maxWidth: "250px",
    },
  }),
)

const NotifSamples = (props: { showAction?: number }) => {
  const appCtx = useContext(AppContext)

  const obj = {
    title: props.showAction ? "AutoClose" : "Manual Close",
    text: "SmolAds is built with substrate-connect parachain tutorial.",
    buttonText: "Explore substrate tutorials",
    show: !appCtx.notification.show,
    buttonAction: () =>
      window.open("https://paritytech.github.io/substrate-connect/", "_blank"),
  }

  const finObj = props.showAction
    ? Object.assign({}, { autoClose: props.showAction }, obj)
    : Object.assign({}, obj)

  return (
    <Button onClick={() => appCtx.setNotification(finObj)}>
      {props.showAction ? "AutoClose in 3 secs" : "Manual Close Notification"}
    </Button>
  )
}

// DUMMY GENERATOR
// TODO:  DELETE WHEN UI IS READY
const tags = [
  "pizza",
  "cola",
  "whiskey",
  "dog",
  "cat",
  "mouse",
  "birdy",
  "fox",
  "cow",
  "something",
]

const randomString = (length: number): string => {
  let result: string = ""
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz "
  const charactersLength: number = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const createDummyAd = async () => {
  // Create Keyrin
  const keyring = new Keyring({ type: "sr25519" })
  // Grab the Alice dev account
  const alice = keyring.addFromUri("//Alice", { name: "Alice default" })
  try {
    // Make the transaction to create the add
    const status = await createAd(
      randomString(5),
      randomString(50),
      [tags[Math.floor(Math.random() * tags.length)]],
      alice,
    )
    console.log(status.toHuman())
  } catch (err) {
    console.log("error", err)
  }
}

// Generates Dummy ads (1 every 5 seconds)
const generateDummyAds = () => {
  let x = 0
  const intervalID = window.setInterval(() => {
    createDummyAd()
    if (++x === 6) window.clearInterval(intervalID)
  }, 5000)
}

// DUMMY GENERATOR END

const Sidebar = () => {
  const classes = useStyles()

  return (
    <Grid item sm={3} md={2} className={classes.sidebar}>
      <Box paddingTop={2} paddingBottom={2}>
        <Typography variant="h4">
          Smold Ads
          <Button className={classes.buttonAdd}>
            <AddCircleOutlineIcon fontSize="small" />
          </Button>
        </Typography>
      </Box>
      <Box paddingTop={3} paddingBottom={2.4}>
        <Typography variant="overline">My local storage</Typography>
      </Box>
      <MenuList>
        <MenuItem
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
        >
          <ListItemIcon className={classes.menuIcon}>
            <AssignmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            Ads
          </Typography>
          <Typography variant="body1" className={classes.linksNotification}>
            (2)
          </Typography>
        </MenuItem>
        <MenuItem
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
          selected
        >
          <ListItemIcon className={classes.menuIcon}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            Responses
          </Typography>
        </MenuItem>
        <MenuItem
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
        >
          <ListItemIcon className={classes.menuIcon}>
            <FolderOpenIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            Agreements
          </Typography>
        </MenuItem>
      </MenuList>
      {/* Buttons for testing. TODO: Remove */}
      <Button onClick={generateDummyAds}>Generate 6 ads (1/5secs)</Button>
      <Button onClick={createDummyAd}>Create 1 ad</Button>
      <NotifSamples />
      <NotifSamples showAction={3000} />

      <MenuItem classes={{ root: classes.helpGrid }}>
        <ListItemIcon className={classes.menuIcon}>
          <ForumIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body1" className={classes.links}>
          Help & Feedback
        </Typography>
      </MenuItem>
    </Grid>
  )
}

export default Sidebar
