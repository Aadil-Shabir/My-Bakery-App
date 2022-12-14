import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import styles from "../../styles/bakery.module.css";

import { fetchBakeries } from "../../lib/bakery-store";
import Head from "next/head";
import Image from "next/image";

import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

import cls from "classnames";

export async function getStaticProps(statisProps) {
  const params = statisProps.params;
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

const Bakeries = (initialProps) => {
  const {
    state: { bakeries },
  } = useContext(StoreContext);
  const router = useRouter();
  const [bakery, setBakery] = useState(initialProps.bakeries || {});
  const [votingCount, setVotingCount] = useState(0);
  const id = router.query.id;
  const { data, error } = useSWR(`/api/getBakeryById?id=${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setBakery(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleCreateBakery = async (selectedBakery) => {
    try {
      const { id, name, address, neighborhood, locality, voting, imgUrl } =
        selectedBakery;
      const response = await fetch("/api/createBakery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address: address || "",
          neighborhood: neighborhood || "",
          locality,
          voting: 0,
          imgURL: imgUrl,
        }),
      });

      const dbBakery = await response.json();
    } catch (err) {
      console.error("Error Creating Coffee Store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.bakeries)) {
      if (bakeries.length > 0) {
        const findBakeryById = bakeries.find((bakery) => {
          return bakery.id.toString() === id;
        });
        if (findBakeryById) {
          setBakery(findBakeryById);
          handleCreateBakery(findBakeryById);
        }
      }
    } else {
      // SSG
      handleCreateBakery(initialProps.bakeries);
    }
  }, [id, initialProps, initialProps.bakeries]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvote = async () => {
    try {
      const response = await fetch("/api/upvoteBakeryById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbBakery = await response.json();
      if (dbBakery && dbBakery.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error Upvoting Bakery", err);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving Bakery Page</div>;
  }

  const { name, address, locality, imgUrl } = bakery;

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>??? Back to Home</a>
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
            <p className={styles.text}>{votingCount}</p>
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
