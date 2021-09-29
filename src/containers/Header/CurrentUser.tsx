import React from "react"
import {
  useAccounts,
  onSelectActiveAccount,
  useActiveAccount,
  useAccountBalance,
} from "../../../src/services"

function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
  onSelectActiveAccount(e.target.value)
}

export const CurrentUser: React.FC = () => {
  const accounts = useAccounts()
  const activeAccount = useActiveAccount()
  const balance = useAccountBalance()
  return (
    <div>
      <select onChange={onChange}>
        {Object.values(accounts).map((account) => (
          <option
            selected={account.address === activeAccount.address}
            value={account.address}
          >
            {(account.meta as any).name}
          </option>
        ))}
      </select>
      <span>{balance}</span>
    </div>
  )
}
