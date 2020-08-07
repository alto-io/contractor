/* Contracts in this test */

const MyCollectible = artifacts.require("../contracts/MyCollectible.sol");

let _ = '        '

contract("MyCollectible", (accounts) => {
  const URI_BASE = 'https://creatures-api.opensea.io';
  const CONTRACT_URI = `${URI_BASE}/contract/opensea-erc1155`;
  let myCollectible;

  before(async () => {
    myCollectible = await MyCollectible.deployed();
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
