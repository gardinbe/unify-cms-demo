'use client';

import type { CSSProperties, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { IoMdMore } from 'react-icons/io';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.scss';

/**
 * The navbar.
 */
export const Nav: FC = () => {
	const pathname = usePathname();

	const nav = useRef<HTMLElement>(null);
	const [navHeight, setNavHeight] = useState<number | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);

	const openMenu = () => {
		document.body.style.overflow = 'hidden';
		setNavHeight(nav.current!.clientHeight);
		setMenuOpen(true);
	};

	const closeMenu = () => {
		document.body.style.overflow = '';
		setMenuOpen(false);
	};

	const toggleMenu = () => {
		menuOpen
			? closeMenu()
			: openMenu();
	};

	useEffect(closeMenu, [pathname]); //close when navigating using the forward/back buttons

	useEffect(() => closeMenu, []); //close when component is destroyed

	return (
		<nav
			ref={nav}
			className={styles.navbar}
			data-open={menuOpen}
			style={{
				'--nav-height': navHeight !== null
					? `${navHeight}px`
					: undefined
			} as CSSProperties}
		>
			<IoMdMore
				className={styles.menuIcon}
				aria-label='Toggle the navigation menu'
				onClick={toggleMenu}
			/>
			<menu className={styles.menu}>
				<Link
					href='/'
					aria-label='View the home page'
					onClick={closeMenu}
				>
					Home
				</Link>
				<Link
					href='/users'
					aria-label='View the users page'
					onClick={closeMenu}
				>
					Users
				</Link>
			</menu>
		</nav>
	);
};
