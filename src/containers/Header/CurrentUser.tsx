import React, { ChangeEvent } from "react"
import {
  onSelectActiveAccount,
  useActiveAccount,
  useAccountBalance,
  useAccounts,
} from "../../services"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import { makeStyles } from "@material-ui/core/styles"
import Identicon from "@polkadot/react-identicon"
import { styled } from "@material-ui/core/styles"
import { Box } from "@material-ui/core"
import { capitalize } from "../../utils"

function onChange(
  e: ChangeEvent<{ name?: string | undefined; value: unknown }>,
) {
  onSelectActiveAccount(e.target.value as string)
}

const useStyles = makeStyles((theme) => ({
  boxControl: {
    position: "absolute",
    minWidth: 120,
    top: "10px",
    right: "10px",
  },
  formControl: {
    margin: theme.spacing(0.5),
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  accountName: {
    fontSize: "17px",
    color: "#334048",
    fontWeight: 600,
    paddingRight: "5px",
  },
  accountBalance: {
    margin: theme.spacing(1),
    fontSize: "15px",
    color: "#334048",
    fontWeight: 400,
  },
  item: {
    padding: "20px",
  },
}))

const MySelect = styled(Select)({
  borderRadius: 10,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  padding: "0 5px",
  height: "40px",
})

export const CurrentUser: React.FC = () => {
  const classes = useStyles()

  const accounts = useAccounts()
  const balance = useAccountBalance()
  const activeAccount = useActiveAccount().payload

  return (
    activeAccount && (
      <Box display="flex" alignItems="center" className={classes.boxControl}>
        <span className={classes.accountBalance}>{balance}</span>
        <FormControl variant="outlined" className={classes.formControl}>
          <MySelect
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={activeAccount.address}
            onChange={onChange}
          >
            {Object.values(accounts).map((account) => {
              const { address, meta } = account.payload
              const displayName = capitalize((meta as any).name)
              return (
                <MenuItem
                  className={classes.item}
                  key={address}
                  value={address}
                >
                  <Box display="flex" alignItems="center">
                    <Identicon
                      className={classes.identIcon}
                      size={18}
                      theme="polkadot"
                      value={address}
                      onCopy={() => {
                        console.log("copy")
                      }}
                    />
                    <span className={classes.accountName}>{displayName}</span>
                  </Box>
                </MenuItem>
              )
            })}
          </MySelect>
        </FormControl>
      </Box>
    )
  )
}
