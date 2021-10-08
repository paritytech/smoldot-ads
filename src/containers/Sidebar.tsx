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
  Link,
} from "@material-ui/core"
import { useIsApiReady } from "../services/client"
import {
  AdFilters,
  onChangeSelectedFilter,
  useActiveFilter,
  useMyAdsCount,
  useMyCommentedAdsCount,
} from "../services/filteredAdIds"
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined"
import ChatBubbleOutline from "@material-ui/icons/ChatBubbleOutline"
import ForumIcon from "@material-ui/icons/Forum"

import { AppContext } from "../contexts/AppContext"

import StatusCircle from "../components/StatusCircle"

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
      backgroundColor: "#F5EFF7",
      color: "#334048",
      marginLeft: "8px",
      borderRadius: "5px",
      width: "100%",
      margin: "50px 0",
      fontSize: "16px",
      fontWeight: 600,
    },
    links: {
      marginLeft: "15px",
    },
    feedLink: {
      marginLeft: "15px",
      margin: "35px 0",
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

const Sidebar = () => {
  const classes = useStyles()
  const isApiReady = useIsApiReady()
  const appCtx = useContext(AppContext)
  const activeFilter = useActiveFilter()
  const myAdsCount = useMyAdsCount()
  const myCommentedAdsCount = useMyCommentedAdsCount()

  return (
    <Grid item sm={3} md={2} className={classes.sidebar}>
      <Box paddingTop={2} paddingBottom={2}>
        <Typography variant="h4">
          <StatusCircle connected={isApiReady} /> Smol Ads
        </Typography>
      </Box>
      <MenuList>
        <MenuItem
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
          disabled={!isApiReady}
          onClick={() => {
            onChangeSelectedFilter(AdFilters.All)
          }}
          selected={activeFilter === AdFilters.All}
        >
          <ListItemIcon className={classes.menuIcon}>
            <AssignmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            Feed
          </Typography>
        </MenuItem>
      </MenuList>
      <Box paddingTop={3} paddingBottom={2.4}>
        <Typography variant="overline">Local storage</Typography>
      </Box>
      <MenuList>
        <MenuItem
          disabled={!isApiReady}
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
          onClick={() => {
            onChangeSelectedFilter(AdFilters.MyAds)
          }}
          selected={activeFilter === AdFilters.MyAds}
        >
          <ListItemIcon className={classes.menuIcon}>
            <AssignmentOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            My ads
          </Typography>
          <Typography variant="body1" className={classes.linksNotification}>
            ({myAdsCount})
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={!isApiReady}
          classes={{
            root: classes.menuItemRoot,
            selected: classes.menuItemSelected,
          }}
          onClick={() => {
            onChangeSelectedFilter(AdFilters.MyComments)
          }}
          selected={activeFilter === AdFilters.MyComments}
        >
          <ListItemIcon className={classes.menuIcon}>
            <ChatBubbleOutline fontSize="small" />
          </ListItemIcon>
          <Typography variant="body1" className={classes.links}>
            My comments
          </Typography>
          <Typography variant="body1" className={classes.linksNotification}>
            ({myCommentedAdsCount})
          </Typography>
        </MenuItem>
        {/*
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
            My agreements
          </Typography>
        </MenuItem>
        */}
      </MenuList>
      <Button
        className={classes.buttonAdd}
        onClick={() => {
          appCtx.setShowCreatedAdd(true)
        }}
        disabled={!isApiReady}
      >
        New Post
      </Button>

      <MenuItem
        classes={{ root: classes.helpGrid }}
        onClick={() => {
          onChangeSelectedFilter(AdFilters.MyComments)
        }}
      >
        <ListItemIcon className={classes.menuIcon}>
          <ForumIcon fontSize="small" />
        </ListItemIcon>
        <Link
          color="textSecondary"
          target="_blank"
          rel="noreferrer"
          variant="body2"
          href="https://github.com/paritytech/substrate-connect/issues"
          className={classes.links}
        >
          Help & Feedback
        </Link>
      </MenuItem>
    </Grid>
  )
}

export default Sidebar
