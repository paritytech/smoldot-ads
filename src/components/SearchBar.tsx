import React, { useEffect, useRef, useState } from "react"
import {
  createStyles,
  Grid,
  makeStyles,
  Input,
  Theme,
  IconButton,
  Chip,
  TextField,
} from "@material-ui/core"
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import SearchIcon from "@material-ui/icons/Search"
import { useTopTags } from "../services"

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

const tagSeparators = [",", ";", " "]

const Tag = (tagName: string) => {
  return <div>{tagName}</div>
}

const TagTextField = (props: any) => {
  const [value, setValue] = useState<string>(props.value)

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value.trimEnd())
      }}
    />
  )
}

const SearchBar = () => {
  const classes = useStyles()
  const [input, setInput] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const options = useTopTags().map((tag) => ({ tag, label: tag }))

  const changeInput = (ch: string, enter?: boolean) => {
    setTags([...tags, ch])
    // if (enter) {
    //   setTags([...tags, ch])
    //   setInput("")
    // } else if (
    //   ch &&
    //   !tagSeparators.includes(ch.trim()) &&
    //   ch.trim() &&
    //   tagSeparators.includes(ch.substr(-1))
    // ) {
    //   setTags([...tags, ch.slice(0, -1)])
    //   setInput("")
    // } else {
    //   setInput(ch)
    //   setTags([...tags, ch.slice(0, -1)])
    // }
  }

  const deleteTag = (tag: string): void => {
    const currTags = [...tags]
    const index = currTags.indexOf(tag)
    if (index > -1) {
      currTags.splice(index, 1)
      setTags(currTags)
    }
  }

  const searchItems = () => {
    console.log("Do thy search")
  }

  const filter = createFilterOptions<{ tag: string; label: string }>()

  return (
    <Grid item container xs={12} className={classes.gridder}>
      <Grid item xs={9}>
        <Autocomplete
          multiple
          id="size-small-outlined-multi"
          size="small"
          className={classes.tagSearchField}
          onChange={(_, value, reason) => {
            const tag =
              value[value.length - 1] &&
              (typeof value === "string" ? value : value[value.length - 1].tag)
            changeInput(tag)
          }}
          options={options.filter((o) => !tags.includes(o.label))}
          getOptionLabel={({ label }) => label}
          renderInput={(params) => {
            return <TagTextField {...params} />
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <IconButton
          onClick={() => searchItems()}
          className={classes.iconButton}
        >
          <SearchIcon fontSize="medium" />
        </IconButton>
      </Grid>
      <Grid item xs={9} className={classes.tagContainer}>
        {tags.map((t) => (
          <Chip
            className={classes.chip}
            label={t}
            onClick={() => console.log("click")}
            onDelete={() => deleteTag(t)}
          />
        ))}
      </Grid>
    </Grid>
  )
}

export default SearchBar
