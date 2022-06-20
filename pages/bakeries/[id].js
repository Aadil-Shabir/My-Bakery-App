import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/bakery.module.css";

import bakeriesData from "../../data/bakeries.json";
import Head from "next/head";
import Image from "next/image";

import cls from "classnames";

export function getStaticProps(statisProps) {
  const params = statisProps.params;
  console.log("params", params);
  return {
    props: {
      bakeries: bakeriesData.find((bakery) => {
        return bakery.id.toString() === params.id;
      }),
    },
  };
}

export function getStaticPaths() {
  const paths = bakeriesData.map((bakery) => {
    return {
      params: {
        id: bakery.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
}

const Bakeries = (props) => {
  const router = useRouter();
  console.log("props", props);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvote = () => {
    console.log("handle Upvote");
  };

  const { address, name, neighbourhood, imgUrl } = props.bakeries;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt={name}
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width="24"
              height="24"
              alt={name}
            />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt={name}
            />
            <p className={styles.text}>1</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvote}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bakeries;
