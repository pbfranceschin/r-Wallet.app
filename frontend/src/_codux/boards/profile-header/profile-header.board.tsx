import { createBoard } from '@wixc3/react-board';
import { ProfileHeader } from '../../../components/profile-header/profile-header';

export default createBoard({
    name: 'ProfileHeader',
    Board: () => <ProfileHeader />,
    environmentProps: {
        canvasWidth: 309,
        canvasHeight: 330,
    },
});
