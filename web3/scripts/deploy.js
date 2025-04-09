const hre = require("hardhat");

async function main() {
  //STACKING  CONTRACT
  const tokenStaking = await hre.ethers.deployContract("TokenStaking");
  await tokenStaking.waitForDeployment();
 //console.log(` STACKING: ${tokenStaking.target}`);
  //TOKEN CONTRACT
  const theblockchaincoders = await hre.ethers.deployContract
  ("Theblockchaincoders");
  await theblockchaincoders.waitForDeployment();
  //CONTRACT ADDRESS
console.log(` STACKING: ${tokenStaking.target}`);
console.log(` TOKEN: ${theblockchaincoders.target}`);

}
main().catch((error) => {
  console.error(error);y
  process.exitCode = 1;
});
