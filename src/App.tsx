import React, {useState} from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './App.css';


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadButton from "./LoadButton";
import AccountManager, {ChainId} from "./controller/accountManager";
import faucetClaim from "./controller/faucet";
import {Button} from "reactstrap";

const accountManager = new AccountManager();

function App() {
    const [account, setAccount] = useState("Not connected");
    const [balance, setBalance] = useState("0");
    const [txLink, setTxLink] = useState("");
    const [network, setNetwork] = useState(0)
    const [captcha, setCaptcha] = useState("");

    return (
        <div>
            <div className="App">
                <ToastContainer hideProgressBar={true} />
                <div className="App-banner" style={{"marginTop": "50px"}}>
                    <img src="/images/logo-512x512.png" className="App-logo" alt="logo" />
                </div>
                <div className="App-banner" style={{"paddingTop": "50px"}}>
                    <h1 className="App-title" style={{"fontSize": "40px"}}>Polis Faucet</h1>
                </div>
                <header className="App-header">
                    <h1 style={{"fontSize": "24px"}} hidden={network !== 0}>Select a network</h1>
                    <div className="Commands">
                        <Button color="warning" size="lg" hidden={network !== 0} style={{
                            margin: "10px",
                        }} onClick={ () => setNetwork(ChainId.SPARTA)}>Sparta <br/> (Testnet)</Button>
                        <Button color="success" size="lg" hidden={network !== 0} style={{
                            margin: "10px",
                        }} onClick={ () => setNetwork(ChainId.ATHENE)} disabled>Athene <br/>(Mainnet)</Button>

                        <LoadButton
                            text="Connect"
                            loadingText="Loading..."
                            hidden={account !== "Not connected" || network === 0}
                            color="#0053a0"
                            onClick={() => accountManager.connect(network).then((account) => {
                                if (!account) {
                                    toast.error("Wrong network: Please select connect to Polis " + network + " first")
                                }
                                else{
                                    setAccount(account);
                                    accountManager.getBalance().then((balance) => {setBalance(balance)});
                                }
                            })}
                        />
                        <LoadButton
                            text={"Receive"}
                            loadingText="Sending..."
                            color="#0053a0"
                            hidden={account === "Not connected" || !captcha}
                            onClick={() => faucetClaim(account, network, captcha)
                                .then((hash) => {
                                    toast.success("Transaction sent!");
                                    setTxLink(hash);
                                    setBalance(accountManager.getFormattedBalance(Number(accountManager.balance+10000000000000000000000000), 18));
                                })
                                .catch((error) => {
                                    toast.error(error)
                                })
                            }
                        />
                    </div>
                    <div style={{"margin": "15px"}} hidden={captcha !== ""}>
                        <form id="receive" action="" method="POST" hidden={account === "Not connected"}>
                            <HCaptcha
                                theme="dark"
                                sitekey={"e4201a38-772c-4dd8-aef0-ce457b4d87c5"}
                                onVerify={(token: string) => { setCaptcha(token) }}
                            />
                        </form>
                    </div>

                    <p hidden={account === "Not connected"}>{account}</p>
                    <p hidden={account === "Not connected"}>{"Your balance: " + String(balance)}</p>
                    <a hidden={txLink === ""} target="_blank" rel="noopener noreferrer" href={"https://sparta-explorer.polis.tech/tx/"+ txLink}>{txLink}</a>
                </header>
            </div>
        </div>
  );
}

export default App;
