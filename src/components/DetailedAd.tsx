import React from "react"

import { Box, makeStyles, Chip, Typography } from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import VisibilityIcon from "@material-ui/icons/Visibility"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import ClearIcon from "@material-ui/icons/Clear"
import { useAd } from "../services"

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: "12.5px",
  },
  visibilityIcon: {
    marginRight: "10px",
    color: "#7E8D95",
    width: "18px",
  },
  adBox: {
    margin: "10px",
    width: "100%",
    border: "1px solid #ABB8BF",
    borderRadius: "4px",
    padding: "20px 15px",
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  author: {
    fontWeight: 600,
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
  clearIcon: {
    cursor: "pointer",
  },
}))

const options: Intl.DateTimeFormatOptions = {
  year: "2-digit",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}

interface Props {
  address: string
  id: number
  onClick: () => void
}

const DetailedAd: React.FunctionComponent<Props> = ({
  address,
  id,
  onClick,
}) => {
  const classes = useStyles()
  const ad = useAd(id)

  return (
    ad && (
      <Box className={classes.adBox}>
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
          <Box component="div" display="flex" alignItems="center">
            {ad.tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} />
            ))}
            <ClearIcon className={classes.clearIcon} onClick={onClick} />
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
            8
          </Typography>
        </Box>
      </Box>
    )
  )
}

export default DetailedAd
