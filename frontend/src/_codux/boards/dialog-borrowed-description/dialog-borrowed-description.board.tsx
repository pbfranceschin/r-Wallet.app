import { createBoard } from '@wixc3/react-board';
import { DialogBorrowedDescription } from '../../../components/dialog-borrowed-description/dialog-borrowed-description';

export default createBoard({
    name: 'DialogBorrowedDescription',
    Board: () => <DialogBorrowedDescription />
});
