import getWeb3 from "../../utils/getWeb3";
import Authenticity from "../../contracts/Authenticity.json"
import { Component } from "react";
import { Button, Card, CardContent, Modal, Paper, Typography } from "@mui/material";
import extensions from "../../assets/fileIcons";

var userHash="";
var valid=0;
var total=10000;
var author="";
var currAdd='';

class VerificationPage extends Component{
    constructor(){
        super()
        this.state={
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
            cnt:0
        };

        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this)
    }
    handleChange(event){
        this.setState({value: event.target.value});
    }

    handleSubmit(event){
        userHash=this.state.value;
        event.preventDefault();
    }

    componentDidMount = async() =>{
        try{
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();
            console.log("Verify Page",accounts[0]);
            currAdd=accounts[0];

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Authenticity.networks[networkId];
            const instance= new web3.eth.Contract(
                Authenticity.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({web3, accounts, contract: instance}, this.getAcctHistory)
        }
        catch(error){
            console.error("[Web3 Error]",error);
            this.setState({web3:null, errorBanner: true}, this.forceUpdate)
            return (
                <h1>
                    Connection error
                </h1>
            )
        }
    };

    getAcctHistory = async() =>{
        console.log(userHash);
        const {accounts, contract}= this.state;
        console.log("Inside History");
        console.log("accounts", accounts[0],accounts[1])
        let response
        try{
            response = await contract.getPastEvents("FileCertified",{
                fromBlock:0,
                toBlock:"latest"
            });

        }catch(e){
            console.error("[getAccountHistory Error]", e);
            this.setState({
                web3: null, errorBanner: true
            }, this.forceUpdate);
        }

        console.log(">>>>>>>>>>", response, "getAcctHistory Events>---------")
        console.log(response.length);
        total=response.length;
        this.setState({accountHistory: response, errorBanner: false})

        console.log("test", contract);
    }

    outputHistory = () =>{
        console.log("Address=", currAdd);
        if(this.state.accountHistory === null){
            return(
                <p> Loading past interactions.....</p>
            )
        }
        else if(this.state.accountHistory.length === 0){
            return(
                <p>Nothing to show yet!</p>
            )
        }

        const interactions = this.state.accountHistory.map((interaction, key)=>{
            console.log("-->",interaction)
            let myFileHash, iconImage, transactionID;
            myFileHash = interaction.returnValues.fileHash.substring(0,30)+"..."
            transactionID=interaction.transactionHash.substring(0,15)+"..."
            let dateStamp = new Date(interaction.returnValues.timestamp *1000)
            if (!extensions[interaction.returnValues.fileExtension]){
                iconImage = extensions.file
            }
            else{
                iconImage = extensions[interaction.returnValues.fileExtension]
            }
            if(interaction.returnValues.fileExtension==currAdd){
                return (
                    <Card className={'listItemTx'} key={key}>
                        <CardContent>
                            <div className={'cardBodyCont'}>
                                <div>
                                    <img src={iconImage} className={'historyTxFileIcon'} />
                                </div>
                                <div className={"historyTxDataPointsCont"}>
                                    <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">⌚️</span> Date: <b>{dateStamp.toUTCString()}</b></p>
                                    <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📦</span> File Size: <b>{interaction.returnValues.fileSize/1024} KB</b></p>
                                    <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">🔐</span> Digital Signature: <b>{myFileHash}</b></p>
                                    <p className={"historyTxDataPnt"}><span role="img" aria-label="asd">📒</span> Blockchain Transaction ID:<b>{transactionID}</b></p>
                                    <div>
                                        <Button onClick={() => this.toggleTxModal(key)} className={"getFileCertificate"}>Get Full Information</Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            }
        })
        return(
            <div className={"pastInteractionBox"}>
                {interactions}
            </div>
        )
    }

    timestampToDateStr(timestamp) {
        let theDate = new Date(timestamp * 1000)
        return theDate.toUTCString()
      }
      toggleTxModal(keyElement) {
        let { isTxModalOpen } = this.state
        if (isTxModalOpen === false) {
          isTxModalOpen = true
          this.setState({
            isTxModalOpen,
            modalContent: this.state.accountHistory[keyElement]
          })
        } else {
          isTxModalOpen = false
          this.setState({
            isTxModalOpen,
            modalContent: null
          })
        }
    }

      generateModalContent() {
        const { modalContent } = this.state
    
        if (modalContent === null) {
          return null
        }
    
        console.log("MODALCONTENTTT", modalContent);

        return(
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
        console.log("TOT= ",total);
        if(total===this.state.cnt && valid===0)
        {
          window.alert("FAILED TO VERIFY CERTIFICATE");
            return(<p>STATUS:VERIFICATION FAILED</p>);
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
    
          { this.generateModalContent() }
        </>
        )
      }
    }
    
    export default VerificationPage