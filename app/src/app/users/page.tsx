import type { Metadata, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { unify } from '~/lib/server/services';
import { cutString, md } from '~/lib/utils';

import styles from './Users.module.scss';

export const generateMetadata = async (): Promise<Metadata> => {
	const page = await unify.getUsersPage()
		.catch(notFound);

	return {
		title: page.meta_title,
		description: page.meta_description
	};
};

const UsersPage: NextPage = async () => {
	const page = await unify.getUsersPage();
	const users = await unify.getUsers();

	return (
		<main>
			<section className='container'>
				<hgroup>
					<h1>
						{page.heading}
					</h1>
					<p>
						{page.subheading}
					</p>
				</hgroup>
				<div dangerouslySetInnerHTML={md(page.main_content)} />
			</section>
			<section className='container'>
				<ul className={styles.users}>
					{users.map((user) => (
						<Link
							key={user.username}
							className={styles.user}
							href={'/users/' + user.id}
						>
							<hgroup>
								<h2 className={styles.username}>
									{user.username}
								</h2>
								<p>
									{user.name}
								</p>
							</hgroup>

							<Image
								className={styles.picture}
								src={user.picture_url}
								alt='User profile picture'
								width={500}
								height={500}
							/>

							<div
								className={styles.bio}
								dangerouslySetInnerHTML={md(cutString(user.bio, 100))}
							/>

							<p className={styles.isCool}>
								{
									user.is_cool
										? (
											<>
												User is cool!
											</>
										)
										: (
											<>
												User is
												{' '}
												<b>
													not
												</b>
												{' '}
												cool!
											</>
										)
								}
							</p>
						</Link>
					))}
				</ul>
			</section>
		</main>
	);
};

export default UsersPage;
