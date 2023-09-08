import { Component } from "react";
import getWeb3 from "../../utils/getWeb3";
import Authenticity from "../../contracts/Authenticity.json"

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

    componentDidMount = async()=>{
        try{
            const web3 = await getWeb3();

            const accounts = await  web3.eth.getAccounts();
            console.log("About Page",accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork= Authenticity.networks[networkId];
            const instance = new web3.eth.Contract(
                Authenticity.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({web3, accounts, contract: instance}, this.getAcctHistory);
        }
        catch(error){
            console.error("[Web3 Error]",error);
            this.setState({web3: null, errorBanner: true}, this.forceUpdate)
            return (
                <h1>
                    connection error
                </h1>
            )
        }
    };

    getAcctHistory= async ()=>{
        console.log(userHash);
        const {accounts, contract } = this.state;
        console.log("Inside History")
        console.log("accounts ",accounts[0],accounts[1])
        let response
        try{
            response = await contract.getPastEvents("Filecertified",{
                fromBlock: 0,
                toBlock: "latest"
            });
        }
        catch(e){
            console.error("[getAcctHistory  error]",e);
            this.setState({web3:null, errorBanner: true}, this.forceUpdate)
        }
        console.log(">>>>>>>>>>",response,"getAcctHistory Events>--------")
        console.log(response.length);
        total=response.length;
        this.setState({accountHistory: response, errorBanner: false})

        console.log("test",contract);
    }

    outputHistory = () =>{
        if(this.state.accountHistory === null){
            return(<p>Nothing to show you!</p>)
        }
        else if(this.state.accountHistory.length === 0){
            return (windows.alert("Failed to Verify"));
        }
        
    }

    render(){
        return(
            <h1>About Page</h1>
        )
    }

}

export default AboutPage;