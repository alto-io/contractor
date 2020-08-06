const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const recursive = require('recursive-fs');
const basePathConverter = require('base-path-converter');
const path = require('path');
const rimraf = require('rimraf');

require('dotenv').config()

const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

// deploy images first to get the ipfs hash
startDeploy = () => {
    const images_dir = './erc1155/images';

    //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(images_dir, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(images_dir, file)
            })
        });

        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
                }
            }
        ).then(function (response) {
            //handle response here
            deployMetadata(response.data.IpfsHash);

        }).catch(function (error) {
            //handle error here
            console.log("Error ---");
            console.log(error);
        });
    });    
};

// deploy erc1155 formatted json data to an ipfs directory
deployMetadata = (images_hash) => {
    const metadata_file = '../erc1155/metadata.json';
    const gateway_url = "https://gateway.pinata.cloud/ipfs/" + images_hash;
    const temp_metadata_dir = './temp_metadata';

    // delete all files in temp_metadata_dir
    rimraf.sync(temp_metadata_dir);

    // recreate directory
    fs.mkdirSync(temp_metadata_dir, { recursive: true });

    let jsonData = require(metadata_file).metadata;
  
    // upload each metadata to a specific json file
    jsonData.forEach( (metadata) => {
        // replace image url with link on ipfs gateway
        metadata.image = gateway_url + "/" + metadata.image;

        const filename = temp_metadata_dir +"/" + metadata.id + ".json";
        const st = JSON.stringify(metadata, null, 2);
        fs.writeFileSync(filename, st);
    });

   //we gather the files from a local directory in this example, but a valid readStream is all that's needed for each file in the directory.
    recursive.readdirr(temp_metadata_dir, function (err, dirs, files) {
        let data = new FormData();
        files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append(`file`, fs.createReadStream(file), {
                filepath: basePathConverter(temp_metadata_dir, file)
            })
        });

        return axios.post(url,
            data,
            {
                maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large directories
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    'pinata_api_key': process.env.PINATA_API_KEY,
                    'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
                }
            }
        ).then(function (response) {
            //handle response here
            saveConfigFile(response.data.IpfsHash);

        }).catch(function (error) {
            //handle error here
            console.log("Error ---");
            console.log(error);
        });
    }); 


}

saveConfigFile = (metadata_hash) => {
    const config_file = "./temp_metadata/erc1155config.json";
    const metadata_config = {
        "metadataHash": metadata_hash
    }

    const st = JSON.stringify(metadata_config, null, 2);
    fs.writeFileSync(config_file, st);    
}

startDeploy();