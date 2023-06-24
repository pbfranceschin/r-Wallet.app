import { createBoard } from '@wixc3/react-board';
import { PayRent } from '../../../components/pay-rent/pay-rent';

export default createBoard({
    name: 'PayRent',
    Board: () => <PayRent />
});
