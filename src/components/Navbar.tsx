import { NavLink, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>PokéExplorer</Link>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
        end
      >
        List
      </NavLink>
      <NavLink
        to="/gallery"
        className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
      >
        Gallery
      </NavLink>
    </nav>
  );
}
