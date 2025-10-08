// src/pages/GalleryView.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTypeMembers, idFromUrl, listTypes } from "../api/poke";
import PokemonCard from "../components/PokemonCard";
import { NamedAPIResource } from "../types";
import { useResults } from "../store/ResultsContext";
import styles from "./GalleryView.module.css";

export default function GalleryView() {
  const [types, setTypes] = useState<NamedAPIResource[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { setFromList } = useResults();
  const nav = useNavigate();

  useEffect(() => {
    listTypes().then((t) => {
      // drop oddball types if you like
      setTypes(t.filter((tt) => !["unknown", "shadow"].includes(tt.name)));
    });
  }, []);

  useEffect(() => {
    async function run() {
      setLoading(true);
      try {
        if (selected.length === 0) {
          setMembers([]);
          return;
        }
        const all: { id: number; name: string }[] = [];
        for (const t of selected) {
          const pokes = await getTypeMembers(t);
          all.push(...pokes.map((p) => ({ id: idFromUrl(p.url), name: p.name })));
        }
        const unique = Array.from(new Map(all.map((p) => [p.id, p])).values());
        unique.sort((a, b) => a.id - b.id);
        setMembers(unique);
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [selected]);

  const ids = useMemo(() => members.map((m) => m.id), [members]);

  const toggle = (name: string) => {
    setSelected((cur) =>
      cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]
    );
  };

  const open = (id: number) => {
    setFromList(ids);
    nav(`/pokemon/${id}`);
  };

  return (
    <div className={styles.wrap}>
      <h2>Gallery View</h2>

      <div className={styles.filters}>
        {types.slice(0, 18).map((t) => (
          <label key={t.name} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={selected.includes(t.name)}
              onChange={() => toggle(t.name)}
            />
            {t.name}
          </label>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {!loading && selected.length === 0 && <p>Select one or more types.</p>}

      <div className={styles.grid}>
        {members.map((p) => (
          <PokemonCard key={p.id} id={p.id} name={p.name} onOpen={open} />
        ))}
      </div>
    </div>
  );
}
