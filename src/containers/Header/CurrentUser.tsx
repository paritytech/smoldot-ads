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
      <select onChange={onChange} value={activeAccount.address}>
        {Object.values(accounts).map((account) => (
          <option key={account.address} value={account.address}>
            {(account.meta as any).name}
          </option>
        ))}
      </select>
      <span>{balance}</span>
    </div>
  )
}
