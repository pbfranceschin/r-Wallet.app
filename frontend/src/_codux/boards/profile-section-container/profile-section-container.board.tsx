import { createBoard } from '@wixc3/react-board';
import { ProfileSectionContainer } from '../../../components/profile-section-container/profile-section-container';

export default createBoard({
    name: 'ProfileSectionContainer',
    Board: () => <ProfileSectionContainer />,
    environmentProps: {
        canvasWidth: 333,
    },
});
