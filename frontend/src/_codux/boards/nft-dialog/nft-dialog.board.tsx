import { createBoard } from '@wixc3/react-board';
import { NFTDialog } from '../../../components/nft-dialog/nft-dialog';

export default createBoard({
    name: 'NFTDialog',
    Board: () => <NFTDialog setIsNFTOpen={() => {}}/>
});
