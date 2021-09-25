import React, { useMemo, useState } from "react"
import { Subscribe } from "@react-rxjs/core"
import { createStyles, Grid, makeStyles } from "@material-ui/core"

import Ad from "../components/Ad"
import SearchBar from "../components/SearchBar"
import DetailedAd from "../components/DetailedAd"
import { useAdsAmount } from "../services"
const useStyles = makeStyles(() =>
  createStyles({
    main: {
      paddingLeft: "20px",
      overflow: "hidden",
    },
    adsContainer: {
      overflowY: "scroll",
      height: "90vh",
    },
  }),
)

const Container = () => {
  const classes = useStyles()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const nAds = useAdsAmount()
  const sortedAddIds = useMemo(
    () =>
      Array(nAds)
        .fill(null)
        .map((_, idx) => nAds - idx - 1),
    [nAds],
  )

  return (
    <Grid item container className={classes.main} sm={9} md={10}>
      <Grid item xs={9}>
        <SearchBar />
      </Grid>
      <Grid item container xs={12} spacing={4}>
        <Grid item xs={6} className={classes.adsContainer}>
          {sortedAddIds.map((id) => (
            <Subscribe fallback={null} key={id}>
              <Ad
                id={id}
                address={"5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE"}
                isClicked={id === selectedId}
                onClick={() => {
                  setSelectedId(id)
                }}
              />
            </Subscribe>
          ))}
        </Grid>
        <Grid item xs={6}>
          {selectedId !== null && (
            <DetailedAd
              id={selectedId}
              address={"5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE"}
              onClick={() => {
                setSelectedId(null)
              }}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Container
