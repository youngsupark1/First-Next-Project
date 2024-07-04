import { NextResponse } from "next/server";
import axios from "axios";

// 포켓몬의 총 개수
const TOTAL_POKEMON = 151;

// Array.from 메서드를 사용하여 배열을 생성하며, 각 인덱스는 포켓몬의 ID(1부터 151까지)를 나타냅니다.
export const GET = async (request: Request) => {
  try {
    const allPokemonPromises = Array.from(
      { length: TOTAL_POKEMON },
      (_, index) => {
        const id = index + 1;
        return Promise.all([
          // 이 두 요청은 각각 포켓몬의 기본 정보와 종(species) 정보를 가져옵니다.
          axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
          axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
        ]);
      }
    );

    // Promise.all을 사용하여 모든 포켓몬 데이터 요청이 완료될 때까지 기다립니다.
    const allPokemonResponses = await Promise.all(allPokemonPromises);

    // allPokemonResponses 배열을 순회하며 각 포켓몬의 데이터와 종 데이터를 처리
    // speciesResponse.data.names 배열에서 한국어 이름을 찾습니다.
    // 각 포켓몬 데이터 객체에 korean_name 필드를 추가하여 한국어 이름을 포함시킵니다.
    // 한국어 이름이 없으면 null을 설정합니다.
    const allPokemonData = allPokemonResponses.map(
      ([response, speciesResponse], index) => {
        const koreanName = speciesResponse.data.names.find(
          (name: any) => name.language.name === "ko"
        );
        return { ...response.data, korean_name: koreanName?.name || null };
      }
    );

    // 최종적으로 처리된 모든 포켓몬 데이터를 JSON 형식으로 반환합니다.
    return NextResponse.json(allPokemonData);
  } catch (error) {
    // 데이터 요청 중 오류가 발생하면, 오류 메시지를 JSON 형식으로 반환합니다
    return NextResponse.json({ error: "Failed to fetch data" });
  }
};
