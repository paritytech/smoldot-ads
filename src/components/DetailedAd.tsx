import React, { memo, useState } from "react"
import {
  Box,
  Button,
  makeStyles,
  Chip,
  TextField,
  Typography,
  Theme,
  Grid,
} from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import EditIcon from "@material-ui/icons/Edit"
import DeleteForever from "@material-ui/icons/DeleteForever"
import ClearIcon from "@material-ui/icons/Clear"
import {
  deleteAd,
  accounts,
  useActiveAccount,
  useAd,
  useComment,
  createComment,
} from "../services"
import { isEmptyText, makeEllipsis, capitalize } from "../utils"
import { UserRow } from "./UserRow"

const useStyles = makeStyles<Theme>(() => ({
  row: {
    marginBottom: "12.5px",
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
    borderRadius: "10px",
  },
  author: {
    fontWeight: 600,
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
    color: "#172026",
    fontSize: "18px",
    marginBottom: "30px",
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
  comments: {
    marginTop: "20px",
    display: "flow-root",
  },
  commentBox: {
    backgroundColor: "#F7F7F7",
    margin: "10px",
    padding: "10px",
    clear: "both",
    float: "left",
    borderRadius: "5px",
  },
  commentAuthor: {
    color: "#334048",
    fontWeight: 500,
    fontSize: "12px",
  },
  commentBody: {
    color: "#172026",
    fontSize: "16px",
  },
  descriptionText: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: "4px",
  },
  postButton: {
    backgroundColor: "#DEE3E7",
    borderRadius: "4px",
    width: "100%",
    marginTop: "20px",
  },
  tag: {
    color: "#556068",
    backgroundColor: "#EAEEF1",
    padding: "4px 8px",
  },
  options: {
    color: "#556068",
    fontSize: "14px",
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
        className={classes.postButton}
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
  const classes = useStyles()
  const comment = useComment(adIdx, commentIdx)
  if (!comment) return null

  const author: string = (accounts[comment.author].meta as any).name
  console.log("comment", comment)
  return (
    <Grid className={classes.commentBox}>
      <Box component="div" display="flex" alignItems="center">
        <Identicon
          className={classes.identIcon}
          size={18}
          theme="polkadot"
          value={comment.author}
          onCopy={() => {
            console.log("copy")
          }}
        />
        <Typography variant="body2" className={classes.commentAuthor}>
          {capitalize(author)}
        </Typography>
      </Box>
      <Typography variant="body2" className={classes.commentBody}>
        {comment.body}
      </Typography>
    </Grid>
  )
})

const AdComments: React.FC<{
  adIdx: number
  nComments: number
}> = ({ adIdx, nComments }) => (
  <>
    {Array(nComments)
      .fill(null)
      .map((_, commentIdx) => (
        <AdComment key={commentIdx} adIdx={adIdx} commentIdx={commentIdx} />
      ))}
  </>
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

  const bubbleColor =
    ad && ad.numOfComments ? { color: "#11B37C" } : { color: "#556068" }

  const myAccount = {
    border: "1px solid #fff",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    padding: "4px 6px",
    borderRadius: "8px",
  }

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
            <h4>{ad.title}</h4>
          </Box>
          <Box component="div" display="flex" alignItems="center">
            {ad.tags.map((tag) => (
              <Chip
                key={tag}
                size="small"
                className={classes.tag}
                label={tag}
              />
            ))}
            <ClearIcon className={classes.pointer} onClick={onClick} />
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
            style={ad.author === activeAccount.address ? myAccount : {}}
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
              {capitalize((accounts[ad.author].meta as any).name)}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" className={classes.row}>
          <Typography variant="body1" className={classes.body}>
            {ad.body}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            display="flex"
            alignItems="center"
            className={isEditing ? classes.option : classes.selectedOption}
            onClick={() => {
              setIsEditing(false)
            }}
          >
            <ChatBubbleIcon className={classes.bubble} style={bubbleColor} />
            <span className={classes.options}>{ad.numOfComments}</span>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            className={isEditing ? classes.selectedOption : classes.option}
            onClick={() => {
              setIsEditing(true)
            }}
          >
            <EditIcon className={classes.bubble} />
            <span className={classes.options}>reply</span>
          </Box>
          {activeAccount.address === ad.author ? (
            <Box
              display="flex"
              alignItems="center"
              className={classes.pointer}
              onClick={() => deleteAd(id)}
            >
              <DeleteForever className={classes.bubble} />
              <span className={classes.options}>delete</span>
            </Box>
          ) : null}
        </Box>
        <Box className={classes.comments}>
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
      </Box>
    )
  )
}

export default DetailedAd
