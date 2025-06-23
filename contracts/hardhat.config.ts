import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import path from "path";
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // <--- THIS FIXES "Stack too deep" ERRORS!
    },
  },
  networks: {
    base_sepolia:{
      accounts:[
        PRIVATE_KEY as string
      ],
      url: "https://sepolia.base.org",
    }
  },
}

export default config;
