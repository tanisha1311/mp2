import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { listPokemon, idFromUrl } from "../api/poke";
import { NamedAPIResource } from "../types";
import { useResults } from "../store/ResultsContext";
import PokemonCard from "../components/PokemonCard";
import styles from "./ListView.module.css";

type SortKey = "name" | "id";
type SortDir = "asc" | "desc";

const DEFAULT_SORT: SortKey = "name";
const DEFAULT_DIR: SortDir = "asc";

export default function ListView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [all, setAll] = useState<NamedAPIResource[]>([]);
  const [loading, setLoading] = useState(false);
  const { setFromList } = useResults();
  const nav = useNavigate();

  // --- derive UI state from URL, with sane defaults ---
  const qParam = (searchParams.get("q") ?? "").trim();
  const sortParam = (searchParams.get("sort") as SortKey) || DEFAULT_SORT;
  const dirParam = (searchParams.get("dir") as SortDir) || DEFAULT_DIR;

  // local mirrors (so inputs are controlled), but they always reflect URL
  const [q, setQ] = useState(qParam);
  const [sortKey, setSortKey] = useState<SortKey>(sortParam);
  const [sortDir, setSortDir] = useState<SortDir>(dirParam);

  // keep local state in sync if the URL changes (e.g., user presses Back)
  useEffect(() => {
    setQ(qParam);
    setSortKey(sortParam);
    setSortDir(dirParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, sortParam, dirParam]);

  // fetch list once
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    listPokemon(300, 0)
      .then((res) => { if (!ignore) setAll(res.results); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  // apply search
  const filtered = useMemo(() => {
    const text = q.toLowerCase();
    return all.filter((p) => p.name.toLowerCase().includes(text));
  }, [all, q]);

  // apply sort
  const sorted = useMemo(() => {
    const data = filtered.map((p) => ({ id: idFromUrl(p.url), name: p.name }));
    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else cmp = a.id - b.id;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, sortKey, sortDir]);

  // write UI state back to the URL (debounced-ish for q)
  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
    sp.set("q", q);
    sp.set("sort", sortKey);
    sp.set("dir", sortDir);
    // only push if something actually changed
    if (
      sp.get("q") !== searchParams.get("q") ||
      sp.get("sort") !== searchParams.get("sort") ||
      sp.get("dir") !== searchParams.get("dir")
    ) {
      setSearchParams(sp, { replace: true });
    }
  }, [q, sortKey, sortDir, searchParams, setSearchParams]);

  // parent controls both: remember list + navigate
  const open = (id: number) => {
    setFromList(sorted.map((x) => x.id));
    nav(`/pokemon/${id}`);
  };

  return (
    <div className={styles.wrap}>
      <h2>List View</h2>

      <input
        className={styles.input}
        placeholder="Search Pokémon..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className={styles.controls}>
        <label>
          Sort by{" "}
          <select
            className={styles.select}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="name">Name</option>
            <option value="id">Pokédex #</option>
          </select>
        </label>

        <label>
          Order{" "}
          <select
            className={styles.select}
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDir)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading…</p>}
      {!loading && (
        <div className={styles.list}>
          {sorted.map((p) => (
            <PokemonCard key={p.id} id={p.id} name={p.name} onOpen={open} />
          ))}
        </div>
      )}
    </div>
  );
}
