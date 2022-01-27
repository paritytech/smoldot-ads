# Smoldot Ads uApp

A demo of classified ads using smoldot and substrate-connect

After cloning the repo run:
`npm install` or `npm i`
in order to install all dependencies.

Then run `npm start` in order to run the UI.

Demo can be found here:
https://ipfs.io/ipfs/QmesuqusRhP3FpppZxJzxpqV2ksTFGawrmbyqHCffg7EDD/

## Run ads demo locally

In order to run locally the demo the environment.
The environment consists from a relay-chain (westend), and a custom [parachain](https://github.com/wanderer/adz).

## Launch the Relay Chain

```
git clone https://github.com/paritytech/polkadot
cd polkadot
git fetch
git checkout master
cargo build --release
```

### Generate a raw chain spec

`./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode --raw > rococo-local.json`

Run 2 needed dev accounts for the relay chain in seperate terminals (alice and bob)

### Alice

`./target/release/polkadot --chain rococo-local.json --alice -d /tmp/alice --listen-addr /ip4/0.0.0.0/tcp/30333/ws --listen-addr /ip6/::/tcp/30333/ws`

### Bob (In a separate terminal)

`./target/release/polkadot --chain rococo-local.json --bob -d /tmp/bob --listen-addr /ip4/0.0.0.0/tcp/30334/ws --listen-addr /ip6/::/tcp/30334/ws --bootnodes '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE'`

Ensure you replace `ALICE_BOOTNODE_ID_HERE` with the node ID from the output of the first terminal.

After that the `rococo-local.json` spec that was created before should be filled with the 2 bootnodes as follows:

```
bootnodes: [
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE',
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/BOB_BOOTNODE_ID_HERE'`
```

## Launch the Parachain

```
git clone git@github.com:wanderer/adz.git
cd adz
```

and build the parachain:

```
cargo build --release
```

You can create raw parachain specs that can be used in the app by running:

```
./target/release/parachain-collator build-spec --raw
```

### Alter generated parachain specs

On the generated specs there are few changes that must take place:

- change the "para_id" with the one you want to use (default is 2000 - in our case 200)
- change the "relay_chain" to match the "id" from Relay chain spec (here will be rococo-local)
- in the bootnodes value add the `/ws/` before `p2p` and feel all needed bootnodes IDs. Final outcome will be:

```
"bootNodes": [
  "/ip4/127.0.0.1/tcp/30333/ws/p2p/12D3KooWBRFpW2FMT5bfgBNShgPgNmYArkZdD6CQZ4sJhrgd2vVb"
],
```

### Export genesis state and wasm

### Genesis state

#### --parachain-id 200 as an example that can be chosen freely. Make sure to everywhere use the same parachain id

`./target/release/parachain-collator export-genesis-state --parachain-id 200 > genesis-state`

### Genesis wasm

`./target/release/parachain-collator export-genesis-wasm > genesis-wasm`

Collators are similar to validators in the relay chain. These nodes build the blocks that will eventually be included by the relay chain for a parachain.
Replace <parachain_id_u32_type_range> with the parachain id chosen above (example here is 200).
Run 2 needed collators, each one in a different terminal. Due tot he fact that the parachain is using Aura the Collators should run with `--alice` and `--bob` flags

### Collator1

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --alice --port 40335 --ws-port 9946 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30335/ws`

### Collator2

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --bob --port 40336 --ws-port 9947 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30336/ws`

### Run Parachain Full Node 1

Run the full node for the parachain:
`./target/release/parachain-collator --tmp --parachain-id 200 --ws-port 9948 --ws-external -- --execution wasm --chain ../polkadot/rococo-local.json --port 30337`

## Register the parachain

Open up your favourite browser and navigate to `https://polkadot.js.org/apps`. Click the logo on top left of the screen to open the menu drawer, and choose your development local chain at the bottom of the menu.

![Screenshot from 2021-09-06 09-35-49](https://user-images.githubusercontent.com/5408605/132174261-80c4b085-241d-439d-8998-834968283da3.png)

Once this is done, navigate from top menu to `Developer > Sudo` and to `Sudo access` tab menu (should be default).
As can be seen in the image below choose in the dropdowns: `parasSudoWrapper` and `sudoScheduleParaInitialize`, filling the ID (200 here) in the input field below.

Before launching the collators (above) we generated 2 files (genesis state and wasm). Add these two files (upload) as needed in the ParaGenesis args below, choose `Yes` as boolean and `Submit`

Navigating to `Network` > `Parachains`, will appear a `Parathread` but no parachain (see image below)

![parathread](https://user-images.githubusercontent.com/5408605/132323096-c4e8afbe-694a-4d0a-a714-87487933ff32.png)

This is due to the fact that the parachain has not initialized yet.
After a while the parathread will become a parachain and the following image should appear:

![Screenshot from 2021-09-06 09-34-43](https://user-images.githubusercontent.com/5408605/132174492-5e9a3cc1-6ede-4092-9725-b82ad415f879.png)

## Launch the Relay Chain

```
git clone https://github.com/paritytech/polkadot
cd polkadot
git fetch
git checkout master
cargo build --release
```

### Generate a raw chain spec

`./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode --raw > rococo-local.json`

Run 2 needed dev accounts for the relay chain in seperate terminals (alice and bob)

### Alice

`./target/release/polkadot --chain rococo-local.json --alice -d /tmp/alice --listen-addr /ip4/0.0.0.0/tcp/30333/ws --listen-addr /ip6/::/tcp/30333/ws`

### Bob (In a separate terminal)

`./target/release/polkadot --chain rococo-local.json --bob -d /tmp/bob --listen-addr /ip4/0.0.0.0/tcp/30334/ws --listen-addr /ip6/::/tcp/30334/ws --bootnodes '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE'`

Ensure you replace `ALICE_BOOTNODE_ID_HERE` with the node ID from the output of the first terminal.

After that the `rococo-local.json` spec that was created before should be filled with the 2 bootnodes as follows:

```
bootnodes: [
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE',
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/BOB_BOOTNODE_ID_HERE'`
```

## Launch the Parachain

```
git clone git@github.com:wanderer/adz.git
cd adz
```

and build the parachain:

```
cargo build --release
```

You can create raw parachain specs that can be used in the app by running:

```
./target/release/parachain-collator build-spec --raw
```

### Alter generated parachain specs

On the generated specs there are few changes that must take place:

- change the "para_id" with the one you want to use (default is 2000 - in our case 200)
- change the "relay_chain" to match the "id" from Relay chain spec (here will be rococo-local)
- in the bootnodes value add the `/ws/` before `p2p` and feel all needed bootnodes IDs. Final outcome will be:

```
"bootNodes": [
  "/ip4/127.0.0.1/tcp/30333/ws/p2p/12D3KooWBRFpW2FMT5bfgBNShgPgNmYArkZdD6CQZ4sJhrgd2vVb"
],
```

### Export genesis state and wasm

### Genesis state

#### --parachain-id 200 as an example that can be chosen freely. Make sure to everywhere use the same parachain id

`./target/release/parachain-collator export-genesis-state --parachain-id 200 > genesis-state`

### Genesis wasm

`./target/release/parachain-collator export-genesis-wasm > genesis-wasm`

Collators are similar to validators in the relay chain. These nodes build the blocks that will eventually be included by the relay chain for a parachain.
Replace <parachain_id_u32_type_range> with the parachain id chosen above (example here is 200).
Run 2 needed collators, each one in a different terminal. Due tot he fact that the parachain is using Aura the Collators should run with `--alice` and `--bob` flags

### Collator1

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --alice --port 40335 --ws-port 9946 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30335/ws`

### Collator2

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --bob --port 40336 --ws-port 9947 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30336/ws`

### Run Parachain Full Node 1

Run the full node for the parachain:
`./target/release/parachain-collator --tmp --parachain-id 200 --ws-port 9948 --ws-external -- --execution wasm --chain ../polkadot/rococo-local.json --port 30337`

## Register the parachain

Open up your favourite browser and navigate to `https://polkadot.js.org/apps`. Click the logo on top left of the screen to open the menu drawer, and choose your development local chain at the bottom of the menu.

![Screenshot from 2021-09-06 09-35-49](https://user-images.githubusercontent.com/5408605/132174261-80c4b085-241d-439d-8998-834968283da3.png)

Once this is done, navigate from top menu to `Developer > Sudo` and to `Sudo access` tab menu (should be default).
As can be seen in the image below choose in the dropdowns: `parasSudoWrapper` and `sudoScheduleParaInitialize`, filling the ID (200 here) in the input field below.

Before launching the collators (above) we generated 2 files (genesis state and wasm). Add these two files (upload) as needed in the ParaGenesis args below, choose `Yes` as boolean and `Submit`

Navigating to `Network` > `Parachains`, will appear a `Parathread` but no parachain (see image below)

![parathread](https://user-images.githubusercontent.com/5408605/132323096-c4e8afbe-694a-4d0a-a714-87487933ff32.png)

This is due to the fact that the parachain has not initialized yet.
After a while the parathread will become a parachain and the following image should appear:

![Screenshot from 2021-09-06 09-34-43](https://user-images.githubusercontent.com/5408605/132174492-5e9a3cc1-6ede-4092-9725-b82ad415f879.png)## Launch the Relay Chain

```
git clone https://github.com/paritytech/polkadot
cd polkadot
git fetch
git checkout master
cargo build --release
```

### Generate a raw chain spec

`./target/release/polkadot build-spec --chain rococo-local --disable-default-bootnode --raw > rococo-local.json`

Run 2 needed dev accounts for the relay chain in seperate terminals (alice and bob)

### Alice

`./target/release/polkadot --chain rococo-local.json --alice -d /tmp/alice --listen-addr /ip4/0.0.0.0/tcp/30333/ws --listen-addr /ip6/::/tcp/30333/ws`

### Bob (In a separate terminal)

`./target/release/polkadot --chain rococo-local.json --bob -d /tmp/bob --listen-addr /ip4/0.0.0.0/tcp/30334/ws --listen-addr /ip6/::/tcp/30334/ws --bootnodes '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE'`

Ensure you replace `ALICE_BOOTNODE_ID_HERE` with the node ID from the output of the first terminal.

After that the `rococo-local.json` spec that was created before should be filled with the 2 bootnodes as follows:

```
bootnodes: [
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/ALICE_BOOTNODE_ID_HERE',
   '/ip4/127.0.0.1/tcp/30333/ws/p2p/BOB_BOOTNODE_ID_HERE'`
```

## Launch the Parachain

```
git clone git@github.com:wanderer/adz.git
cd adz
```

and build the parachain:

```
cargo build --release
```

You can create raw parachain specs that can be used in the app by running:

```
./target/release/parachain-collator build-spec --raw
```

### Alter generated parachain specs

On the generated specs there are few changes that must take place:

- change the "para_id" with the one you want to use (default is 2000 - in our case 200)
- change the "relay_chain" to match the "id" from Relay chain spec (here will be rococo-local)
- in the bootnodes value add the `/ws/` before `p2p` and feel all needed bootnodes IDs. Final outcome will be:

```
"bootNodes": [
  "/ip4/127.0.0.1/tcp/30333/ws/p2p/12D3KooWBRFpW2FMT5bfgBNShgPgNmYArkZdD6CQZ4sJhrgd2vVb"
],
```

### Export genesis state and wasm

### Genesis state

#### --parachain-id 200 as an example that can be chosen freely. Make sure to everywhere use the same parachain id

`./target/release/parachain-collator export-genesis-state --parachain-id 200 > genesis-state`

### Genesis wasm

`./target/release/parachain-collator export-genesis-wasm > genesis-wasm`

Collators are similar to validators in the relay chain. These nodes build the blocks that will eventually be included by the relay chain for a parachain.
Replace <parachain_id_u32_type_range> with the parachain id chosen above (example here is 200).
Run 2 needed collators, each one in a different terminal. Due tot he fact that the parachain is using Aura the Collators should run with `--alice` and `--bob` flags

### Collator1

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --alice --port 40335 --ws-port 9946 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30335/ws`

### Collator2

`./target/release/parachain-collator --collator --tmp --parachain-id 200 --bob --port 40336 --ws-port 9947 -- --execution wasm --chain ../polkadot/rococo-local.json --listen-addr /ip4/0.0.0.0/tcp/30336/ws`

### Run Parachain Full Node 1

Run the full node for the parachain:
`./target/release/parachain-collator --tmp --parachain-id 200 --ws-port 9948 --ws-external -- --execution wasm --chain ../polkadot/rococo-local.json --port 30337`

## Register the parachain

Open up your favourite browser and navigate to `https://polkadot.js.org/apps`. Click the logo on top left of the screen to open the menu drawer, and choose your development local chain at the bottom of the menu.

![Screenshot from 2021-09-06 09-35-49](https://user-images.githubusercontent.com/5408605/132174261-80c4b085-241d-439d-8998-834968283da3.png)

Once this is done, navigate from top menu to `Developer > Sudo` and to `Sudo access` tab menu (should be default).
As can be seen in the image below choose in the dropdowns: `parasSudoWrapper` and `sudoScheduleParaInitialize`, filling the ID (200 here) in the input field below.

Before launching the collators (above) we generated 2 files (genesis state and wasm). Add these two files (upload) as needed in the ParaGenesis args below, choose `Yes` as boolean and `Submit`

Navigating to `Network` > `Parachains`, will appear a `Parathread` but no parachain (see image below)

![parathread](https://user-images.githubusercontent.com/5408605/132323096-c4e8afbe-694a-4d0a-a714-87487933ff32.png)

This is due to the fact that the parachain has not initialized yet.
After a while the parathread will become a parachain and the following image should appear:

![Screenshot from 2021-09-06 09-34-43](https://user-images.githubusercontent.com/5408605/132174492-5e9a3cc1-6ede-4092-9725-b82ad415f879.png)
