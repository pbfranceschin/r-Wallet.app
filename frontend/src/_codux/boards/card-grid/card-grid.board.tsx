import { createBoard } from '@wixc3/react-board';
import { CardGrid } from '../../../components/card-grid/card-grid';

export default createBoard({
    name: 'CardGrid',
    Board: () => <CardGrid setIsNFTOpen={() => {}}/>,
    environmentProps: {
        canvasWidth: 664,
        windowWidth: 802,
    },
});
