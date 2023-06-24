import { createBoard } from '@wixc3/react-board';
import { DialogOwnedDescription } from '../../../components/dialog-owned-description/dialog-owned-description';

export default createBoard({
    name: 'DialogOwnedDescription',
    Board: () => <DialogOwnedDescription />
});
