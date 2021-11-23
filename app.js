const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
let db = null;

const initializingDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The local host is running on http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializingDBAndServer();

const convertDBObjectInToResponseObject = (dbObject) => {
  return {
    movie_id: dbObject.movie_id,
    director_id: dbObject.director_id,
    movie_name: dbObject.movie_name,
    lead_actor: dbObject.lead_actor,
  };
};
const convertDirectorDBInToResponse = (dbObject) => {
  return {
    director_id: dbObject.director_id,
    director_name: dbObject.director_name,
  };
};

//get Movie_Name
app.get("/movies/", async (request, response) => {
  const movie_names = `
    SELECT
     movie_name
    FROM
      movie;`;
  const moviesName = await database.all(movie_names);
  response.send(
    moviesName.map((eachName) => ({ movieName: eachName.movie_name }))
  );
});

//post create new movie table

app.post("/movies/", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
  const postMovieQuery = `
    INSERT INTO
      movie(director_id,movie_name,lead_actor)
    VALUES
      (${director_id},"${movie_name}","${lead_actor}");`;
  await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//get movie details
app.get(" /movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const movieDetails = `
    SELECT
      *
    FROM
      movie
    WHERE 
      movie_id=${movie_id};`;
  const movie = await database.all(movieDetails);
  response.send(convertDBObjectInToResponseObject(movie));
});

//update values

app.put("/movies/:movieId/", async (request, response) => {
  const { director_id, movie_name, lead_actor } = request.body;
  const { movie_id } = request.params;
  const updateQuery = `
    UPDATE
      movie
    SET
      director_id=${director_id},
      movie_name="${movie_name}",
      lead_actor="${lead_actor}"
    WHERE
      movie_id=${movie_id};`;
  await database.run(updateQuery);
  response.send("Movie Details Updated");
});

//delete row
app.delete("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const deleteList = `
    DELETE FROM
      movie
    WHERE
      movie_id=${movie_id};`;
  await database.run(deleteList);
  response.send("Movie Removed");
});

//director table
app.get(" /directors/", async (request, response) => {
  const { director_id, director_name } = request.body;
  const directorQuery = `
    SELECT
      *
    FROM
      director;`;
  const details = await database.all(directorQuery);
  response.send(
    details.map((eachOne) => convertDirectorDBInToResponse(eachOne))
  );
});

//moviedom
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { director_id } = request.paramsl;
  const movieName = `
    SELECT
      movie_name
    FROM
      movie
    WHERE director_id=${director_id};`;
  const getMovieName = await database.all(movieName);
  response.send(
    getMovieName.map((eachOnes) => ({ movieName: eachOnes.movie_name }))
  );
});
module.exports = app;
