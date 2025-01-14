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

async function uploadImages() {
  try {
    // First upload images folder
    console.log('Uploading images...');
    const imagesResult = await pinata.pinFromFS('./nft-collection/images');
    console.log('Images uploaded successfully!');
    console.log('Images CID:', imagesResult.IpfsHash);

    // Now create metadata JSON files with correct image URLs
    const metadata = {
      collection: {
        name: 'zKube Credits Collection',
        description: 'zKube Credit NFTs - Public and Airdropped variants',
        image: `ipfs://${imagesResult.IpfsHash}/collection.png`,
      },
      public: {
        name: 'zKube Credit - Public',
        description: 'A publicly minted zKube Credit NFT',
        image: `ipfs://${imagesResult.IpfsHash}/public.png`,
        attributes: [
          {
            trait_type: 'Mint Type',
            value: 'Public',
          },
        ],
      },
      airdrop: {
        name: 'zKube Credit - Airdropped',
        description: 'An airdropped zKube Credit NFT',
        image: `ipfs://${imagesResult.IpfsHash}/airdrop.png`,
        attributes: [
          {
            trait_type: 'Mint Type',
            value: 'Airdropped',
          },
        ],
      },
    };

    // Create metadata directory if it doesn't exist
    if (!fs.existsSync('./nft-collection/metadata')) {
      fs.mkdirSync('./nft-collection/metadata');
    }

    // Write metadata files with correct IPFS links
    fs.writeFileSync(
      './nft-collection/metadata/collection.json',
      JSON.stringify(metadata.collection, null, 2)
    );
    fs.writeFileSync(
      './nft-collection/metadata/public.json',
      JSON.stringify(metadata.public, null, 2)
    );
    fs.writeFileSync(
      './nft-collection/metadata/airdrop.json',
      JSON.stringify(metadata.airdrop, null, 2)
    );

    // Upload metadata folder
    console.log('\nUploading metadata...');
    const metadataResult = await pinata.pinFromFS('./nft-collection/metadata');
    console.log('Metadata uploaded successfully!');
    console.log('Metadata CID:', metadataResult.IpfsHash);

    // Print all relevant URLs for verification
    console.log('\nVerification URLs:');
    console.log(
      'Collection Image:',
      `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/collection.png`
    );
    console.log(
      'Public Image:',
      `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/public.png`
    );
    console.log(
      'Airdrop Image:',
      `https://gateway.pinata.cloud/ipfs/${imagesResult.IpfsHash}/airdrop.png`
    );
    console.log('\nMetadata URLs:');
    console.log(
      'Collection Metadata:',
      `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}/collection.json`
    );
    console.log(
      'Public Metadata:',
      `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}/public.json`
    );
    console.log(
      'Airdrop Metadata:',
      `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}/airdrop.json`
    );

    // Save deployment info
    const deployInfo = {
      imagesCID: imagesResult.IpfsHash,
      metadataCID: metadataResult.IpfsHash,
      timestamp: new Date().toISOString(),
      urls: {
        images: {
          collection: `ipfs://${imagesResult.IpfsHash}/collection.png`,
          public: `ipfs://${imagesResult.IpfsHash}/public.png`,
          airdrop: `ipfs://${imagesResult.IpfsHash}/airdrop.png`,
        },
        metadata: {
          collection: `ipfs://${metadataResult.IpfsHash}/collection.json`,
          public: `ipfs://${metadataResult.IpfsHash}/public.json`,
          airdrop: `ipfs://${metadataResult.IpfsHash}/airdrop.json`,
        },
      },
    };

    fs.writeFileSync('deploy-info.json', JSON.stringify(deployInfo, null, 2));
    console.log('\nDeployment info saved to deploy-info.json');
  } catch (error) {
    console.error('Error during upload:', error.message);
  }
}

// Run the upload
uploadImages();
