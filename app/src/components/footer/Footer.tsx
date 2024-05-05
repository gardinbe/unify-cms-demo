import type { FC } from 'react';

import styles from './Footer.module.scss';

/**
 * The page footer.
 */
export const Footer: FC = () => {
	return (
		<footer className={styles.footer}>
			Unify CMS demo website. Created by Ben Gardiner.
		</footer>
	);
};
