const MyCollectible = artifacts.require("MyCollectible");
const MyLootBox = artifacts.require("MyLootBox");
const ERC721CryptoPizza = artifacts.require("ERC721CryptoPizza")

// Set to false if you only want the collectible to deploy
const ENABLE_LOOTBOX = true;
// Set if you want to create your own collectible
const NFT_ADDRESS_TO_USE = undefined; // e.g. Enjin: '0xfaafdc07907ff5120a76b34b731b278c38d6043c'
// If you want to set preminted token ids for specific classes
const TOKEN_ID_MAPPING = undefined; // { [key: number]: Array<[tokenId: string]> }

module.exports = function(deployer, network) {

  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress;
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  // get token uris
  const erc1155config = require('../temp_metadata/erc1155config.json');
  const tokenUri = erc1155config.gatewayUrl + "/" + erc1155config.metadataHash + "/{id}.json";
  console.log("tokenUri: " + tokenUri)

  deployer.then(async () => {
    let _ = "        ";    
    try {

        // Deploy CryptoPizza
        await deployer.deploy(ERC721CryptoPizza, tokenUri);
        let contract = await ERC721CryptoPizza.deployed();
        console.log(
          _ + "ERC721CryptoPizza deployed at: " + contract.address
        );
    } catch (error) {
      console.log(error);
    }
  });

  if (!ENABLE_LOOTBOX) {
    deployer.deploy(MyCollectible, proxyRegistryAddress,  {gas: 5000000});
  } else if (NFT_ADDRESS_TO_USE) {
    deployer.deploy(MyLootBox, proxyRegistryAddress, NFT_ADDRESS_TO_USE, {gas: 5000000})
      .then(setupLootbox);
  } else {
    deployer.deploy(MyCollectible, proxyRegistryAddress, {gas: 5000000})
      .then(() => {
        return deployer.deploy(MyLootBox, proxyRegistryAddress, MyCollectible.address, {gas: 5000000});
      })
      .then(setupLootbox);
  }
};

async function setupLootbox() {
  if (!NFT_ADDRESS_TO_USE) {
    const collectible = await MyCollectible.deployed();
    await collectible.transferOwnership(MyLootBox.address);
  }

  if (TOKEN_ID_MAPPING) {
    const lootbox = await MyLootBox.deployed();
    for (const rarity in TOKEN_ID_MAPPING) {
      console.log(`Setting token ids for rarity ${rarity}`);
      const tokenIds = TOKEN_ID_MAPPING[rarity];
      await lootbox.setTokenIdsForClass(rarity, tokenIds);
    }
  }
}
