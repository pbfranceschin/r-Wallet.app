import { createBoard } from '@wixc3/react-board';
import { NFTGallery } from '../../../components/nft-gallery/nft-gallery';

export default createBoard({
    name: 'NFTGallery',
    Board: () => <NFTGallery setIsNFTOpen={() => {}}/>
});
