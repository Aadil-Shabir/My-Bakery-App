import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";

import Card from "../components/Card";
import Banner from "../components/Banner";

import { StoreContext, ACTION_TYPES } from "../store/store-context";
import { fetchBakeries } from "../lib/bakery-store";

import useTrackLocation from "../hooks/use-track-location";

export async function getStaticProps(context) {
  console.log("Hi GetStaticProps");

  const bakeries = await fetchBakeries();

  return {
    props: {
      bakeries,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFinding } =
    useTrackLocation();
  // const [bakeries, setBakeries] = useState([]);
  const [bakeriesErrors, setBakeriesErrors] = useState(null);
  const { dispatch, state } = useContext(StoreContext);

  const { bakeries, latLong } = state;

  console.log({ latLong, locationErrorMsg });

  const btnClickHandler = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    const fetchBakeriesClient = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getBakeriesByLocation?latLong=${latLong}&limit=30`
          );
          const bakeries = await response.json();
          console.log({ bakeries });
          // setBakeries(fetchedBakeries);
          dispatch({
            type: ACTION_TYPES.SET_BAKERIES,
            payload: { bakeries: bakeries },
          });
          setBakeriesErrors("");
        } catch (err) {
          console.log(err);
          setBakeriesErrors(err);
        }
      }
    };
    fetchBakeriesClient();
  }, [latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Sweets Maven</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFinding ? "Locating..." : "View shops nearby"}
          btnClickHandler={btnClickHandler}
        />
        {locationErrorMsg && (
          <p style={{ color: "red" }}>
            Something Went wrong: {locationErrorMsg}
          </p>
        )}
        {bakeriesErrors && (
          <p style={{ color: "red" }}>Something Went wrong: {bakeriesErrors}</p>
        )}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Hero-Image"
          />
        </div>

        {bakeries.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {bakeries.map((bakery) => {
                return (
                  <Card
                    name={bakery.name}
                    address={bakery.address}
                    imgUrl={
                      bakery.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/bakeries/${bakery.id}`}
                    key={bakery.id}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.bakeries.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Islamabad Stores</h2>
            <div className={styles.cardLayout}>
              {props.bakeries.map((bakery) => {
                return (
                  <Card
                    name={bakery.name}
                    address={bakery.address}
                    imgUrl={
                      bakery.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/bakeries/${bakery.id}`}
                    key={bakery.id}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
