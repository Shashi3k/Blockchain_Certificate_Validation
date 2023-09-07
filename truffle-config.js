require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const { INFURA_ENDPOINT, MNEMONIC } = process.env;


module.exports = {

  contracts_build_directory:"src/contracts",
  networks: {

    development: {

      host: "127.0.0.1",

      port: 8545,

      network_id: "*"

    },

    goerli: {

      provider: () => new HDWalletProvider(MNEMONIC, INFURA_ENDPOINT),

      network_id: '5',

    },

  },

  compilers: {

    solc: {

      version: "0.8.19",

    }

  }

};