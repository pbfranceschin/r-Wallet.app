import { useState } from 'react';
import { NFTGallery } from '../nft-gallery/nft-gallery';
import { ProfileSectionContainer } from '../profile-section-container/profile-section-container';
import styles from './profile-dashboard.module.scss';
import classNames from 'classnames';
import { log } from 'console';
import { NFTDialog } from '../nft-dialog/nft-dialog';

export interface ProfileDashboardProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileDashboard = ({ className }: ProfileDashboardProps) => {
  const [isNFTOpen, setIsNFTOpen] = useState(false);

  console.log('isNFTOpen is ', isNFTOpen);
  
  return (
    <div>
      {isNFTOpen && <NFTDialog setIsNFTOpen={setIsNFTOpen}/>}
      <div className={styles.layout}>
          <div className={styles.sidebar}>
            <ProfileSectionContainer />
          </div>
          <div className={styles.topbar}>
            <div className={styles['topbar-button']}>Explore</div>
          </div>
          <div className={styles.gallery}>
            <NFTGallery setIsNFTOpen={setIsNFTOpen}/>
          </div>
      </div>
    </div>
  );
};
