const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("ReportSystem");
    const contract = await ContractFactory.deploy();
    console.log("Contract deployed to:", contract.target);
    console.log("Deployer address:", deployer.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
