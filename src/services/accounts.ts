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
import { KeyringPair } from "@polkadot/keyring/types"

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

export enum AccountType {
  KeyringPair,
  InjectedAccountWithMeta,
}

export interface InjectedAccount {
  type: AccountType.InjectedAccountWithMeta
  payload: InjectedAccountWithMeta
}

export interface KeyringPairAccount {
  type: AccountType.KeyringPair
  payload: KeyringPair
}

const getAccounts = async () => {
  const extensions = await web3Enable("Ads App")
  let accounts: Array<InjectedAccount> | Array<KeyringPairAccount> = []

  if (extensions.length === 0) {
    accounts = createTestKeyring().pairs.map((account) => ({
      type: AccountType.KeyringPair as const,
      payload: account,
    }))
  } else {
    const injectedAccounts = await (web3Accounts() as Promise<
      InjectedAccountWithMeta[]
    >)

    accounts = injectedAccounts.map((account) => ({
      type: AccountType.InjectedAccountWithMeta as const,
      payload: account,
    }))

    const signatures = await Promise.all(
      accounts.map((account) => web3FromSource(account.payload.meta.source)),
    )
    accounts.forEach((account, idx) => {
      account.payload.signer = signatures[idx].signer
    })
  }

  return Object.fromEntries(
    accounts.map((account) => [account.payload.address, account] as const),
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
    switchMap(({ payload: { address } }) =>
      systemQuery("account", address).pipe(
        map(({ data }) => data.free.toHuman()),
      ),
    ),
  ),
  null,
)
