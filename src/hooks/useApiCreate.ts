import { useEffect, useState } from "react"
import { logger } from "@polkadot/util"
import useIsMountedRef from "./useIsMountedRef"
// import { Detector }  from "@substrate/connect"
// import adzSpecs from '../assets/ads-chainspec.json';
// import westend from '../assets/westend.json';
const { ApiPromise, WsProvider } = require('@polkadot/api');

const l = logger("Smoldot Adz")

export default function useApiCreate () {
  const [api, setApi] = useState<any>({})

  const  mountedRef = useIsMountedRef()

  useEffect((): void => {
    const choseSmoldot = async (): Promise<void> => {
      try {
        // const chainSpec =  JSON.stringify(adzSpecs);
        // const detect = new Detector("Smoldot Adz")
        // const api = await detect.connect("westend", { name: "Adz", spec: chainSpec })
        // console.log("Smoldot Adz is now connected to westend and parachain Adz")
        
        const wsProvider = new WsProvider('ws://127.0.0.1:9944');
        const api = await ApiPromise.create({ provider: wsProvider });
        mountedRef.current && setApi(api)
      } catch (err) {
        l.error("Error:", err)
      }
    }    
    void choseSmoldot()
  }, [mountedRef])

  return api
}
