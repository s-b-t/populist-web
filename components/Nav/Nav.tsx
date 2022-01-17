import styles from "./Nav.module.scss";
import PopulistLogo from "../../public/images/PopulistLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useState } from "react";
import useDeviceInfo from "../../hooks/useDeviceInfo";

export default function Nav({
  mobileNavTitle = "Colorado Legislators",
}: {
  mobileNavTitle?: string;
}) {
  const { pathname } = useRouter();

  const [sticky, setSticky] = useState<boolean>(true);

  const { isMobile } = useDeviceInfo();

  useScrollPosition(
    ({
      prevPos,
      currPos,
    }: {
      prevPos: { y: number };
      currPos: { y: number };
    }) => {
      if (!isMobile) return;
      // hack because safari thinks its cool to have a bouncy effect and allow scroll position to exceed 0
      let prevPosY = prevPos.y;
      if (prevPosY > 0) {
        prevPosY = 0;
      }
      const isShow = currPos.y >= prevPosY;
      if (isShow !== sticky) setSticky(isShow);
    },
    [sticky]
  );

  return (
    <nav className={`${styles.nav} ${sticky ? styles.sticky : ""}`}>
      <div className={styles.navContent}>
        <div className={styles.logoContainer}>
          <Image
            src={PopulistLogo}
            alt="Populist"
            layout="responsive"
            objectFit="contain"
          />
        </div>
        <h5 className={styles.subTitle}>{mobileNavTitle}</h5>
        <ul className={styles.items}>
          <Link href="/politicians" passHref>
            <li
              className={`${styles.navItem} ${
                pathname.includes("/politicians") && styles.active
              }`}
            >
              Politicians
            </li>
          </Link>
          <Link href="/bills" passHref>
            <li
              className={`${styles.navItem} ${
                pathname.includes("/bills") && styles.active
              }`}
            >
              Bills
            </li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}