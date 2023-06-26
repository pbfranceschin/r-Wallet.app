import React from 'react';
import styles from './card-grid.module.scss';
import classNames from 'classnames';
import { NFTCard } from '../nft-card/nft-card';
import { useAccountTokens, useTokenImage } from '../../../hooks/nfts';
import { useBackgroundSelector } from '../../../hooks';
import { getActiveAccount } from '../../../../Background/redux-slices/selectors/accountSelectors';


export interface CardGridProps {
    className?: string;
    setIsNFTOpen: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CardGrid = ({ className, setIsNFTOpen }: CardGridProps) => {
    const activeAccount = useBackgroundSelector(getActiveAccount);
    const tokens = useAccountTokens(activeAccount? activeAccount : '');
    let images: string[];
    // tokens.map((t,i) => {
    //     images[i] = useTokenImage(t);
    // });
    return (
            // tokens.map((t,i) => {
                

            //     return (
            //         <div className={styles['card-grid-container']}>
            //             <NFTCard
            //             image={images[i]}
            //             title="NFT Title1"
            //             // price={0.001}
            //             setIsNFTOpen={setIsNFTOpen}
            //             />     
            //         </div>     
            //     )

            // })
            <div className={styles['card-grid-container']}>
                <NFTCard
                    // image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    id={0}
                    title="NFT Title1"
                    price={0.001}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    id={1}
                    title="NFT Title2"
                    // price={0.001}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    id={2}
                    title="NFT Title3"
                    // price={0.003}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    id={3}
                    title="NFT Title4"
                    // price={0.004}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    title="NFT Title5"
                    // price={0.005}
                    setIsNFTOpen={setIsNFTOpen}
                />
            </div>
    );
};
