import axios from "axios";
import {NETWORKS} from "./accountManager";

async function claimFaucet(account, network) {
    return new Promise<string>( (resolve, reject) => {
        axios.post("https://faucet-api.polispay.org/",
            {address: account[0], network: NETWORKS[network]}
        ).then(response => {
            if (response.data.error) {
                reject(response.data.error)
            } else {
                resolve(response.data.data)
            }
        }).catch(e => reject(e))
    })
}

export default claimFaucet;