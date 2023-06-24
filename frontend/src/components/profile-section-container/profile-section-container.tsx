import { ProfileHeader } from '../profile-header/profile-header';
import { TabMenu } from '../tab-menu/tab-menu';
import styles from './profile-section-container.module.scss';
import classNames from 'classnames';

export interface ProfileSectionContainerProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileSectionContainer = ({ className }: ProfileSectionContainerProps) => {
    return (
        <div className={styles['profile-section-container']}>
            <ProfileHeader />
            <TabMenu />
        </div>
    );
};
