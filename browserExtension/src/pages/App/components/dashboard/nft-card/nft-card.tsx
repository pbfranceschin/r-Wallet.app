import React, { useEffect, useState } from 'react';
import styles from './nft-card.module.scss';
import classNames from 'classnames';
import { useNFTtitle, useTokenImage, useLoans, useTokenMetaData, useMktPlaceAssets } from '../../../hooks/nfts';


export interface NFTCardProps {
    className?: string;
    contract?: string;
    id?: number;
    index?: number;
    propImage?: string;
    acctiveAccount: string | undefined;
    setIsNFTOpen: any;
    setIndex: any;
    setContract: any;
    setTokenId: any;
    context: string;
}

const onNFTCardClick = (
    contract: string | undefined,
    id: number | undefined,
    index: number | undefined,
    setIsNFTOpen: any,
    setIndex: any,
    setContract: any,
    setTokenId: any,
    context: string    
) => {
  setIsNFTOpen(true);
  if(context == 'owned') {
    if(!contract || !id) 
        console.log(
            'missing props'
        );
    setContract(contract);
    setTokenId(id);
  } else if(context == 'borrowed' || context == 'explore') {
    setIndex(index)
  } else throw new Error('missing context'); 
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTCard = ({
    className,
    contract,
    id, index,
    propImage,
    acctiveAccount,
    setIsNFTOpen,
    setIndex,
    setContract,
    setTokenId,
    context
}: NFTCardProps) => {
    const [image, setImage] = useState<string>();
    const [title, setTitle] = useState<string>();
    const [price, setPrice] = useState<number>();
    
    useEffect(() => {
        if(context=='owned'){
            if(contract && id) {
                setImage(useTokenImage(contract, id));
                setTitle(useNFTtitle(contract, id));
            } else console.log("missing props: 'contract' or 'id'");
        }
        else if(context == 'borrowed' || context == 'explore') {
            if(index) {
                let assets: any;
                let _contract: string;
                let _id: number;
                let _price: number | undefined;
                if(context=='borrowed') assets = useLoans(acctiveAccount);
                else if(context=='explore') {
                    assets = useMktPlaceAssets();
                    _price = assets[index]?.price;
                }
                else console.log('missing context');
                
                _contract = assets[index]?.contract_;
                _id = assets[index]?.id;
                const metadata = useTokenMetaData(_contract, _id);
                setTitle(metadata.title);
                setImage(metadata.image);
                setPrice(_price);
            } else console.log('missing props');
        } else console.log('missing context');
    });
    
    console.log('image', image);
    
    
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.card} onClick={() => onNFTCardClick(
                contract,
                id, index,
                setIsNFTOpen,
                setIndex,
                setContract,
                setTokenId,
                context
                )}>
                <div className={styles['container-card-image']}>
                    <div className={classNames(styles['card-image'], styles['image-cover-full'])}>
                        <img
                            height="100%"
                            width="100%"
                            src={image? image : propImage}
                            className={styles['image-cover']}
                        />
                    </div>
                </div>
                <div className={styles['card-description']}>
                    <h3 className={styles['card-title']}>{title}</h3>
                    {price && (
                      <div className={styles['card-price']}>
                        <p>{price} ETH </p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};
