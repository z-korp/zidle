require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.error('Error: Pinata API credentials not found in .env file');
  process.exit(1);
}

const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);

async function uploadToIPFS() {
  try {
    // Upload image first
    console.log('Uploading image...');
    const imagesResult = await pinata.pinFromFS('./nft-collection/images');
    console.log('Image uploaded! CID:', imagesResult.IpfsHash);

    // Create metadata with correct format
    const metadata = {
      name: 'zKube Game',
      description: 'A zKube Game NFT',
      external_url: 'https://app.zkube.xyz',
      image: `ipfs://${imagesResult.IpfsHash}/nft.png`,
      attributes: [
        {
          trait_type: 'Type',
          value: 'Game',
        },
      ],
    };

    // Test metadata URL formation
    console.log('\nTesting IPFS gateway URLs:');
    console.log(
      'Image (via gateway):',
      `https://ipfs.io/ipfs/${imagesResult.IpfsHash}/nft.png`
    );
    console.log(
      'Image (via Pinata):',
      `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/nft.png`
    );

    // Write updated metadata file
    if (!fs.existsSync('./nft-collection/metadata')) {
      fs.mkdirSync('./nft-collection/metadata');
    }

    fs.writeFileSync(
      './nft-collection/metadata/metadata.json',
      JSON.stringify(metadata, null, 2)
    );

    // Upload metadata
    console.log('\nUploading metadata...');
    const metadataResult = await pinata.pinFromFS('./nft-collection/metadata');
    console.log('Metadata uploaded! CID:', metadataResult.IpfsHash);

    // Save deployment info
    const deployInfo = {
      imageCID: imagesResult.IpfsHash,
      metadataCID: metadataResult.IpfsHash,
      timestamp: new Date().toISOString(),
      urls: {
        image: `ipfs://${imagesResult.IpfsHash}/nft.png`,
        metadata: `ipfs://${metadataResult.IpfsHash}/metadata.json`,
        imageGateway: `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/nft.png`,
        metadataGateway: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}/metadata.json`,
      },
    };

    fs.writeFileSync('deploy-info.json', JSON.stringify(deployInfo, null, 2));

    // Print verification instructions
    console.log('\nVerification URLs (try these in your browser):');
    console.log(
      'Image:',
      `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/nft.png`
    );
    console.log(
      'Metadata:',
      `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}/metadata.json`
    );

    console.log('\nDeployment info saved to deploy-info.json');
    console.log('\nIMPORTANT: Verify these steps:');
    console.log(
      '1. Open the image URL in your browser - it should display correctly'
    );
    console.log(
      '2. Open the metadata URL - it should show valid JSON with all fields'
    );
    console.log(
      '3. The "image" field in metadata should match the IPFS image URL exactly'
    );
  } catch (error) {
    console.error('Error during upload:', error.message);
  }
}

uploadToIPFS();
