"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pokemon } from "../types/pokemon";
import Link from "next/link";

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get("/api/pokemons");
        const data: Pokemon[] = response.data;
        setPokemonList(data);
      } catch (error) {
        console.error("Failed to fetch pokemon data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black text-white">
      <h1 className="flex justify-center text-center text-[30px] font-bold">
        Pokemon List
      </h1>
      <div className="flex justify-center">
        <ul className="grid grid-cols-6 ">
          {pokemonList.map((pokemon) => (
            <li
              key={pokemon.id}
              className="w-[250px] m-10 border-4 mb-2 rounded-[15px] "
            >
              <Link href={`/pokemons/${pokemon.id}`}>
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="ml-5"
                />
                <h2 className="ml-3">
                  {pokemon.korean_name} ({pokemon.name})
                </h2>
                <p className="ml-3 mt-2 mb-2">도감번호: {pokemon.id}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokemonList;
