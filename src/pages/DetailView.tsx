// src/pages/DetailView.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPokemon, officialArtworkUrl } from "../api/poke";
import { Pokemon } from "../types";
import { useResults } from "../store/ResultsContext";
import styles from "./DetailView.module.css";

export default function DetailView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const { setCurrentById, getPrevId, getNextId } = useResults();

  useEffect(() => {
    if (!id) return;
    const pid = Number(id);
    setCurrentById(pid);
    setLoading(true);
    getPokemon(pid)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id, setCurrentById]);

  const img = useMemo(() => {
    const pid = Number(id);
    return officialArtworkUrl(pid);
  }, [id]);

  if (loading) return <div className={styles.wrap}><p>Loading…</p></div>;
  if (!data) return <div className={styles.wrap}><p>Not found.</p></div>;

  const prev = getPrevId();
  const next = getNextId();

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <img src={img} alt={data.name} className={styles.image} />

        <div className={styles.block}>
          <h2 className={styles.title}>{data.name}</h2>

          <div className={styles.kv}>
            <div><b>ID</b></div><div>{data.id}</div>
            <div><b>Height</b></div><div>{data.height}</div>
            <div><b>Weight</b></div><div>{data.weight}</div>
            <div><b>Types</b></div>
            <div className={styles.badges}>
              {data.types.map(t => (
                <span key={t.type.name} className={styles.badge}>{t.type.name}</span>
              ))}
            </div>
            <div><b>Abilities</b></div>
            <div className={styles.badges}>
              {data.abilities.map(a => (
                <span key={a.ability.name} className={styles.badge}>{a.ability.name}</span>
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => prev && nav(`/pokemon/${prev}`)}
              disabled={!prev}
            >
              Previous
            </button>
            <button
              className={styles.button}
              onClick={() => next && nav(`/pokemon/${next}`)}
              disabled={!next}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.block} ${styles.stats}`}>
        <h3>Base Stats</h3>
        {data.stats.map(s => (
          <div key={s.stat.name} className={styles.statLine}>
            <div style={{ textTransform: "capitalize" }}>{s.stat.name}</div>
            <div className={styles.bar}>
              <div className={styles.fill} style={{ width: Math.min(100, s.base_stat) + "%" }} />
            </div>
            <div>{s.base_stat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
