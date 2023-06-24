 import { createBoard } from '@wixc3/react-board';
import { NFTCard } from '../../../components/nft-card/nft-card';

export default createBoard({
    name: 'NFTCard',
    Board: () => (
      <NFTCard
          image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
          title="NFT Title"
          price={0.001}
          setIsNFTOpen={() => {}}
      />
    ),
    environmentProps: {
        canvasWidth: 283,
    },
});
