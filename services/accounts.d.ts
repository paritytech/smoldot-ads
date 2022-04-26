import type { KeypairType } from "@polkadot/util-crypto/types";
import { Signer } from "@polkadot/api/types";
import { KeyringPair } from "@polkadot/keyring/types";
export interface InjectedAccountWithMeta {
    address: string;
    meta: {
        genesisHash?: string | null;
        name?: string;
        source: string;
    };
    signer: Signer;
    type?: KeypairType;
}
export declare enum AccountType {
    KeyringPair = 0,
    InjectedAccountWithMeta = 1
}
export interface InjectedAccount {
    type: AccountType.InjectedAccountWithMeta;
    payload: InjectedAccountWithMeta;
}
export interface KeyringPairAccount {
    type: AccountType.KeyringPair;
    payload: KeyringPair;
}
declare const useAccounts: () => {
    [k: string]: InjectedAccount | KeyringPairAccount;
};
export { useAccounts };
declare const onSelectActiveAccount: (address: string) => void;
export { onSelectActiveAccount };
export declare const useActiveAccount: () => InjectedAccount | KeyringPairAccount, activeAccount$: import("rxjs").Observable<InjectedAccount | KeyringPairAccount>;
export declare const useAccountBalance: () => number | null;
//# sourceMappingURL=accounts.d.ts.map