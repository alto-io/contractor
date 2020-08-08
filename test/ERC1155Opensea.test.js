/* Contracts in this test */

const ERC1155Opensea = artifacts.require("../contracts/ERC1155Opensea.sol");
const contractDetails = require('../temp_metadata/contracturi.json');
const contractConfig = require('../temp_metadata/erc1155config.json');
let _ = '        '

contract("ERC1155Opensea", (accounts) => {
  const CONTRACT_URI = contractConfig.gatewayUrl + "/" + contractConfig.contractUriHash  

  let myCollectible;

  before(async () => {
    myCollectible = await ERC1155Opensea.deployed();
  });

  // This is all we test for now

  // This also tests contractURI()

  describe('#constructor()', () => {
    it('should set the contractURI to the supplied value', async () => {
        let uri = await myCollectible.contractURI();
        console.log(_ + "uri: " + uri)
      assert.equal(uri, CONTRACT_URI);
    });
  });
});
