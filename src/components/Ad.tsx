import React from "react"

import { Box, makeStyles, Chip, Typography } from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import { useAd } from "../services"

import { useActiveAccount } from "../services/accounts"

interface Props {
  id: number
  isClicked: boolean
  onClick: () => void
}

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  adBox: {
    cursor: "pointer",
    margin: "10px",
    width: "100%",
    backgroundColor: (isClicked) => (isClicked ? "#F9F9F9" : "transparent"),
    border: (isClicked) => (isClicked ? "1px solid #ABB8BF" : "1px solid #eee"),
    borderRadius: "4px",
    padding: "20px 15px",
    "&:hover": {
      border: "1px solid #000",
    },
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  author: {
    fontWeight: 600,
    maxWidth: "250px",
  },
  posted: {
    margin: "0 10px 0 0",
    fontWeight: 400,
    fontSize: "13px",
    color: "#7E8D95",
  },
  date: {
    padding: "2px 6px",
    backgroundColor: "#F9FAFB",
    borderRadius: "5px",
    fontWeight: 400,
    fontSize: "11px",
    color: "#556068",
  },
  body: {
    backgroundColor: "#F7F7F7",
    padding: "4px 8px",
    borderRadius: "5px",
    color: "#172026",
  },
  comments: {
    fontWeight: 500,
  },
  tag: {
    color: "#556068",
    backgroundColor: "#EAEEF1",
    padding: "4px 8px",
  },
  bubble: {
    fontWeight: 500,
    fontSize: "12px",
    margin: "0 9px 0",
  },
})

const options: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}

const Ad: React.FunctionComponent<Props> = ({
  id,
  isClicked,
  onClick,
}: Props) => {
  const classes = useStyles(isClicked)
  const activeAccount = useActiveAccount()
  const ad = useAd(id)

  const bubbleColor =
    ad && ad.numOfComments ? { color: "#11B37C" } : { color: "#556068" }

  const myAccount = {
    border: "1px solid #fff",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    padding: "4px 6px",
    borderRadius: "8px",
  }

  const bodyText =
    ad && ad.body.length > 666 ? ad.body.slice(0, 666).concat("...") : ad?.body

  return (
    ad && (
      <Box className={classes.adBox} onClick={onClick}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.row}
        >
          <Box component="div" display="flex" alignItems="center">
            <h4>{ad.title}</h4>
          </Box>
          <Box component="div">
            {ad.tags.map((tag) => (
              <Chip
                key={tag}
                size="small"
                label={tag}
                className={classes.tag}
              />
            ))}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" className={classes.row}>
          <Typography className={classes.posted}>Posted on</Typography>
          <Typography variant="body2" className={classes.date}>
            {ad.created.toLocaleString("en-US", options)}
          </Typography>
          <Typography className={classes.posted}>by</Typography>
          <Box
            display="flex"
            alignItems="center"
            style={ad.author === activeAccount.payload.address ? myAccount : {}}
          >
            <Identicon
              className={classes.identIcon}
              size={18}
              theme="polkadot"
              value={ad.author}
              onCopy={() => {
                console.log("copy")
              }}
            />
            <Typography variant="body2" className={classes.author}>
              {ad.author}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" className={classes.row}>
          <Typography variant="body1" className={classes.body}>
            {bodyText}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <ChatBubbleIcon className={classes.bubble} style={bubbleColor} />
          <Typography
            variant="body1"
            className={classes.comments}
            style={bubbleColor}
          >
            {ad.numOfComments}
          </Typography>
        </Box>
      </Box>
    )
  )
}

export default Ad
