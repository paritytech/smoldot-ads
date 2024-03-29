import React from "react"
import { Box, makeStyles, Typography } from "@material-ui/core"
import Identicon from "@polkadot/react-identicon"
import { useActiveAccount, useAccountBalance } from "../services/accounts"
import { capitalize } from "../utils"

const useStyles = makeStyles({
  row: {
    marginBottom: "12.5px",
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  userName: {
    fontSize: "12px",
    color: "#334048",
  },
  balance: {
    fontFamily: "Roboto Mono, Arial, sans-serif",
    color: "#3D474D",
    fontSize: "13px",
  },
})

export const UserRow: React.FC = () => {
  const classes = useStyles()
  const activeAccount = useActiveAccount().payload
  const balance = useAccountBalance()

  const name = capitalize(activeAccount.meta.name as string)

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.row}
    >
      <Box display="flex" alignItems="center" className={classes.row}>
        <Identicon
          className={classes.identIcon}
          size={22}
          theme="polkadot"
          value={activeAccount.address}
          onCopy={() => {
            return
          }}
        />
        <Typography variant="body2" className={classes.userName}>
          {name}
        </Typography>
      </Box>
      <Typography variant="body2" className={classes.balance}>
        {balance}
      </Typography>
    </Box>
  )
}
