import { createBoard } from '@wixc3/react-board';
import { TabItem } from '../../../components/tab-item/tab-item';

export default createBoard({
    name: 'TabItem',
    Board: () => <TabItem name="Rent"/>
});
