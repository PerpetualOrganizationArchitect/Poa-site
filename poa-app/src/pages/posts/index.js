import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text } from '@chakra-ui/react';

export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <ul>
            {allPostsData.map(({ id}) => (
                <li key={id}>
                    <Link href={`/posts/${id}`}>
                        <Text>{id}</Text>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export async function getStaticProps() {
    const allPostsData = await getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}
