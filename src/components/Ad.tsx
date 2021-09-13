import React from "react"

import { Box, makeStyles, Chip, Typography } from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import VisibilityIcon from "@material-ui/icons/Visibility"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import { useAd } from "../services"

interface Props {
  id: number
  address: string
  isClicked: boolean
  onClick: () => void
}

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  visibilityIcon: {
    marginRight: "10px",
    color: "#EAEEF1",
    width: "18px",
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
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "250px",
  },
  posted: {
    margin: "0 10px",
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
    color: "#556068",
    fontWeight: 500,
  },
  bubble: {
    color: "#556068",
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
  address,
  isClicked,
  onClick,
}: Props) => {
  const classes = useStyles(isClicked)
  const ad = useAd(id)

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
            <VisibilityIcon className={classes.visibilityIcon} />
            <h4>{ad.title}</h4>
          </Box>
          <Box component="div">
            {ad.tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} />
            ))}
          </Box>
        </Box>
        <Box display="flex" alignItems="center" className={classes.row}>
          <Identicon
            className={classes.identIcon}
            size={18}
            theme="polkadot"
            value={address}
            onCopy={() => {
              console.log("copy")
            }}
          />
          <Typography variant="body2" className={classes.author}>
            {ad.author}
          </Typography>
          <Typography className={classes.posted}>posted at</Typography>
          <Typography variant="body2" className={classes.date}>
            {ad.created.toLocaleString("en-US", options)}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" className={classes.row}>
          <Typography variant="body1" className={classes.body}>
            {ad.body}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <ChatBubbleOutlineIcon className={classes.bubble} />
          <Typography variant="body1" className={classes.comments}>
            {ad.numOfComments}
          </Typography>
        </Box>
      </Box>
    )
  )
}

export default Ad
