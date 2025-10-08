export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type PokemonTypeSummary = {
  slot: number;
  type: NamedAPIResource; // { name: "grass", url: "..." }
};

export type PokemonSprites = {
  other?: {
    ["official-artwork"]?: {
      front_default?: string | null;
    };
  };
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeSummary[];
  abilities: { ability: NamedAPIResource }[];
  stats: { base_stat: number; stat: NamedAPIResource }[];
  sprites: PokemonSprites;
};

export type PokemonTypeListResponse = {
  results: NamedAPIResource[];
};

export type TypeMembersResponse = {
  pokemon: { pokemon: NamedAPIResource }[];
};
