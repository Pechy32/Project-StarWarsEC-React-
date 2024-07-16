import React, { useEffect, useState } from "react";
import Card from "./components/card/Card";
import PaginatingComponent from "./components/pagination/PaginatingComponent";
import { PaginationProvider } from "./components/pagination/PaginationProvider";

export function CardsIndex() {

    // ----------------- USE STATES & CONSTS ----------------

    const [planets, setPlanets] = useState([]);
    const [people, setPeople] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [biographies, setBiographies] = useState([]);
    const [movies, setMovies] = useState([]);
    const [species, setSpecies] = useState([]);

    const pageSizeOptions = [
        { _id: 4, name: 4 },
        { _id: 6, name: 6 },
        { _id: 8, name: 8 },
        { _id: 12, name: 12 },
        { _id: 16, name: 16 },
        { _id: 24, name: 24 },
        { _id: 32, name: 32 },
        { _id: 82, name: 82 }
    ];

    // ----------------- FETCHING DATA ----------------

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [peopleData, planetsData, biographiesData, moviesData, speciesData] = await Promise.all([
                    fetch("/data/people.json").then(response => response.json()),
                    fetch("/data/planets.json").then(response => response.json()),
                    fetch('/data/biographies.json').then(response => response.json()),
                    fetch('/data/movies.json').then(response => response.json()),
                    fetch('/data/species.json').then(response => response.json())
                ]);
                setPeople(peopleData);
                setPlanets(planetsData);
                setBiographies(biographiesData);
                setMovies(moviesData);
                setSpecies(speciesData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Chyba při načítání dat.");
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // -------------- HELP FUNCTIONS ---------------
    const getPlanetName = (url) => {
        const planet = planets.find(planet => planet.url === url);
        return planet ? planet.name : "neznámý";
    };

    const getSpecieName = (url) => {
        const specie = species.find(specie => specie.url === url);
        return specie ? specie.name : "Human";
    }

    const getBiography = (name) => {
        const biography = biographies.find(biography => biography.name === name);
        return biography ? biography.biography : "Biografie postavy nenalezena";
    }

    function extractIdFromUrl(url) {
        const parts = url.split('/');
        const filmId = parts[5];
        return filmId;
    }

    function getPeopleOrder(name) {
        for (let i = 0; i < people.length; i++) {
            if (people[i].name === name) {
                return i + 1;
            }
        }
        return 0; 
    }

    const getMoviesForCharacter = (character) => {
        try {
            const movieIds = character.films.map(url => extractIdFromUrl(url));
            const characterMovies = [];
            for (const movie of movies) {
                if (movieIds.includes(movie.episode_id.toString())) {
                    characterMovies.push(movie);
                }
            }
            return characterMovies;
        } catch (error) {
            console.error('Chyba při získávání filmů:', error);
            return [];
        }
    };


    // ---------------------- JSX ------------------------

    if (isLoading) {
        return <div style={{ display: "flex", justifyContent: "center", margin: "50px" }}>Načítám...</div>;
    }

    if (error) {
        return <div style={{ display: "flex", justifyContent: "center", margin: "50px" }}>{error}</div>;
    }

    return (
        <>
            <div className="sw-index-header">
                <h1>Star Wars Epic Cards</h1>
                <h4>When SWAPI.dev meets Pechy32</h4>
            </div>

            <PaginationProvider items={people} pageSizeOptions={pageSizeOptions}>
                <div className="pechy-cards-container">
                    <PaginatingComponent carouselMode={true}>
                        {(displayedItems) => (
                            <>
                                <div className="cards-wrapper">
                                    {displayedItems.map((item) => (
                                        <Card
                                            key={item.name}
                                            className="card"
                                            avatarURL={`/images/avatars/${item.name}.jpg`}
                                            iconText={"SW"}
                                            title={item.name}
                                            attributes={[
                                                { name: 'Rok narození', value: item.birth_year === "unknown" ? "neznámý" : item.birth_year },
                                                { name: 'Rodná planeta', value: getPlanetName(item.homeworld) === "unknown" ? "neznámá" : getPlanetName(item.homeworld) },
                                                { name: 'Rasa', value: getSpecieName(item.species[0]) === "Human" ? "Člověk" : getSpecieName(item.species[0])},
                                                {
                                                    name: 'Pohlaví',
                                                    value: item.gender === "male" ? "muž" :
                                                        item.gender === "female" ? "žena" :
                                                            "neurčité"
                                                },
                                                { name: 'Výška', value: item.height === "unknown" ? "neznámá" : item.height + " cm" },
                                                { name: 'Váha', value: item.mass === "unknown" ? "neznámá" : item.mass + " kg" }
                                            ]}
                                            backTitle={`#` + getPeopleOrder(item.name) + ` ` + item.name}
                                            backDesc1={getBiography(item.name)}
                                            backSubtitle2={"Filmy"}
                                            backDesc2={<ul>
                                                {getMoviesForCharacter(item).map((movie, idx) => (
                                                    <li key={idx}>{movie.title} ({new Date(movie.release_date).getFullYear()})</li>
                                                ))}
                                            </ul>}
                                            footerText={"Star Wars Epic Card by ©Pechy32"}
                                        />
                                    ))}
                                </div>
                                <div className="pagination-controls">
                                </div>
                            </>
                        )}
                    </PaginatingComponent>
                </div>
            </PaginationProvider>

            <div style={{ textAlign: "center", marginTop: "25px" }}><a href="reference.html">Zpět na web pechy32.cz</a></div>

            <div className="api-footer">
                <hr></hr>
                <small>Star Wars Epic Cards v. 1.2 &copy;Pechy32 2024 based on <a href="http://swapi.dev">swapi.dev</a> data from 06/2024<br></br>
                Star Wars and all associated characters are &copy;Lucasfilm ltd.</small>
            </div>
        </>
    );
}