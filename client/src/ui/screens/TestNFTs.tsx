import { useNFTs } from "@/hooks/useNFTs";
import { CreateNFT } from "../actions/CreateNFT";

const TestNFTs = () => {
  const { numberNft, tokenIds } = useNFTs();

  return (
    <div>
      <h1>NFTs</h1>
      {numberNft < 10 && <CreateNFT />}
      {tokenIds.map((tokenId) => (
        <div key={tokenId}>{tokenId}</div>
      ))}
    </div>
  );
};

export default TestNFTs;
