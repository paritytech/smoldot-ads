import React, { useEffect, useRef, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import { Box, Chip, makeStyles } from "@material-ui/core"
import { useTopTags } from "../../services"

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  emptyTag: {
    cursor: "pointer",
    color: "#ABB8BF",
    backgroundColor: "white",
    border: "1px solid #ABB8BF",
  },
  selectedTag: {
    padding: "6px",
    cursor: "pointer",
    color: "#556068",
    backgroundColor: "#EAEEF1",
    border: "1px solid #EAEEF1",
  },
  tagSearchField: {
    width: "200px",
  },
})

export const Tags: React.FC<{
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  tags: string[]
}> = ({ tags, onAddTag, onRemoveTag }) => {
  const [isAdding, setIsAdding] = useState(false)
  const classes = useStyles()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="left"
      className={classes.row}
      style={{ paddingBottom: "25px" }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag}
          style={{ marginRight: "5px" }}
          className={classes.selectedTag}
          size="small"
          label={tag}
          onDelete={() => {
            onRemoveTag(tag)
          }}
        />
      ))}
      {isAdding ? (
        <NewTag
          onSelect={(tag) => {
            setIsAdding(false)
            if (tag) {
              onAddTag(tag)
            }
          }}
        />
      ) : (
        <Chip
          style={{ marginRight: "5px" }}
          className={classes.emptyTag}
          size="small"
          label="Add Tag..."
          onClick={() => {
            setIsAdding(true)
          }}
        />
      )}
    </Box>
  )
}

function TagTextField(props: any) {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    ref.current!.focus()
    function handleEsc(e: KeyboardEvent) {
      // MAKE ESCAPE WORK
    }
    ref.current!.addEventListener("keydown", handleEsc)
  }, [])

  const [value, setValue] = useState<string>(props.value)

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value.trimEnd())
      }}
      inputRef={ref}
    />
  )
}

const filter = createFilterOptions<{ tag: string; label: string }>()

const NewTag: React.FC<{ onSelect: (tag: string | null) => void }> = ({
  onSelect,
}) => {
  const classes = useStyles()
  const options = useTopTags().map((tag) => ({ tag, label: tag }))

  return (
    <Autocomplete
      onChange={(_, value, reason) => {
        console.log("val", value)
        const tag = value && (typeof value === "string" ? value : value.tag)
        onSelect(
          reason === "select-option" || (reason as any) === "create-option"
            ? tag
            : null,
        )
      }}
      className={classes.tagSearchField}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)
        const { inputValue } = params
        const isExisting = options.some((option) => inputValue === option.tag)
        if (inputValue !== "" && !isExisting) {
          filtered.unshift({
            label: `Add "${inputValue}"`,
            tag: inputValue,
          })
        }
        return filtered
      }}
      open
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={options}
      getOptionLabel={({ label }) => label}
      freeSolo
      renderInput={(params) => <TagTextField {...params} />}
    />
  )
}
