import { createBoard } from '@wixc3/react-board';
import { TabItemSelected } from '../../../components/tab-item-selected/tab-item-selected';

export default createBoard({
    name: 'TabItemSelected',
    Board: () => <TabItemSelected name="Owned"/>,
});
