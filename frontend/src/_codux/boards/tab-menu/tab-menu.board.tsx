import { createBoard } from '@wixc3/react-board';
import { TabMenu } from '../../../components/tab-menu/tab-menu';

export default createBoard({
    name: 'TabMenu',
    Board: () => <TabMenu />
});
