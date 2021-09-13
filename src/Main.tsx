import React from "react"
import { ThemeProvider, createTheme } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { AdsLight } from "./themes/index"
import Sidebar from "./containers/Sidebar"
import Container from "./containers/Container"

import Notification from "./components/Notification"

const Main = () => {
  const appliedTheme = createTheme(AdsLight)
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
