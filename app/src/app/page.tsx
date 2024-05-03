import type { Metadata, NextPage } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import styles from './Home.module.scss';
import { unify } from '~/lib/server/services';
import { md } from '~/lib/utils';

export const generateMetadata = async (): Promise<Metadata> => {
    const page = await unify.getHomePage()
        .catch(notFound);

    return {
        title: page.meta_title,
        description: page.meta_description
    };
};

const HomePage: NextPage = async () => {
    const page = await unify.getHomePage();

    return (
        <main>
            <section className='standalone-section'>
                <Image
                    className={styles.image}
                    src={page.image_url}
                    alt='Some image'
                    width={2000}
                    height={500}
                    priority
                />
            </section>
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
        </main>
    );
};

export default HomePage;
