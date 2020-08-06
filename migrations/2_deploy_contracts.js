var ERC1155PresetMinterPauser = artifacts.require("./ERC1155PresetMinterPauser.sol");

let _ = "        ";

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {

      const erc1155config = require('../temp_metadata/erc1155config.json');
      const tokenUri = erc1155config.gatewayUrl + "/" + erc1155config.metadataHash + "/{id}.json";
      console.log("tokenUri: " + tokenUri)

      // Deploy GameItems.sol
      await deployer.deploy(ERC1155PresetMinterPauser, tokenUri);
      let contract = await ERC1155PresetMinterPauser.deployed();
      console.log(
        _ + "ERC1155PresetMinterPauser deployed at: " + contract.address
      );

    } catch (error) {
      console.log(error);
    }
  });
};
