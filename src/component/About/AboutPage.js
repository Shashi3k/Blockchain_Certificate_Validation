import { Component } from "react";
import getWeb3 from "../../utils/getWeb3";
import Authenticity from "../../contracts/Authenticity.json"
import extensions from "../../assets/fileIcons";
import { Button, Modal, Paper, Typography } from "@mui/material";

var userHash = "";
var valid = 0;
var total = 10000;
var author = ""

class AboutPage extends Component {
    constructor() {
        super()
        this.state = {
            accountHistory: null,
            web3: null,
            accounts: null,
            contract: null,
            fileHash: null,
            fileSize: null,
            buffer: null,
            fileExtension: null,
            clickAnimation: 'shadow-pop-tr',
            clickAnimation2: '',
            fadeInAnimation: 'fade-in',
            errorBanner: true,
            isTxModalOpen: false,
            modalContent: null,
            value: '',
            cnt: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        userHash = this.state.value;
        event.preventDefault();
        { this.outputHistory() }
        { this.checkAuth() }
    }

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();
            console.log("About Page", accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Authenticity.networks[networkId];
            const instance = new web3.eth.Contract(
                Authenticity.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ web3, accounts, contract: instance }, this.getAcctHistory);
        }
        catch (error) {
            console.error("[Web3 Error]", error);
            this.setState({ web3: null, errorBanner: true }, this.forceUpdate)
            return (
                <h1>
                    connection error
                </h1>
            )
        }
    };

    getAcctHistory = async () => {
        console.log(userHash);
        const { accounts, contract } = this.state;
        console.log("Inside History")
        console.log("accounts ", accounts[0], accounts[1])
        let response
        try {
            response = await contract.getPastEvents("FileCertified", {
                fromBlock: 0,
                toBlock: "latest"
            });
        }
        catch (e) {
            console.error("[getAcctHistory  error]", e);
            this.setState({ web3: null, errorBanner: true }, this.forceUpdate)
        }
        console.log(">>>>>>>>>>", response, "getAcctHistory Events>--------")
        console.log(response.length);
        total = response.length?response!=null:0;
        this.setState({ accountHistory: response, errorBanner: false })

        console.log("test", contract);
    }

    outputHistory = () => {
        if (this.state.accountHistory === null) {
            return (<p>Nothing to show you!</p>)
        }
        else if (this.state.accountHistory!=null && this.state.accountHistory.length === 0) {
            return (window.alert("Failed to Verify"));
        }
        const interactions = this.state.accountHistory.map((interaction, key) => {
            this.state.cnt += 1;
            console.log("Count=", this.state.cnt);
            let myFileHash, iconImage, transactionID;
            myFileHash = interaction.returnValues.fileHash.substring(0, 30) + "..."
            transactionID = interaction.transactionHash.substring(0, 15) + "..."
            let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
            if (!extensions[interaction.returnValues.fileExtension]) {
                iconImage = extensions.file
            }
            else {
                iconImage = extensions[interaction.returnValues.fileExtension]
            }
            console.log("checking with ", interaction.returnValues.fileHash);
            if (interaction.returnValues.fileHash === userHash) {
                valid = 1;
                var dwnurl = "https://ipfs.infura.io/ipfs/" + userHash;
                window.alert("The certificate is genuine and issued by TIET, it may be downloaded from " + dwnurl);
                console.log("Certi Ok");
                if (window.confirm("The certificate is genuine and issued by TIET, click OK to download ")) {
                    window.location.href = dwnurl;
                }
                else {
                    window.location.href = "http://location:3000/about"
                };
            }
        })
        return (
            <div className={"pastInteractionBox"}>
                {interactions}
            </div>
        )
    }

    generateModalContent() {
        const { modalContent } = this.state

        if (modalContent === null) {
            return null
        }
        console.log("ModalContent", modalContent);


        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleOpen}>
                    Open Modal
                </Button>
                <Modal open={this.state.isTxModalOpen} onClose={this.handleClose}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            File Details
                        </Typography>
                        <div className="modalBodyClass">
                            <Typography variant="subtitle1">
                                <b>Submission Date:</b>
                            </Typography>
                            <Typography variant="body1">
                                {this.timestampToDateStr(modalContent.returnValues.timestamp)}
                            </Typography>
                            <Typography variant="subtitle1">
                                <b>IPFS File Hash:</b>
                            </Typography>
                            <pre className="modelHashData">
                                {modalContent.returnValues.fileHash}
                            </pre>
                            <Typography variant="subtitle1">
                                <b>File Size:</b>
                            </Typography>
                            <Typography variant="body1">
                                {modalContent.returnValues.fileSize}
                            </Typography>
                            <Typography variant="subtitle1">
                                <b>Recipient Address:</b>
                            </Typography>
                            <Typography variant="body1">
                                {modalContent.returnValues.fileExtension}
                            </Typography>
                        </div>
                        <div align="center">
                            <Button variant="contained" color="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                        </div>
                    </Paper>
                </Modal>
            </div>
        )
    }

    checkAuth = () => {
        console.log("TOT= ", total);
        if (total === this.state.cnt && valid === 0) {
            window.alert("FAILED TO VERIFY CERTIFICATE");
            return (<p>STATUS:VERIFICATION FAILED</p>);
        }
    }

    render() {

        return (
            <>
                <div className={"globalCont"} justify="center">

                    <div className={"pastInterContainer"}>
                        {this.outputHistory()}

                        <p> Certificate issue portal TIET</p>

                    </div>
                </div>

                {this.generateModalContent()}
            </>
        )
    }
}

export default AboutPage;