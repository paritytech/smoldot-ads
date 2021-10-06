import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { filter, map, startWith, switchMap } from "rxjs/operators"
import { createTestKeyring } from "@polkadot/keyring"
import { systemQuery } from "./client"
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp"
import { defer, combineLatest } from "rxjs"
import type { KeypairType } from "@polkadot/util-crypto/types"
import { Signer } from "@polkadot/api/types"

export interface InjectedAccountWithMeta {
  address: string
  meta: {
    genesisHash?: string | null
    name?: string
    source: string
  }
  signer: Signer
  type?: KeypairType
}

const getAccounts = async () => {
  const extensions = await web3Enable("my app")
  let accounts: Array<InjectedAccountWithMeta> = []

  if (extensions.length === 0) {
    accounts = createTestKeyring().pairs as any
  } else {
    accounts = (await web3Accounts()) as any
    const signatures = await Promise.all(
      accounts.map((account) => web3FromSource(account.meta.source)),
    )
    accounts.forEach((account, idx) => {
      ;(account as any).signer = signatures[idx]
    })
  }

  return Object.fromEntries(
    accounts.map((account) => [account.address, account] as const),
  )
}

const [useAccounts, accounts$] = bind(
  defer(() => getAccounts()),
  {},
)
export { useAccounts }

const [selectedActiveAccount$, onSelectActiveAccount] = createSignal(
  (address: string) => address,
)
export { onSelectActiveAccount }

export const [useActiveAccount, activeAccount$] = bind(
  combineLatest([selectedActiveAccount$.pipe(startWith(null)), accounts$]).pipe(
    map(
      ([selecteAddress, accounts]) =>
        accounts[selecteAddress ?? Object.keys(accounts)[0]],
    ),
    filter(Boolean),
  ),
)

activeAccount$.subscribe()

export const [useAccountBalance] = bind(
  activeAccount$.pipe(
    filter(Boolean),
    switchMap(({ address }) =>
      systemQuery("account", address).pipe(
        map(({ data }) => data.free.toHuman()),
      ),
    ),
  ),
  null,
)
