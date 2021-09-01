import React, { useContext } from "react"
import Grid from "@material-ui/core/Grid"
import {
  Box,
  createStyles,
  Button,
  makeStyles,
  Theme,
  Typography,
  IconButton,
  MenuList,
  MenuItem,
  ListItemIcon
} from "@material-ui/core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import FolderOpenIcon from "@material-ui/icons/FolderOpen"
import ForumIcon from "@material-ui/icons/Forum"

import { AppContext } from "../contexts/AppContext"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItemRoot: {
      color: theme.palette.text.secondary,
      paddingLeft: "0px"
    },
    menuItemSelected: {
      "&$menuItemSelected, &$menuItemSelected:focus, &$menuItemSelected:hover":
        {
          backgroundColor: "transparent",
          color: theme.palette.text.primary
        }
    },
    sidebar: {
      backgroundColor: "#FCFCFC",
      padding: theme.spacing(2.4),
      color: theme.palette.text.primary,
      minHeight: "100vh",
      borderRight: "1px solid #EAEEF1"
    },
    menuIcon: {
      color: "inherit",
      minWidth: "0",
      "&:hover": {
        color: "inherit",
        background: "transparent"
      }
    },
    buttonAdd: {
      backgroundColor: "#F5EFF6",
      color: "#334048",
      marginLeft: "8px",
      borderRadius: "10px"
    },
    links: {
      marginLeft: "15px"
    },
    linksNotification: {
      color: theme.palette.text.primary,
      marginLeft: "5px"
    },
    helpGrid: {
      position: "absolute",
      bottom: "20px",
      maxWidth: "250px"
    }
  })
)

const NotifSamples = (props: { showAction?: number }) => {
  const appCtx = useContext(AppContext)

  const obj = {
    title: props.showAction ? "AutoClose" : "Manual Close",
    text: "SmolAds is built with substrate-connect parachain tutorial.",
    buttonText: "Explore substrate tutorials",
    show: !appCtx.notification.show,
    buttonAction: () =>
      window.open("https://paritytech.github.io/substrate-connect/", "_blank")
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
          <NotifSamples />
          <NotifSamples showAction={3000} />
        </Typography>
      </Box>
      <Box paddingTop={3} paddingBottom={2.4}>
        <Typography variant="overline">My local storage</Typography>
      </Box>
      <MenuList>
        <MenuItem
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected
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
            selected: classes.menuItemSelected
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
            selected: classes.menuItemSelected
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
