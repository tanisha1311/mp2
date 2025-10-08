import styles from "./PokemonCard.module.css";

export default function PokemonCard({
  id,
  name,
  subtitle,
  onOpen,
}: {
  id: number;
  name: string;
  subtitle?: string;
  onOpen?: (id: number) => void;
}) {
  const img =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" +
    id +
    ".png";

  const go = () => onOpen?.(id);

  const num = String(id).padStart(3, "0"); // <-- Add this line

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && go()}
    >
      <div className={styles.thumbWrap}>
        <img className={styles.thumb} src={img} alt={name} />
      </div>
      <div className={styles.body}>
        {/* Display Pokédex # */}
        <p className={styles.title}>
          <span className={styles.dex}>#{num}</span> {name}
        </p>
        {subtitle && <div className={styles.meta}>{subtitle}</div>}
      </div>
    </div>
  );
}
