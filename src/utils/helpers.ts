// NOTE: This is just a file for quick
// access on specific functions - SHOULD be deleted
import { ApiPromise } from "@polkadot/api"

// import {
//   extrinsicSuccOrFail,
//   getSignedBlock,
//   mapExtrinsicsToEvents,
// } from "./utils/helpers"

// getSignedBlock(
//   api,
//   "0x2aea5cbdaf2f6f3639e0570664178104e5ea80da0fae1ab35140b85dd07845cd",
// )
// mapExtrinsicsToEvents(
//   api,
//   "0x2aea5cbdaf2f6f3639e0570664178104e5ea80da0fae1ab35140b85dd07845cd",
// )

// extrinsicSuccOrFail(
//   api,
//   "0x2aea5cbdaf2f6f3639e0570664178104e5ea80da0fae1ab35140b85dd07845cd",
// )

// view extrinsic information
export const getSignedBlock = async (api: ApiPromise, block?: string) => {
  const signedBlock = await api.rpc.chain.getBlock(block)
  signedBlock.block.extrinsics.forEach(
    (
      ex: {
        toHuman?: any
        signer?: any
        nonce?: any
        isSigned?: any
        meta?: any
        method?: any
      },
      index: any,
    ) => {
      // the extrinsics are decoded by the API, human-like view
      console.log(index, ex.toHuman())

      const {
        isSigned,
        meta,
        method: { args, method, section },
      } = ex

      console.log("meta", meta)
      // explicit display of name, args & documentation
      console.log(
        `${section}.${method}(${args
          .map((a: { toString: () => any }) => a.toString())
          .join(", ")})`,
      )

      // signer/nonce info
      if (isSigned) {
        console.log(
          `signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`,
        )
      }
    },
  )
}

// map extrinsics to their events
export const mapExtrinsicsToEvents = async (
  api: ApiPromise,
  block?: string,
) => {
  // no blockHash is specified, so we retrieve the latest
  const signedBlock = block
    ? await api.rpc.chain.getBlock(block)
    : await api.rpc.chain.getBlock()
  const allRecords = await api.query.system.events.at(
    signedBlock.block.header.hash,
  )

  // map between the extrinsics and events
  signedBlock.block.extrinsics.forEach(
    ({ method: { method, section } }, index) => {
      // filter the specific events based on the phase and then the
      // index of our extrinsic in the block
      const events = allRecords
        .filter(
          ({ phase }) =>
            phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index),
        )
        .map(({ event }) => `${event.section}.${event.method}`)

      console.log(`${section}.${method}:: ${events.join(", ") || "no events"}`)
    },
  )
}

// determine if an extrinsic succeeded/failed

export const extrinsicSuccOrFail = async (api: ApiPromise, block?: string) => {
  // no blockHash is specified, so we retrieve the latest
  const signedBlock = block
    ? await api.rpc.chain.getBlock(block)
    : await api.rpc.chain.getBlock()
  const allRecords = await api.query.system.events.at(
    signedBlock.block.header.hash,
  )

  // map between the extrinsics and events
  signedBlock.block.extrinsics.forEach(
    ({ method: { method, section } }, index) => {
      allRecords
        // filter the specific events based on the phase and then the
        // index of our extrinsic in the block
        .filter(
          ({ phase }) =>
            phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index),
        )
        // test the events against the specific types we are looking for
        .forEach(({ event }) => {
          if (api.events.system.ExtrinsicSuccess.is(event)) {
            // extract the data for this event
            // (In TS, because of the guard above, these will be typed)
            const [dispatchInfo] = event.data

            console.log(`${section}.${method}:: ExtrinsicSuccess::`)
            console.dir(dispatchInfo.toHuman())
          } else if (api.events.system.ExtrinsicFailed.is(event)) {
            // extract the data for this event
            const [dispatchError, dispatchInfo] = event.data
            let errorInfo

            // decode the error
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              // (For specific known errors, we can also do a check against the
              // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
              const decoded = api.registry.findMetaError(dispatchError.asModule)

              errorInfo = `${decoded.section}.${decoded.name}`
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              errorInfo = dispatchError.toString()
            }

            console.log(`${section}.${method}:: ExtrinsicFailed:: ${errorInfo}`)
          }
        })
    },
  )
}

// const header = await api.rpc.chain.getHeader()
// console.log(api.genesisHash.toHex());
// // The amount required to create a new account
// console.log(api.consts.balances.existentialDeposit.toNumber());
// // The amount required per byte on an extrinsic
// console.log(api.consts.transactionPayment.transactionByteFee.toNumber());

// const metadata = await api.rpc.state.getMetadata()
// console.log("version: " + metadata.version)
// console.dir(JSON.stringify(metadata.asLatest.toHuman(), null, 2))

// const resData = await api.rpc.chain.getBlock(
//   "0x11f0cea0fd6061bfad4e7d9feabf1c7a216761373f5ae8fdf5459ef335554b00",
// )

// console.log(
//   await api.rpc.chain.getBlock(
//     "0x1186ec0381952d79ff8f3893d88f591955aec7cc9575c84e9f0734e929f710f4",
//   ),
// )

// const [chain, nodeName, nodeVersion] = await Promise.all([
//   api.rpc.system.chain(),
//   api.rpc.system.name(),
//   api.rpc.system.version(),
// ])
// console.log(
//   `You are connected to chain ${chain.toString()} using ${nodeName.toString()} - v${nodeVersion.toString()}`,
// )

// console.dir(JSON.stringify(metadata.asLatest.toHuman(), null, 2))

// const header = await api.rpc.chain.getHeader()
// console.log("header is", header.toHuman())
// const blockHash = await api.rpc.chain.getBlockHash(header.hash)
// console.log("blockHash", blockHash)

// const metadata = await api.rpc.state.getMetadata()
