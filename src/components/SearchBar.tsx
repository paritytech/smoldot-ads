import React, { useEffect, useState } from 'react';
import { createStyles, Grid, makeStyles, Input, Theme, IconButton, Chip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridder: {
      margin: '40px 0 10px 10px',
    },
    textfield: {
      border: '1px solid #eee',
      padding: '4.5px 8px 3.5px',
      borderRadius: '4px',
      backgroundColor: '#F7F7F7'
    },
    iconButton: {
      border: '1px solid #eee',
      marginLeft: '20px',
      borderRadius: 4,
      padding: '6.4px 20px 7.4px',
      color: theme.palette.text.primary,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#fff',
      }
    },
    tagContainer: {
      padding: '10px 0'
    },
    chip: {
      margin: '4px 5px 0 0'
    }
  }),
);

const tagSeparators = [',', ';', ' ']

const Tag = (tagName: string) => {
  return (
    <div>{tagName}</div>
  )
}

const SearchBar = () => {
  const classes = useStyles();
  const [input, setInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    
  }, [])

  const changeInput = (ch: string, enter?: boolean) => {
    if (enter) {
      setTags([...tags, ch]);
      setInput('');
    } else if (ch && !tagSeparators.includes(ch.trim()) && ch.trim() && tagSeparators.includes(ch.substr(-1))) {
      setTags([...tags, ch.slice(0, -1)]);
      setInput('');
    } else {
      setInput(ch);
    }
  }

  const deleteTag = (tag: string): void => {
    const currTags = [...tags];
    const index = currTags.indexOf(tag);
    if (index > -1) {
      currTags.splice(index, 1);
      setTags(currTags);
    }
  }

  const searchItems = () => {
    console.log('Do thy search');
  }

  return (
    <Grid item container xs={12} className={classes.gridder}>
      <Grid item xs={9}>
        <Input 
          className={classes.textfield}
          placeholder="search by poster address or ad text"
          type="text"
          value={input}
          disableUnderline
          onKeyPress={(event) => {
            if(event.key === 'Enter'){
              if (input) {
                changeInput(input, true);
              }
              searchItems()
            }
          }}
          onChange = {(e) => {
            changeInput(e.target.value);
          }}
          fullWidth />
      </Grid>
      <Grid item xs={3}>
        <IconButton onClick={() => searchItems()} disabled={!tags.length} className={classes.iconButton}>
          <SearchIcon fontSize="medium" />
        </IconButton>
      </Grid>
      <Grid item xs={9} className={classes.tagContainer}>
        {tags.map(t => 
          <Chip
            className={classes.chip}
            label={t}
            onClick={() => console.log('click')}
            onDelete={() => deleteTag(t)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default SearchBar;