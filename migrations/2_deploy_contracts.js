var ERC1155PresetMinterPauser = artifacts.require("./ERC1155PresetMinterPauser.sol");

let _ = "        ";

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {

      // Deploy GameItems.sol
      await deployer.deploy(ERC1155PresetMinterPauser, "test");
      let contract = await ERC1155PresetMinterPauser.deployed();
      console.log(
        _ + "ERC1155PresetMinterPauser deployed at: " + contract.address
      );

    } catch (error) {
      console.log(error);
    }
  });
};
