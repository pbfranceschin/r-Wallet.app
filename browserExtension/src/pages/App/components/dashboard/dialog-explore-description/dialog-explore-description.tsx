import React from 'react';
import styles from './dialog-explore-description.module.scss';
import classNames from 'classnames';

export interface DialogExploreDescriptionProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogExploreDescription = ({ className }: DialogExploreDescriptionProps) => {
    return (
        <div className={styles['description-container']}>
            <h1 className={styles.title}>DeGod #7709</h1>
            <div className={styles['body-description-container']}>
                <div className={styles.divider}></div>
                <h2 className={styles['body-description']}>Borrow this NFT!</h2>
                <h3 className={styles['price-description']}>
                    Price: <span className={styles['price-currency']}>1 ETH/day</span>
                </h3>
                <div>
                    <div className={styles['price-input-container']}>
                        <input className={styles['price-input']} placeholder="0" />
                        <div>
                            <span className={styles.eth}>Days</span>
                        </div>
                    </div>
                </div>
                <div className={styles['rent-button-container']}>
                    <div className={styles['rent-button-wrapper']}>
                        <div className={styles['rent-button']}>Give it to me</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
