import React, { useState } from "react"
import { ThemeProvider, createTheme } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import { AdsLight } from "./themes/index"
import Sidebar from "./containers/Sidebar"
import Container from "./containers/Container"
import { AppContext } from "./contexts/AppContext"

import Notification from "./components/Notification"
import { NotificationProps } from "./types"

const Main = () => {
  const appliedTheme = createTheme(AdsLight)
  const [notification, setNotification] = useState<NotificationProps>({
    text: "",
  })

  return (
    <ThemeProvider theme={appliedTheme}>
      <AppContext.Provider value={{ notification, setNotification }}>
        <Notification {...notification} />
        <Grid container xs={12}>
          <Sidebar />
          <Container />
        </Grid>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default Main
