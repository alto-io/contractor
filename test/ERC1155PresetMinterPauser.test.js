var ERC1155PresetMinterPauser = artifacts.require('./ERC1155PresetMinterPauser.sol')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

contract('ERC1155PresetMinterPauser', accounts => {
    it("first account should have 0 balance", () =>
        ERC1155PresetMinterPauser.deployed()
        .then(instance => instance.balanceOf.call(accounts[0], 0))
        .then(balance => {
            assert.equal(
                balance.valueOf(),
                0,
                "first account had non-zero balance"
            )
        })
    )

    it("uri should return a string", () =>
        ERC1155PresetMinterPauser.deployed()
        .then(instance => instance.uri.call(0))
        .then(uri => {

            console.log(_ + "uri: " + uri);

            assert.notEqual(
                uri,
                "",
                "uri was empty"
            )
        })
    )

})