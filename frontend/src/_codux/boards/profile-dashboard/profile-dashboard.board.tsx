import { createBoard } from '@wixc3/react-board';
import { ProfileDashboard } from '../../../components/profile-dashboard/profile-dashboard';

export default createBoard({
    name: 'ProfileDashboard',
    Board: () => <ProfileDashboard />,
    environmentProps: {
        canvasWidth: 1368,
        canvasHeight: 946,
        windowWidth: 1600,
        windowHeight: 992,
    },
});
