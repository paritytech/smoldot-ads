import React, { memo, useState } from "react"
import {
  Box,
  Button,
  makeStyles,
  Chip,
  TextField,
  Typography,
  Theme,
} from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import VisibilityIcon from "@material-ui/icons/Visibility"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import DeleteForeverOutlineIcon from "@material-ui/icons/DeleteForeverOutlined"
import ClearIcon from "@material-ui/icons/Clear"
import {
  deleteAd,
  accounts,
  useActiveAccount,
  useAd,
  useComment,
  createComment,
} from "../services"
import { isEmptyText } from "../utils"
import { UserRow } from "./UserRow"

const useStyles = makeStyles<Theme>(() => ({
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
  option: {
    color: "#556068",
    cursor: "pointer",
  },
  selectedOption: {
    color: "green",
    cursor: "pointer",
  },
  bubble: {
    fontWeight: 500,
    fontSize: "12px",
    margin: "0 9px 0",
  },
  pointer: {
    cursor: "pointer",
  },
  descriptionText: {
    width: "100%",
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

const CommentForm: React.FC<{
  onSubmit: (body: string) => void
}> = ({ onSubmit }) => {
  const classes = useStyles()
  const [description, setDescription] = useState<string>("")

  return (
    <Box>
      <UserRow />
      <TextField
        className={classes.descriptionText}
        rows={5}
        maxRows={5}
        variant="outlined"
        multiline
        value={description}
        onChange={(e) => {
          setDescription(e.target.value)
        }}
      />
      <Button
        disabled={isEmptyText(description)}
        onClick={() => {
          onSubmit(description)
        }}
      >
        Post
      </Button>
    </Box>
  )
}

const AdComment: React.FC<{
  adIdx: number
  commentIdx: number
}> = memo(({ adIdx, commentIdx }) => {
  const comment = useComment(adIdx, commentIdx)
  if (!comment) return null

  const author: string = (accounts[comment.author].meta as any).name

  return (
    <Box>
      <Typography variant="body2">{author}</Typography>
      <Typography variant="body2">{comment.body}</Typography>
    </Box>
  )
})

const AdComments: React.FC<{
  adIdx: number
  nComments: number
}> = ({ adIdx, nComments }) => (
  <ul>
    {Array(nComments)
      .fill(null)
      .map((_, commentIdx) => (
        <AdComment key={commentIdx} adIdx={adIdx} commentIdx={commentIdx} />
      ))}
  </ul>
)

const DetailedAd: React.FunctionComponent<Props> = ({
  address,
  id,
  onClick,
}) => {
  const classes = useStyles()
  const ad = useAd(id)
  const activeAccount = useActiveAccount()
  const [isEditing, setIsEditing] = useState(false)

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
            <ClearIcon className={classes.pointer} onClick={onClick} />
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
          <Box
            className={isEditing ? classes.option : classes.selectedOption}
            onClick={() => {
              setIsEditing(false)
            }}
          >
            <ChatBubbleOutlineIcon className={classes.bubble} />
            {ad.numOfComments}
          </Box>
          <Box
            className={isEditing ? classes.selectedOption : classes.option}
            onClick={() => {
              setIsEditing(true)
            }}
          >
            <EditOutlinedIcon className={classes.bubble} />
            reply
          </Box>
          {activeAccount.address === ad.author ? (
            <Box className={classes.pointer} onClick={() => deleteAd(id)}>
              <DeleteForeverOutlineIcon className={classes.bubble} />
              delete
            </Box>
          ) : null}
        </Box>
        {isEditing ? (
          <CommentForm
            onSubmit={(body) => {
              createComment(id, body)
              setIsEditing(false)
            }}
          />
        ) : (
          <AdComments adIdx={id} nComments={ad.numOfComments} />
        )}
      </Box>
    )
  )
}

export default DetailedAd
