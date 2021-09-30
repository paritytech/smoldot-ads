import React, { useContext, useState } from "react"

import ClearIcon from "@material-ui/icons/Clear"
import { Box, Chip, Input, makeStyles, Typography } from "@material-ui/core"
import { AppContext } from "../contexts/AppContext"
import Identicon from "@polkadot/react-identicon"

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  spaceAround: {
    position: "absolute",
    width: "81vw",
    zIndex: 100,
    padding: "15vw 15vw",
    height: "100vh",
    backdropFilter: "blur(3px)",
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  title: {
    width: "100%",
  },
  adBox: {
    margin: "10px",
    borderRadius: "4px",
    padding: "20px 15px",
    border: "1px solid #abb8bf",
    backgroundColor: "#fff",
  },
  clearIcon: {
    cursor: "pointer",
  },
  textfield: {
    color: "#334048",
    padding: "4.5px 8px 3.5px 0",
    fontSize: "18px",
  },
  emptyTag: {
    cursor: "pointer",
    color: "#ABB8BF",
    backgroundColor: "white",
    border: "1px solid #ABB8BF",
  },
  selectedTag: {
    cursor: "pointer",
    color: "#556068",
    backgroundColor: "#EAEEF1",
    border: "1px solid #EAEEF1",
  },
  balance: {
    fontFamily: "Roboto Mono, Arial, sans-serif",
    color: "#3D474D",
    fontSize: "13px",
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

const CreateAd: React.FunctionComponent = () => {
  const appCtx = useContext(AppContext)
  const classes = useStyles()
  const [title, setTitle] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const tempTags = ["cow", "bird", "bat", "man", "monkey"]

  return (
    <Box className={classes.spaceAround}>
      <Box className={classes.adBox}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.row}
        >
          <Box
            className={classes.title}
            component="div"
            display="flex"
            alignItems="center"
          >
            <Input
              className={classes.textfield}
              placeholder="Title"
              type="text"
              value={title}
              disableUnderline
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              fullWidth
            />
          </Box>
          <Box component="div" display="flex" alignItems="center">
            <ClearIcon
              className={classes.clearIcon}
              onClick={() => appCtx.setShowCreatedAdd(false)}
            />
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="left"
          className={classes.row}
          style={{ paddingBottom: "25px" }}
        >
          {tempTags.map((tag) => (
            <Chip
              key={tag}
              onClick={(e) => {
                selectedTags.includes(tag)
                  ? setSelectedTags(selectedTags.filter((t) => t !== tag))
                  : setSelectedTags([...selectedTags, tag])
              }}
              style={{ marginRight: "5px" }}
              className={
                selectedTags.includes(tag)
                  ? classes.selectedTag
                  : classes.emptyTag
              }
              size="small"
              label={tag}
            />
          ))}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.row}
        >
          <Box display="flex" alignItems="center" className={classes.row}>
            <Identicon
              className={classes.identIcon}
              size={22}
              theme="polkadot"
              value={"5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE"}
              onCopy={() => {
                console.log("copy")
              }}
            />
            <Typography variant="body2" style={{ fontSize: "20px" }}>
              Alice
            </Typography>
          </Box>
          <Typography variant="body2" className={classes.balance}>
            10.99 TOK
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          className={classes.row}
        >
          Line 3
        </Box>
      </Box>
    </Box>
  )
}

export default CreateAd
