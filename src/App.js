// import { Route, Router } from "react-router-dom";
// // import NavBar from "./component/NavBar/NavBar";
// import FileCertificatorPage from "./component/FileCertificatorPage/FileCertificatorPage";
// import VerificationPage from "./component/verification/verification";
// import AboutPage from "./component/About/AboutPage";
// import Test from "./component/test/test"
// const { Component } = require("react");


// class App extends Component{

//   render(){
//     return(
//       <div className="App">
//          {/* <NavBar /> */}
        
//         <FileCertificatorPage />

//         {/* /* <VerificationPage /> 
//         <AboutPage />
//         <Test /> */}
//         <footer>
//           <p className={"footerText"}>
//           © 2021 TIET | Made by Capstont Team 9
//           </p>
//         </footer>
//       </div>
//     )
//   }
// }

// export default App;

// import './App.css'
// import { useState } from 'react'
// import { create } from 'ipfs-http-client'
// import {Buffer} from 'buffer'

// const projectId = '2VG2HRw74lI6t0i4pq0O6RHnofv';
// const projectSecret = '0a8b203144747ebec74d1f2fb19f79e5';
// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
// const client = create({
//   host: 'https://ipfs.infura.io:5001/api/v0',
//     headers: {
//                 Authorization:
//                     auth
//             }
// })
// function App() {
//   const [fileUrl, updateFileUrl] = useState('')
//   async function onChange(e) {
//     const file = e.target.files[0]
//     try {
//       const added = await client.add(file)
//       const url = `https://ipfs.infura.io/ipfs/${added.path}`
//       updateFileUrl(url)
//       console.log(url)
//     } catch (error) {
//       console.log('Error uploading file: ', error)
//     }  
//   }
//   return (
//     <div className="App">
//       <h1>IPFS Example</h1>
      
//       <input
//         type="file"
//         onChange={onChange}
//       />
//       {
        
//         fileUrl && (
//           <img src={fileUrl} width="600px" /> 
//         )
//       }
//       <p>{fileUrl}</p>
      
//     </div>
//   );
// }
// export default App

// // QmRoYfxm6GQbuDw89LQAbYCyyXT75bNnuBLXxFdUxLrMVB

import { useState } from 'react'
import './App.css';
import FileCertifyPage from './component/FileCertificatorPage';

// insert your infura project crediental you can find 
// easily these your infura account in API key management section

function App() {

  return (
    <FileCertifyPage />
  )
}

export default App