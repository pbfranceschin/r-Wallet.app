import React from 'react';
import styles from './dialog-explore-description.module.scss';
import classNames from 'classnames';
import { Borrow } from '../../mktPlace';
import { useState } from 'react';


export interface DialogExploreDescriptionProps {
    className?: string;
    price?: number;
    title: string;
    lender?: string;
    index?: number;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogExploreDescription = ({ className, price, title, lender, index }: DialogExploreDescriptionProps) => {
    const [duration, setDuration] = useState<number>();
    const feeBase = 1000;
    const feeMul = 3;
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
                        <input 
                        className={styles['price-input']}
                        placeholder="0"
                        type='number'
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        />
                        <div>
                            <span className={styles.eth}>Days</span>
                        </div>
                    </div>
                </div>
                <div className={styles['rent-button-container']}>
                    {/* <div className={styles['rent-button-wrapper']}>
                        <div className={styles['rent-button']}>Give it to me</div>
                    </div> */}
                    <Borrow
                    lender={lender}
                    index={index}
                    duration={duration}
                    price={price}
                    />
                </div>
            </div>
        </div>
    );
};
