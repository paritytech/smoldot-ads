import React, { useEffect, useState } from "react"
import { ThemeProvider, createTheme } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { AdsLight } from "./themes/index"
import Sidebar from "./containers/Sidebar"
import Container from "./containers/Container"

import Notification from "./components/Notification"
import useApiCreate from "./hooks/useApiCreate"

const Main = () => {
  const appliedTheme = createTheme(AdsLight)
  const api: any = useApiCreate()

  useEffect(() => {
    const getApiData = async () => {
      // // const header = await api.rpc.chain.getHeader()
      // console.log(api.genesisHash.toHex());
      // // The amount required to create a new account
      // console.log(api.consts.balances.existentialDeposit.toNumber());
      // // The amount required per byte on an extrinsic
      // console.log(api.consts.transactionPayment.transactionByteFee.toNumber());

      // const metadata = await api.rpc.state.getMetadata();
      // console.log('version: ' + metadata.version);
      // console.dir(JSON.stringify(metadata.asLatest.toHuman(), null, 2));
      console.log("api", api.query.adz)
    }
    Object.keys(api).length && getApiData()
  }, [api])

  return (
    <ThemeProvider theme={appliedTheme}>
      <Notification>
        <Grid container>
          <Sidebar />
          <Container />
        </Grid>
      </Notification>
    </ThemeProvider>
  )
}

export default Main
