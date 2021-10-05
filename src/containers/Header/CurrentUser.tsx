import React, { ChangeEvent } from "react"
import {
  accounts,
  onSelectActiveAccount,
  useActiveAccount,
  useAccountBalance,
} from "../../../src/services"
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'
import Identicon from "@polkadot/react-identicon"
import { styled } from '@material-ui/core/styles'

function onChange(e: ChangeEvent<{ name?: string | undefined; value: unknown; }>) {
  onSelectActiveAccount(e.target.value as string)
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: 120,
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  identIcon: {
    marginRight: "10px",
    border: "0.5px solid #ccc",
    borderRadius: "10px",
  },
  accountName: {
    fontSize: '17px',
    color: '##334048',
    fontWeight: 600
  },
  item: {
    padding: '20px'
  }
}));

const MySelect = styled(Select)({
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  padding: '0 5px',
  height: '40px'
})

export const CurrentUser: React.FC = () => {
  const classes = useStyles();

  const activeAccount = useActiveAccount()
  const balance = useAccountBalance()
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <MySelect
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={activeAccount.address}
        onChange={onChange}
      >
        {Object.values(accounts).map((account) => {
          const { address, meta} = account
          const displayName = (meta as any).name.charAt(0).toUpperCase() + (meta as any).name.slice(1);
          return (
            <MenuItem className={classes.item} value={address}>
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
            </MenuItem>
        )})}
      </MySelect>
    </FormControl>
  )
}
