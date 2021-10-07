import React from "react"
import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  TextField,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import { useSortedTags } from "../services"
import { onChangeSelectedTags } from "../services/filteredAdIds"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridder: {
      margin: "40px 0 10px 10px",
    },
    tagSearchField: {
      border: "1px solid #eee",
      padding: "4.5px 8px 3.5px",
      borderRadius: "10px",
      backgroundColor: "transparent",
    },
    textfield: {
      border: "1px solid #eee",
      padding: "4.5px 8px 3.5px",
      borderRadius: "10px",
      backgroundColor: "#F7F7F7",
    },
    iconButton: {
      cursor: "pointer",
      border: "1px solid #eee",
      marginLeft: "20px",
      borderRadius: 4,
      padding: "4.4px 20px 4.4px",
      color: theme.palette.text.primary,
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#fff",
      },
    },
    tagContainer: {
      padding: "10px 0",
    },
    chip: {
      margin: "4px 5px 0 0",
    },
  }),
)

const SearchBar = () => {
  const classes = useStyles()
  const tags = useSortedTags()

  return (
    <Grid item container xs={12} className={classes.gridder}>
      <Grid item xs={9}>
        <Autocomplete
          multiple
          id="size-small-outlined-multi"
          size="small"
          className={classes.tagSearchField}
          onChange={(_, tags) => {
            onChangeSelectedTags(tags)
          }}
          options={tags}
          getOptionLabel={(label) => label}
          renderInput={(params) => {
            return <TextField {...params} />
          }}
        />
      </Grid>
      <Grid item xs={3}></Grid>
      <Grid item xs={9} className={classes.tagContainer}></Grid>
    </Grid>
  )
}

export default SearchBar
