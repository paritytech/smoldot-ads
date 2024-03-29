import React, { useContext, useState } from "react"

import ClearIcon from "@material-ui/icons/Clear"
import { Box, Button, Input, makeStyles, TextField } from "@material-ui/core"
import { AppContext } from "../../contexts/AppContext"
import { Tags } from "./Tags"
import { isEmptyText } from "../../utils"
import { createAd, useAccountBalance } from "../../services"
import { UserRow } from "../UserRow"
import { DEFAULT_PROVIDER } from "../../services/client/client"

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  descriptionText: {
    width: "100%",
  },
  spaceAround: {
    position: "absolute",
    width: "81vw",
    zIndex: 100,
    padding: "15vw 15vw",
    height: "100vh",
    backdropFilter: "blur(3px)",
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
  postButton: {
    backgroundColor: "#DEE3E7",
    borderRadius: "4px",
    width: "100%",
    marginTop: "20px",
  },
})

const CreateAd: React.FunctionComponent = () => {
  const appCtx = useContext(AppContext)
  const classes = useStyles()
  const balance = useAccountBalance()
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

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
        <Tags
          tags={selectedTags}
          onAddTag={(newTag) =>
            setSelectedTags((prevTags) =>
              prevTags.includes(newTag) ? prevTags : prevTags.concat(newTag),
            )
          }
          onRemoveTag={(removedTag) =>
            setSelectedTags((prevTags) =>
              prevTags.filter((tag) => tag !== removedTag),
            )
          }
        />
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
          disabled={
            balance === 0 ||
            selectedTags.length === 0 ||
            [title, description].some(isEmptyText)
          }
          className={classes.postButton}
          onClick={() => {
            try {
              createAd(title, description, selectedTags, (res) => {
                if (res.status.isInBlock) {
                  appCtx.setNotification({
                    title: "Ad Submitted",
                    text: `Block hash:: ${res.status.asInBlock}.`,
                    show: true,
                    type: "success",
                    buttonAction: () => {
                      window.open(
                        `https://polkadot.js.org/apps/?rpc=${DEFAULT_PROVIDER}#/explorer/query/${res.status.asInBlock}`,
                        "_blank",
                      )
                    },
                    buttonText: "See transaction",
                  })
                } else if (res.status.isBroadcast) {
                  appCtx.setNotification({
                    title: "Ad Submitting",
                    text: `Block hash:: ${res.status.hash.toHuman()}.`,
                    show: true,
                    type: "info",
                    buttonAction: () => {
                      window.open(
                        `https://polkadot.js.org/apps/?rpc=${DEFAULT_PROVIDER}#/explorer/query/${res.status.hash.toHuman()}`,
                        "_blank",
                      )
                    },
                    buttonText: "See transaction",
                    autoClose: 3000,
                  })
                }
              })
            } catch (err) {
              appCtx.setNotification({
                title: "Error creating Ad",
                type: "error",
                text: "Error:".concat((err as any)?.message),
                show: true,
              })
            }
            appCtx.setShowCreatedAdd(false)
          }}
        >
          Post
        </Button>
      </Box>
    </Box>
  )
}

export default CreateAd
