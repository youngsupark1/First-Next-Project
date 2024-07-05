import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Pokemon } from "../types/pokemon";
import Link from "next/link";
import Image from "next/image";

const PokemonDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/pokemons/${id}`);
          const data: Pokemon = await response.json();
          setPokemon(data);
        } catch (error) {
          console.error("Failed to fetch pokemon data", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pokemon) {
    return <div>Pokemon not found!</div>;
  }

  return (
    <div>
      <Link href="/">
        <p>&larr; Back to Pokemon List</p>
      </Link>

      {/* 포켓몬 이미지와 이름 */}
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={100}
        height={100}
      />
      <h1>
        {pokemon.korean_name} ({pokemon.name})
      </h1>

      {/* 키와 몸무게 */}
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>

      {/* 타입 목록 */}
      <h2>Types:</h2>
      <ul>
        {pokemon.types.map((type, index) => (
          <li key={index}>
            {type.type.korean_name} ({type.type.name})
          </li>
        ))}
      </ul>

      {/* 능력 목록 */}
      <h2>Abilities:</h2>
      <ul>
        {pokemon.abilities.map((ability, index) => (
          <li key={index}>
            {ability.ability.korean_name} ({ability.ability.name})
          </li>
        ))}
      </ul>

      {/* 기술 목록 */}
      <h2>Moves:</h2>
      <ul>
        {pokemon.moves.map((move, index) => (
          <li key={index}>
            {move.move.korean_name} ({move.move.name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetail;
