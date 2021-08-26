import React from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';

import SearchBar from '../components/SearchBar';

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      placeSelf: 'flex-start',
      marginLeft: '40px'
    },
    adBox: {
      margin: '10px',
      width: '100%',
      height: '50px',
      backgroundColor: '#F7F7F7',
      border: '1px solid #eee',
      borderRadius: '4px',
      padding: '10px'
    }
  }),
);


const Container = () => {
  const classes = useStyles();
  return (
    <Grid item container className={classes.main} xs={9}>
      <Grid item xs={9}>
        <SearchBar />
      </Grid>
      <Grid item xs={3}>
        <div></div>
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          {[1, 2, 3, 4, 5, 6].map(a => { 
            return (
              <div className={classes.adBox}>
                {a}
              </div>
            )})
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Container