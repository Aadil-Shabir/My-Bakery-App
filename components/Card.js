import Link from "next/link";
import Image from "next/image";
import cls from "classnames"

import styles from "./Card.module.css";

const Card = (props) => {

const wordReducer = (val) => {
  const threeDots = "...";
  const trimmedValue = val.substring(0, 24);
  if (val.length > 24) {
    return trimmedValue + threeDots;
  }
  return val;
};

return (
  <Link href={props.href}>
    <a className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>
          <h5>{wordReducer(props.address)}</h5>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image
            className={styles.cardImage}
            src={props.imgUrl}
            width={260}
            height={160}
            alt={props.name}
          />
        </div>
      </div>
    </a>
  </Link>
);
};

export default Card;
