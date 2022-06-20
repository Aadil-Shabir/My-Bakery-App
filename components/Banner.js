import styles from "./Banner.module.css";

const Banner = (props) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}><span className={styles.title1}>Sweets</span> <span className={styles.title2}>Maven</span></h1>
            <p className={styles.subTitle}>Discover your local Bakeries!</p>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={props.btnClickHandler}>{props.buttonText}</button>
            </div>
        </div>
    )
}

export default Banner;