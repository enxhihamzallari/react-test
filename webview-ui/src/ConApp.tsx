import { useEffect } from "react"
import { connect } from "./connections"


export function ConApp() {

      useEffect(()=>{
        connect()
      }, [])


    return <></>
}
