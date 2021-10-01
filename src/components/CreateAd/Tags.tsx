import React, { useEffect, useRef, useState } from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete, {
  AutocompleteCloseReason,
  createFilterOptions,
} from "@material-ui/lab/Autocomplete"
import { Box, Chip, Input, makeStyles, Typography } from "@material-ui/core"
import AddIcon from "@material-ui/icons/AddCircleOutlineOutlined"

const filter = createFilterOptions<{ title: string; inputValue?: string }>()

const options = ["pizza", "CV", "jobs", "announcement"].map((title, id) => ({
  title,
  inputValue: "",
  id,
}))

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

export default function App() {
  const [tags, setTags] = useState<string[]>([])
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
        />
      ))}
      {isAdding ? (
        <NewTag
          onSelect={(tag) => {
            setIsAdding(false)

            if (tag) {
              setTags((prev) => {
                return prev.includes(tag) ? prev : [...prev, tag]
              })
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

function FocusTextField(props: any) {
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    ref.current!.click()
  }, [])

  return <TextField ref={ref} {...props} />
}

const NewTag: React.FC<{ onSelect: (tag: string | null) => void }> = ({
  onSelect,
}) => {
  const [value, setValue] = useState<{ title: string; inputValue?: string }>({
    title: "",
  })
  const selectedValue = useRef("")

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          const val: string = newValue
          setValue({
            title: val,
          })
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          })
        } else {
          setValue(newValue as any)
        }
      }}
      onClose={(_, reason) => {
        if (reason === "select-option" || (reason as any) === "create-option") {
          onSelect(selectedValue.current)
        } else {
          onSelect(null)
        }
      }}
      onInputChange={(_, value) => {
        selectedValue.current = value
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        const { inputValue } = params
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title)
        if (inputValue !== "" && !isExisting) {
          filtered.unshift({
            inputValue,
            title: `Add "${inputValue}"`,
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
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue
        }
        // Regular option
        return option.title
      }}
      renderOption={(props) => <li {...props}>{props.title}</li>}
      freeSolo
      renderInput={(params) => <FocusTextField {...params} label="New tag" />}
    />
  )
}
