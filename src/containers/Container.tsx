import React, { useEffect, useState } from "react"
import { createStyles, Grid, makeStyles } from "@material-ui/core"
import { ApiCreateType } from "../types"

import Ad from "../components/Ad"
import SearchBar from "../components/SearchBar"
import DetailedAd from "../components/DetailedAd"
import useApiCreate from "../hooks/useApiCreate"
import {
  extrinsicSuccOrFail,
  getSignedBlock,
  mapExtrinsicsToEvents,
} from "../utils/helpers"
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

// const ads = [
//   {
//     id: 1,
//     author: "Grace",
//     title: "Vote Alice for Mayor!",
//     created: 1630392607000,
//     tags: ["Announcement"],
//     location: "10555, Berlin",
//     body: "I bake and deliver pizza!",
//     comments: 8,
//   },
//   {
//     id: 2,
//     author: "Grace",
//     title: "Pizza Delivery Berlin",
//     created: 1630392607000,
//     tags: ["Pizza"],
//     location: "10555, Berlin",
//     body: "This is an announcement",
//     comments: 8,
//   },
//   {
//     id: 3,
//     author: "Grace",
//     title: "Rent my flat",
//     created: 1630392607000,
//     tags: ["Pizza"],
//     location: "10555, Berlin",
//     body: "I bake and deliver pizza!",
//     comments: 8,
//   },
//   {
//     id: 4,
//     author: "Grace",
//     title: "Fix my bug",
//     created: 1630392607000,
//     tags: ["Jobs"],
//     location: "10555, Berlin",
//     body: "I bake and deliver pizza!",
//     comments: 8,
//   },
//   {
//     id: 5,
//     author: "Grace",
//     title: "Give me a job - Marce, the Rust Dev",
//     created: 1630392607000,
//     tags: ["CV"],
//     location: "10555, Berlin",
//     body: "This is an announcement",
//     comments: 8,
//   },
//   {
//     id: 6,
//     author: "Grace",
//     title: "Exchange your DOT <-> my KSM",
//     created: 1630392607000,
//     tags: ["Swap"],
//     location: "10555, Berlin",
//     body: "I’ve got 10’000 KSM which I’d like to exchange for DOT. My price is 0.04 and I will use the ...",
//     comments: 8,
//   },
//   {
//     id: 7,
//     author: "Grace",
//     title: "Test Ad",
//     created: 1630392607000,
//     tags: [],
//     location: "10555, Berlin",
//     body: "Just testing",
//     comments: 8,
//   },
//   {
//     id: 8,
//     author: "Grace",
//     title: "Rent my flat",
//     created: 1630392607000,
//     tags: ["Pizza", "Test", "More", "Tags"],
//     location: "10555, Berlin",
//     body: "Just testing more tags",
//     comments: 8,
//   },
// ]

type AdType = {
  id: number
  author: string
  title: string
  body: string
  tags: string[]
  created: number
  comments?: number
}

const Container = () => {
  const apiResp: ApiCreateType = useApiCreate()

  const classes = useStyles()
  const [isClicked, setIsClicked] = useState<number | null>(null)
  const [clickedAd, setClickedAd] = useState<AdType | undefined>()

  const [ads, setAds] = useState<any[]>([])

  useEffect(() => {
    const getApiData = async () => {
      let p = 0
      const adsAmount = (await apiResp.api.query.adz.numOfAds()).toString()
      const retrievedAds = []
      for (let i = 0; i < parseInt(adsAmount); i++) {
        const a = await apiResp.api.query.adz.ads(i)
        const aToJSON = JSON.parse(a.toString())
        const numOfComments = parseInt(aToJSON.num_of_comments)
        let comms = []
        if (numOfComments) {
          for (let c = 0; c < numOfComments; c++) {
            let comment = (await apiResp.api.query.adz.comments(i, c)).toHuman()
            comms.push(comment)
          }
        }
        retrievedAds.push({
          id: p++,
          ...aToJSON,
          comments: comms || [],
        })
      }
      setAds(retrievedAds)
    }

    apiResp.apiIsReady && !ads.length && getApiData()
  }, [apiResp.api, apiResp.apiIsReady])

  useEffect(() => {
    setClickedAd(ads.find((a) => a.id === isClicked))
  }, [isClicked])

  return (
    <Grid item container className={classes.main} sm={9} md={10}>
      <Grid item xs={9}>
        <SearchBar />
      </Grid>
      <Grid item container xs={12} spacing={4}>
        <Grid item xs={6} className={classes.adsContainer}>
          {ads.map((ad, i) => (
            <Ad
              key={i}
              address={"5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE"}
              ad={ad}
              isClicked={isClicked}
              setClicked={setIsClicked}
            />
          ))}
        </Grid>
        <Grid item xs={6}>
          {isClicked && clickedAd && (
            <DetailedAd
              address={"5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE"}
              ad={clickedAd}
              setClicked={setIsClicked}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Container
