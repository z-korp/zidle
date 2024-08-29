import { useNFTs } from "@/hooks/useNFTs";
import { CreateNFT } from "../actions/CreateNFT";
import NFT from "../components/NFT";
import useAccountCustom from "@/hooks/useAccountCustom";

const TestNFTs = () => {
  const { account } = useAccountCustom();
  const { numberNft, tokenIds } = useNFTs(account?.address);

  return (
    <div>
      <h1>NFTs</h1>
      {numberNft < 10 && <CreateNFT />}
      {tokenIds.map((tokenId) => (
        <NFT tokenId={tokenId.toString()} />
      ))}
    </div>
  );
};

export default TestNFTs;
