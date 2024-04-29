import { getAllPostIds, getPostData } from '../../util/posts';

export default function Post({ postData }) {
    if (!postData) {
        console.log("No post data available");
        return <p>No Post Found</p>;
    }

    console.log("check", postData);
    return (
        <div>
            <h1>{postData.id}</h1>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
    );
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);
    console.log("postData", postData);  // Ensure data is correct here
    return {
        props: {
            postData,
        },
    };
}
