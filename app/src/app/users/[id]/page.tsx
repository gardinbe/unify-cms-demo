import type { Metadata, NextPage } from 'next';
import Image from 'next/image';
import styles from './User.module.scss';
import { unify } from '~/lib/server/services';
import { md, createClass } from '~/lib/utils';

interface Props {
	params: { id: string; };
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
	const { id } = props.params;
	const user = await unify.getUser(id);

	return {
		title: user.username
	};
};

const UserPage: NextPage<Props> = async props => {
	const { id } = props.params;
	const user = await unify.getUser(id);

	return (
		<main className='container'>
			<section className='split-section'>
				<Image
					className={createClass(
						'split-section__image',
						styles.picture
					)}
					src={user.picture_url}
					alt='User profile picture'
					width={500}
					height={500}
				/>

				<div className='split-section__content'>
					<hgroup>
						<h1>
							{user.username}
						</h1>
						<p className={styles.name}>
							{user.name}
						</p>
					</hgroup>

					<div
						dangerouslySetInnerHTML={md(user.bio)}
					/>

					<p className={styles.isCool}>
						{user.is_cool
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
				</div>
			</section>
		</main>
	);
};

export default UserPage;
