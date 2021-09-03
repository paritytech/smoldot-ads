import { useEffect, useState } from "react"
import { logger } from "@polkadot/util"
import useIsMountedRef from "./useIsMountedRef"
import { definitions } from "../config/definitions"
// TODO: Alter the polkadotJS api to Detector
// import { Detector }  from "@substrate/connect"
// import adzSpecs from '../assets/ads-chainspec.json';
// import westend from '../assets/westend.json';
const { ApiPromise, WsProvider } = require("@polkadot/api")

const l = logger("Smoldot Adz")

export default function useApiCreate() {
  const [api, setApi] = useState<any>({})
  const [apiIsReady, setApiIsReady] = useState<boolean>(false)

  const mountedRef = useIsMountedRef()

  useEffect((): void => {
    const choseSmoldot = async (): Promise<void> => {
      try {
        // TODO: Alter the polkadotJS api to Detector
        //
        // const chainSpec = JSON.stringify(adzSpecs);
        // const detect = new Detector("Smoldot Adz")
        // const api = await detect.connect("westend", { name: "Adz", spec: chainSpec })
        // console.log("Smoldot Adz is now connected to westend and parachain Adz")

        const types = definitions.types
        const wsProvider = new WsProvider("ws://127.0.0.1:9944")
        const api = await ApiPromise.create({
          provider: wsProvider,
          types,
        })

        // Checks if the component using this hook is still mounted in order to set theApi
        // If this check does not exist there may be error on console saying:
        // "Cannot setState on unmounted Component"
        if (mountedRef.current) {
          setApi(api)
          setApiIsReady(true)
        }
      } catch (err) {
        l.error("Error:", err)
        setApiIsReady(false)
      }
    }
    void choseSmoldot()
  }, [])

  return { api, apiIsReady }
}
