import styles from './dialog-borrowed-description.module.scss';
import classNames from 'classnames';

export interface DialogBorrowedDescriptionProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const DialogBorrowedDescription = ({ className }: DialogBorrowedDescriptionProps) => {
    const timeLeft = 2;

    return (
      <div className={styles['description-container']}>
        <h1 className={styles.title}>DeGod #7709</h1>
        <div className={styles['body-description-container']}>
          <div className={styles.divider}></div>
          <h2 className={styles['body-description']}>This NFT is loaned to you. The rental period expires in {timeLeft} days.</h2>
        </div>
      </div>
    );
};
