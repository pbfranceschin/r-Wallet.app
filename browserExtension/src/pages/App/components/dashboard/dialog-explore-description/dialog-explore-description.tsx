import React, { useEffect } from 'react';
import styles from './dialog-explore-description.module.scss';
import classNames from 'classnames';
// import { Borrow } from '../../mktPlace';
import { useState } from 'react';
import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';


export interface DialogExploreDescriptionProps {
    className?: string;
    index?: number;
    activeAccount: string;
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogExploreDescription = ({ className, index, activeAccount }: DialogExploreDescriptionProps) => {
    const [duration, setDuration] = useState<number>();
    // const [title, setTitle] = useState<string>();
    // const [name, setName] = useState<string>();
    // const [price, setPrice] = useState<string>();
    
    nft = getNFTobj("explore", activeAccount, index);
    _title = useNFTtitle(nft.contract_ , nft.id);
    _name = useNFTname(nft.contract_ , nft.id);
    
    // useEffect(() => {
    //     setTitle(_title);
    //     setName(_name);

    // });
    return (
        <div className={styles['description-container']}>
            <h1 className={styles.title}>{_title}</h1>
            <h1 className={styles.description}>{_name}</h1>
            <h1 className={styles.description}>Max Loan Period:{nft.maxDuration}</h1>
            <div className={styles['body-description-container']}>
                <div className={styles.divider}></div>
                <h2 className={styles['body-description']}>Borrow this NFT!</h2>
                <h3 className={styles['price-description']}>
                    Price: <span className={styles['price-currency']}>{nft.price} ETH/day</span>
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
                    {/* <Borrow
                    lender={lender}
                    index={index}
                    duration={duration}
                    price={price}
                    /> */}
                </div>
            </div>
        </div>
    );
};
