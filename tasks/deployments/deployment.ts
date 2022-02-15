const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  try {

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const STAKED_AAVE_NAME = "Staked Bico Token";
    const STAKED_AAVE_SYMBOL = "stkBICO";
    const STAKED_AAVE_DECIMALS = 18;

    let tx, receipt;
    let totalGasUsed = 0;

    let stakedAaveImpl = await hre.ethers.getContractAt("contracts/proposals/extend-stkaave-distribution/StakedTokenV3.sol:StakedTokenV3", "0x4a679490173ae9185282c21b0364f9c5f1950d95");
    let stakedAaveProxy = await hre.ethers.getContractAt("contracts/lib/InitializableAdminUpgradeabilityProxy.sol:InitializableAdminUpgradeabilityProxy", "0xb0FE41e065Bb0a572956e295DCffe41c1cE5afa3");
    
    const encodedInitializeStakedAave = stakedAaveImpl.interface.encodeFunctionData('initialize', [
        STAKED_AAVE_NAME,
        STAKED_AAVE_SYMBOL,
        STAKED_AAVE_DECIMALS,
        ZERO_ADDRESS
    ]);

    console.log(encodedInitializeStakedAave);
    tx = await stakedAaveProxy.functions['initialize(address,address,bytes)'](
      "0x4a679490173ae9185282c21b0364f9c5f1950d95",
      "0x894c9101d5926932BF9174d5c0709DDe936ed4c6",
      encodedInitializeStakedAave
    );
    // receipt = await tx.wait(confirmations = 2);
    console.log("✅ Proxy initialized");
    console.log(`Gas used : ${receipt.gasUsed.toNumber()}`);
    console.log(`Initializer:  ${receipt.from}`);
    totalGasUsed = totalGasUsed + receipt.gasUsed.toNumber();

    console.log("👏 🏁🏁 DEPLOYMENT FINISHED");
    console.log(`Total gas used in deployment is : ${totalGasUsed}`);
  } catch (error) {
    console.log("❌ DEPLOYMENT FAILED ❌")
    // console.log(error);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });