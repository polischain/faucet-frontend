import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export enum ChainId {
    SPARTA = 333888,
    ATHENE = 333999,
}

export const NETWORKS = {
    [ChainId.SPARTA]: "testnet",
    [ChainId.ATHENE]: "mainnet"
}

const PARAMS: {
    [chainId in ChainId]?: {
        chainId: string
        chainName: string
        nativeCurrency: {
            name: string
            symbol: string
            decimals: number
        }
        rpcUrls: string[]
        blockExplorerUrls: string[]
    }
} = {
    [ChainId.SPARTA]: {
        chainId: '0x51840',
        chainName: 'Sparta',
        nativeCurrency: {
            name: 'Polis',
            symbol: 'POLIS',
            decimals: 18
        },
        rpcUrls: [
            "https://sparta-rpc.polis.tech"
        ],
        blockExplorerUrls: ['https://sparta-explorer.polis.tech']
    },
}


class AccountManager {

    connected: boolean;
    busy: boolean;
    web3Provider;
    web3;
    balance: number;
    network: string;
    account;
    formatted_balance;

    constructor() {
        this.connected = false;
        this.busy = false;
        this.web3Provider = null;
        this.web3 = null;
        this.balance = 0;
        this.network = "0";
    }

    async connect(network: ChainId) {
        if (!this.connected) {
            const providerOptions = {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        infuraId: "INFURA_ID" // required
                    }
                }
            };

            const web3Modal = new Web3Modal({
                providerOptions // required
            });

            this.web3Provider = await web3Modal.connect();

            try {
                this.account = await this.web3Provider.request({
                    method: "eth_requestAccounts",
                    params: [],
                });

                await this.web3Provider.request({method: "wallet_addEthereumChain", params: [PARAMS[network]]})
            } catch (error) {
                // User denied account access...
                console.error(`User denied account access: ${error}`);
            }

            this.web3 = new Web3(this.web3Provider);

            this.network = await this.web3.eth.net.getId();

            const keys = Object.keys(PARAMS);

            if (keys.indexOf(this.network.toString()) !== -1) {
                this.connected = true;
                console.log(`connected: ${this.account} ${typeof this.account}`);
                return this.account;
            }
        }
    }

    getFormattedBalance(balance, decimals): string {
        let balance_BN = this.web3.utils.toBN(balance);
        let decimals_BN = this.web3.utils.toBN(10**decimals);
        let before_comma = balance_BN.div(decimals_BN).toString();
        let after_comma = balance_BN.mod(decimals_BN).toString();
        after_comma = after_comma.padStart(decimals, "0");
        return before_comma + "." + after_comma + " POLIS";
    }

    async getBalance(formatted = true) {
        const decimals = 18;
        this.balance = await this.web3.eth.getBalance(String(this.account));
        this.formatted_balance = this.getFormattedBalance(this.balance, decimals);
        return formatted ? this.formatted_balance : this.balance;
    }

}

export default AccountManager;
