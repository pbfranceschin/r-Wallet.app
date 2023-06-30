import React, { useEffect, useState } from 'react';
import styles from './dialog-borrowed-description.module.scss';
import classNames from 'classnames';
import { useProvider } from 'wagmi';
import ReleaseAsset from '../../wallet';
import { getNFTobj, useNFTname, useNFTtitle } from '../../../hooks/nfts';

export interface DialogBorrowedDescriptionProps {
    className?: string;
    index?: number;
    activeAccount?: string;
    context: string;
}

let nft: any;
let _title: string | undefined;
let _name: string | undefined;


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogBorrowedDescription = ({ className, index, activeAccount, context }: DialogBorrowedDescriptionProps) => {
  const provider = useProvider();
  const [timeLeft, setTimeLeft] = useState<number>();
  const [title, setTitle] = useState<string>();
  const [name, setName] =  useState<string>();
  const [endTime, setEndTime] = useState<number>();
  
  nft = getNFTobj(context, activeAccount, index);
  _title = useNFTtitle(nft.contract_ , nft.id);
  _name = useNFTname(nft.contract_ , nft.id);

  useEffect(() => {
    setTitle(_title);
    setName(_name);
    setEndTime(nft.endTime);
  }, [_name, _title, nft]);

  useEffect(() => {
    if(!endTime) return
    provider.getBlock('latest').then((b) => setTimeLeft(endTime - b.timestamp));
  }, [endTime]);
  
  // const timeLeft = 2;

    return (
      <div className={styles['description-container']}>
        <h1 className={styles.title}>{title}</h1>
        <h1 className={styles.description}>{name}</h1>
        <div className={styles['body-description-container']}>
          <div className={styles.divider}></div>
          <h2 className={styles['body-description']}>This NFT is loaned to you. The rental period expires in {timeLeft} days.</h2>
        </div>
        <ReleaseAsset index={index} />
      </div>
    );
};
