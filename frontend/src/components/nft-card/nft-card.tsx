import styles from './nft-card.module.scss';
import classNames from 'classnames';

export interface NFTCardProps {
    className?: string;
    image: string;
    title: string;
    price?: number;
    setIsNFTOpen: any
}

const onNFTCardClick = (setIsNFTOpen: any) => {
  setIsNFTOpen(true);
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NFTCard = ({ className, image, title, price, setIsNFTOpen }: NFTCardProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.card} onClick={() => onNFTCardClick(setIsNFTOpen)}>
                <div className={styles['container-card-image']}>
                    <div className={classNames(styles['card-image'], styles['image-cover-full'])}>
                        <img
                            height="100%"
                            width="100%"
                            src={image}
                            className={styles['image-cover']}
                        />
                    </div>
                </div>
                <div className={styles['card-description']}>
                    <h3 className={styles['card-title']}>{title}</h3>
                    {price && (
                      <div className={styles['card-price']}>
                        <p>{price} ETH/min</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};
