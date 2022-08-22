import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/bakery.module.css";

import bakeriesData from "../../data/bakeries.json";
import { fetchBakeries } from "../../lib/bakery-store";
import Head from "next/head";
import Image from "next/image";

import cls from "classnames";

export async function getStaticProps(statisProps) {
  const params = statisProps.params;
  console.log("params", params);
  const bakeries = await fetchBakeries();
  const bakeryById = bakeries.find((bakery) => {
    return bakery.id.toString() === params.id;
  });
  return {
    props: {
      bakeries: bakeryById ? bakeryById : {},
    },
  };
}

export async function getStaticPaths() {
  const bakeries = await fetchBakeries();
  const paths = bakeries.map((bakery) => {
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

  const { name, address, locality, imgUrl } = props.bakeries;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>◄ Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            width={600}
            height={360}
            alt={name}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt={name}
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {locality && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt={name}
              />
              <p className={styles.text}>{locality}</p>
            </div>
          )}

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
