import { Button, Card, CardContent, Modal, Paper, Typography } from '@mui/material';
import extensions from '../../assets/fileIcons/';
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStamp } from '@fortawesome/free-solid-svg-icons';
import { CloudUploadOutlined, Label } from '@mui/icons-material';
const IPFS = require('ipfs-api');
const { Component } = require('react');
const { default: getWeb3 } = require('../../utils/getWeb3');
const ipfs = new IPFS({host:"ipfs.infura.io", port: 5001, protocol:"https"});


var recep="recep_add";
class FileCertificatorPage extends Component{
    constructor(){
        super()
        this.state={
            accountHistory: null,
            web3:null,
            accounts: null,
            contract: null,
            fileHash: null,
            fileSize: null,
            buffer: null,
            fileExtension: null,
            clickAnimation: 'shadow-pop-tr',
            clickAnimation2: "",
            fadeInAnimation: "fade-in",
            errorBanner:true,
            isTxModalOpen: false,
            modalContent: null
        };
        this.handleChange= this.handleChange.bind(this);
        this.handleSubmit= this.handleSubmit.bind(this);
    }
    handleClose = () => {
        this.setState({ open: false });
      };
    
      handleOpen = () => {
        this.setState({ open: true });
      };
      
    handleChange(event){
        this.setState({value: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event){
        recep=this.state.value;
        console.log("recep add= ",recep);
        event.preventDefault();
    }

    componentDidMount = async () =>{
        try{
            //Get The network provider and web3 instance
            const web3 = await getWeb3();
            //Get The first Account
            const accounts = await web3.eth.getAccounts();
            console.log("This is the account", accounts[0]);
            this.setState({web3, accounts});
        }
        catch(error){
            console.log("[WEB3 ERROR]",error);
            this.setState({web3:null, errorBanner:true}, this.forceUpdate)
            return (<h1>connection error</h1>)
        }
    };

    certifyFile = async () => {
        const {accounts, contract } = this.state;
        this.state.fileExtension=recep;
        const dataToWrite={
            fileSize: this.state.fileSize,
            fileHash: this.state.fileHash,
            fileExtension: this.state.fileExtension
        }

        await contract.methods.certifyFile(dataToWrite.fileSize, dataToWrite.fileHash, dataToWrite.fileExtension).send({from : accounts[0]});

        window.alert("File sent to address"+ recep);
        
        this.getAcctHistory();
    };

    getAcctHistory = async () =>{
        const {accounts, contract} =this.state;

        console.log("Inside History")
        console.log("accounts ",accounts[0],accounts[1])
        let response
        try{
            response = await contract.getPastEvents("FileCertified",{
                fromBlock: 0,
                toBlock: "latest"
            });
        }catch(e){
            console.error("[GetAcctHistory Error]",e);
            this.setState({web3: null, errorBanner: true},this.forceUpdate)
        }

        console.log(">>>>>>>>>>>", response, "getAcctHistory  Events>------")
        this.setState({accountHistory: response, errorBanner: false})
        console.log("test",contract);
    }

    arrayBufferToWordArray = (ab) =>{
        var i8a = Uint8Array(ab);
        var a = [];
        for(var i =0; i < i8a.length; i+=4){
            a.push(i8a[i]<<24 | i8a[i+1]<<16 | i8a[i+2]<<8 | i8a[i+3])
        }
        return CryptoJS.lib.WordArray.create(a, i8a.length)
    } 

    addtoBchain = (hashValue, uplFileSize, uplFileExtension)=>{
        console.log("Setting");
        console.log("Adding Recep to Bchain", recep);
        this.setState({fileHash: hashValue, fileSize: uplFileSize, fileExtension: uplFileExtension}, () =>{
            console.log("State >>", this.state)
        })
        this.getAcctHistory();
    }
    uploadtoipfs = (hashValue, uplFileSize, uplFileExtension) =>{
        ipfs.files.add(this.state.buffer, (error, result)=>{
            if(error){
                console.log("error in buffer");
                console.error(error)
                return
            }
            console.log("ipfsHash", result[0].hash);

            hashValue = result[0].hash;
            if(hashValue != null){
                console.log("Hash is not null");
                uplFileExtension=recep;
                this.addtoBchain(hashValue, uplFileSize, uplFileExtension)
            }
        })
    }

    uploadFile = async(event)=>{
        console.log("********",event.target.files[0].name)
        const uplFile= event.target.files[0]
        const uplFileSize = uplFile.size
        const uplFileExtension = uplFile.name.split('.').pop()
        console.log(uplFile)
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        var hashValue = null;
        this.buffer=null
        reader.onloadend = () =>{
            this.setState({buffer: Buffer(reader.result)})
            console.log("buffer", this.state.buffer)
            this.uploadtoipfs(hashValue,uplFileSize,uplFileExtension);
        }
    }
        toggleTxModal(keyElement){
            let {isTxModalOpen}=this.state;
            if(isTxModalOpen === false){
                isTxModalOpen = true
                this.setState({
                    isTxModalOpen,
                    modalContent: this.state.accountHistory[keyElement]
                })
            }
            else{
                isTxModalOpen=false
                this.setState({
                    isTxModalOpen,
                    modalContent:null
                })
            }
        }
        
        timestampToDateStr(timestamp) {
            let theDate = new Date(timestamp * 1000)
            return theDate.toUTCString()
        }

        outputFileHash = () =>{
            if (this.state.fileHash===null){
                return (null)
            }
            return (
                <div>
                    <p className={"fileSize fade-in"}>
                        Review the Metadata
                    </p>
                    <div>
                        <p className={"fileSize fade-in"}>
                            <u>IPFS HASH:</u>
                        </p>
                        <p className={"fileSize2 fade-in"}>
                            <strong>
                                {this.state.fileHash}
                            </strong>
                        </p>
                        <p className={"fileSize fade-in"}>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Enter the recipient Wallet address:
                                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                                </label>
                                <input type="button" onClick={this.handleSubmit} value="Confirm" />
                            </form>
                        </p>
                        <p className={"fileSize fade-in"}><u>FILE SIZE (KB):</u></p>
                        <p className={"fileSize2 fade-in"}><strong>{this.state.fileSize/1024}</strong></p>
                    </div>
                </div>
            )
        }

        outputHistory = () =>{
            if(this.state.accountHistory === null){
                return (
                    <p id='ad'>Loading past interactions...</p>
                )
            }
            else if(this.state.accountHistory.length===0){
                return(
                    <p id="sf">Nothing to show yet!</p>
                )
            }
            const interactions = this.state.accountHistory.map((interaction, key)=>{
                let myFileHash,iconImage,transactionID;
                myFileHash = interaction.returnValues.fileHash.substring(0,30)+"..."
                transactionID = interaction.transactionHash.substring(0,15)+"..."
                let dateStamp = new Date(interaction.returnValues.timestamp * 1000)
                if(!extensions[interaction.returnValues.fileExtension]){
                    iconImage = extensions.file
                }
                else{
                    iconImage = extensions[interaction.returnValues.fileExtension]
                }
                return(
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
            })
            return(
                <div className={"pastInteractionBox"}>
                    {interactions}
                </div>
            )  
        }
        renderCertifyBtn(){
            if(!this.state.fileHash){
                return(
                    null
                )
            }
            return(
                <div>
                    <p className={"fileSize fade-in"}> Timestamp the metadata into the blockchain</p>
                    <div className={"stepsContainer"}>
                        <Button className={`${this.state.fadeInAnimation} certifyfileFinalBtn`} color='success' onClick={
                            () => this.certifyFile()
                        }
                        disabled={!this.state.fileHash} style={{padding: '20px'}}>
                            <FontAwesomeIcon icon={faStamp}></FontAwesomeIcon>
                            CERTIFY FILE
                        </Button>
                    </div>
                </div>
            )
        }

        generateModalContent() {
            const {modalContent}=this.state
            if(modalContent===null){
                return null
            }
            console.log("ModalContent",modalContent);

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
    
    render(){
        // if(!this.state.web3 || this.state.errorBanner === true){
        //     return(
        //         <div className={'globalErrCont'}> 
        //         <p>Loading Web3, accounts, and contract........</p>
        //         </div>
        //     );
        // }
        return (
            <>
            <div className={"globalCont"} justify="center">
                <section>
                    <div id={"heroTitles"}>
                        <h1>Decentralized Certificate Authentication</h1>
                        <h2>Certify the Authenticity of any File</h2>
                        <p id=" ">By writing a timestamped digital signature of your file into the ethereum blockchain, you can mathematicaly prove its existence and its integrit over time.</p>

                    </div>
                    <div id="fileUplcont">
                        <div className={"stepsContainer"}>
                            <Button size='lg' className={'certifyBtn'}>
                            <label htmlFor="fileCert">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadOutlined />}>
                                    CHOOSE FILE
                                </Button>
                            </label>
                            </Button>
                            <p className={"tutorialParags"}> select the file that you want to upload to IPFS and insert into Blockchain</p>
                        </div>
                        <input id ="fileCert" name='fileCert' type='file' onChange={(e)=>this.uploadFile(e)} />

                        {this.outputFileHash()}
                        {this.renderCertifyBtn()}
                    </div>
                </section>

                <div className={"pastInterContainer"}>
                    {this.outputHistory()}
                </div>
            </div>
            {this.generateModalContent()}
            </>
        )
    }
}


export default FileCertificatorPage;