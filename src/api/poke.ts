import client from "./client";
import {
  PokemonListResponse,
  Pokemon,
  PokemonTypeListResponse,
  TypeMembersResponse,
} from "../types";

export function idFromUrl(url: string): number {
  // e.g. https://pokeapi.co/api/v2/pokemon/6/ -> 6
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** List pokemon (names + urls). We’ll parse IDs from url. */
export async function listPokemon(limit = 200, offset = 0) {
  const { data } = await client.get<PokemonListResponse>("/pokemon", {
    params: { limit, offset },
  });
  return data;
}

/** Fetch single pokemon by id or name. */
export async function getPokemon(idOrName: string | number) {
  const { data } = await client.get<Pokemon>(`/pokemon/${idOrName}`);
  return data;
}

/** All types (for gallery filters) */
export async function listTypes() {
  const { data } = await client.get<PokemonTypeListResponse>("/type");
  // PokeAPI includes some non-game types (like "shadow" / "unknown")—we can keep them or filter later.
  return data.results;
}

/** Pokémon that belong to a given type name */
export async function getTypeMembers(typeName: string) {
  const { data } = await client.get<TypeMembersResponse>(`/type/${typeName}`);
  return data.pokemon.map((p) => p.pokemon);
}
