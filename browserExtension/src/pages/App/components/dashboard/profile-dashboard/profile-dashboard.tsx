import React from 'react';
import { useState } from 'react';
import { NFTGallery } from '../nft-gallery/nft-gallery';
import { ProfileSectionContainer } from '../profile-section-container/profile-section-container';
import styles from './profile-dashboard.module.scss';
import classNames from 'classnames';
import { log } from 'console';
import { NFTDialog } from '../nft-dialog/nft-dialog';
import { useBackgroundSelector } from '../../../hooks';
import { getActiveNetwork } from '../../../../Background/redux-slices/selectors/networkSelectors';
import { AccountData } from '../../../../Background/redux-slices/account';
import { getAccountEVMData } from '../../../../Background/redux-slices/selectors/accountSelectors';

export interface ProfileDashboardProps {
    className?: string;
    activeAccount?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ProfileDashboard = ({ className, activeAccount }: ProfileDashboardProps) => {
  const [isNFTOpen, setIsNFTOpen] = useState(false);
  const activeNetwork = useBackgroundSelector(getActiveNetwork);
  const address = activeAccount? activeAccount as string : '';
  const accountData: AccountData | 'loading' = useBackgroundSelector((state) =>
    getAccountEVMData(state, { address, chainId: activeNetwork.chainID })
  );

  console.log('isNFTOpen is ', isNFTOpen);
  
  return (
    <div>
      {isNFTOpen && <NFTDialog setIsNFTOpen={setIsNFTOpen}/>}
      <div className={styles.layout}>
          <div className={styles.sidebar}>
            <ProfileSectionContainer activeAccount={activeAccount}/>
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
