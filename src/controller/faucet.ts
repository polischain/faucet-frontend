import axios from "axios";
import {NETWORKS} from "./accountManager";

async function claimFaucet(account, network, captcha) {
    return new Promise<string>( (resolve, reject) => {
        axios.post("https://faucet-api.polis.tech/",
            {address: account[0], network: NETWORKS[network], verify: captcha}
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
