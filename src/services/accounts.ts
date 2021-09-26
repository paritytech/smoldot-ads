import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map, startWith } from "rxjs/operators"
import { createTestKeyring } from "@polkadot/keyring"
import { KeyringPair } from "@polkadot/keyring/types"

const accounts: Record<string, KeyringPair> = Object.fromEntries(
  createTestKeyring().pairs.map(
    (account) => [account.address, account] as const,
  ),
)
const DEFAULT_ADDRESS = Object.keys(accounts)[0]
export const useAccounts = () => accounts

const [selectedActiveAccount$, onSelectActiveAccount] = createSignal(
  (address: string) => address,
)
export { onSelectActiveAccount }

export const [useActiveAccount, activeAccount$] = bind<KeyringPair>(
  selectedActiveAccount$.pipe(
    startWith(DEFAULT_ADDRESS),
    map(
      (selecteAddress) => accounts[selecteAddress] ?? accounts[DEFAULT_ADDRESS],
    ),
  ),
)

activeAccount$.subscribe()
