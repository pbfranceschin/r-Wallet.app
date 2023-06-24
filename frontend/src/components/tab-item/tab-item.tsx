import styles from './tab-item.module.scss';
import classNames from 'classnames';

export interface TabItemProps {
    className?: string;
    name: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const TabItem = ({ className, name }: TabItemProps) => {
    return (
        <span className={styles['tab-item-button']}>
            <div className={styles['tab-item-container']}>
                <div className={styles['tab-item-name']}>{name}</div>
                {/* <div class="FamilyLabel__SelectedArrowWrapper-sc-c8bv9e-4 eDBAPo">
            1
          </div> */}
            </div>
        </span>
    );
};
