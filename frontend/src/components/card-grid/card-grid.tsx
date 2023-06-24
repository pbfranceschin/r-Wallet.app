import styles from './card-grid.module.scss';
import classNames from 'classnames';
import { NFTCard } from '../nft-card/nft-card';

export interface CardGridProps {
    className?: string;
    setIsNFTOpen: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const CardGrid = ({ className, setIsNFTOpen }: CardGridProps) => {
    return (
            <div className={styles['card-grid-container']}>
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    title="NFT Title1"
                    // price={0.001}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    title="NFT Title2"
                    // price={0.001}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
                    title="NFT Title3"
                    // price={0.003}
                    setIsNFTOpen={setIsNFTOpen}
                />
                <NFTCard
                    image="https://wixplosives.github.io/codux-assets-storage/add-panel/image-placeholder.jpg"
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
