import React, { useContext, useState } from "react"
import { Subscribe } from "@react-rxjs/core"
import { createStyles, Grid, makeStyles } from "@material-ui/core"

import Ad from "../components/Ad"
import SearchBar from "../components/SearchBar"
import DetailedAd from "../components/DetailedAd"
import { AppContext } from "../contexts/AppContext"
import CreateAd from "../components/CreateAd"
import { useFilteredAds } from "../services/filteredAdIds"
import { useIsApiReady } from "../services"

const useStyles = makeStyles(() =>
  createStyles({
    main: {
      paddingLeft: "20px",
      overflow: "hidden",
    },
    adsContainer: {
      overflowY: "auto",
      height: "90vh",
    },
    loading: {
      position: "relative",
      top: "20vh",
      left: "30vw",
      borderRadius: "8px",
      height: "100%",
      background: "#556068",
      color: "#fff",
      fontWeight: 600,
      padding: "24px 32px",
      fontSize: "17px",
    },
  }),
)

const Container = () => {
  const classes = useStyles()
  const appCtx = useContext(AppContext)
  const isApiReady = useIsApiReady()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const sortedAddIds = useFilteredAds()

  if (selectedId !== null && sortedAddIds.indexOf(selectedId) === -1) {
    setSelectedId(null)
  }

  return isApiReady ? (
    <Grid item container className={classes.main} sm={9} md={10}>
      <Grid item xs={9}>
        {appCtx.showCreatedAdd && <CreateAd />}
        <SearchBar />
      </Grid>
      <Grid item container xs={12} spacing={4}>
        <Grid item xs={6} className={classes.adsContainer}>
          {sortedAddIds.map((id) => (
            <Subscribe fallback={null} key={id}>
              <Ad
                id={id}
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
              onClick={() => {
                setSelectedId(null)
              }}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div className={classes.loading}>Loading...</div>
  )
}

export default Container
