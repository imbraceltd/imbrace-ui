import styles from './index.module.scss';

export const VariantMapping = {
    Heading1: styles.heading1,
    Heading2: styles.heading2,
    SubHeading1: styles.subheading1,
    SubHeading2: styles.subheading2,
    SubHeading2Tight: `${styles.subheading2} ${styles.tight}`,
    SubHeading2Light: `${styles.subheading2} ${styles.light}`,
    Body: styles.body,
    BodyBold: `${styles.body} ${styles.bold}`,
    BodyTight: `${styles.body} ${styles.tight}`,
    Caption: styles.caption,
    CaptionBold: `${styles.caption} ${styles.bold}`,
    Inherit: styles.inherit,
};
