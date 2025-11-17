//Dependencia que sirve para hacer eventos de API mas facilmente
const express = require('express'); //require -> commonJS
//Dependencia que ayuda a crear UUID (Univque Universal ID)
const crypto = require('node:crypto');
//Aqui se guarda el json en una constante Node.js literalmente ya lo
const cors = require('cors');
//descifra por ti
const movies = require('./movies.json');
const { validateMovie } = require('./schemas/movies');
const { validatePartialMovie } = require('./schemas/movies');

const port = process.env.PORT ?? 1234;
const app = express();
app.disable('x-powered-by'); //Disable the header x-powered-by
app.use(express.json());
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5500',
  'https://movies.com',
  'https://midu.dev',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / curl
      if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  })
);

//metodos normales GET/HEAD/POST

//Metodos complejos PUT/PATCH/DELETE

//CORS Pre-flight
//OPTIONS

// 👉 util para poner CORS en la respuesta real
function setCors(res, origin) {
  if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Vary', 'Origin'); // buena práctica para caches
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
    return true;
  }
  return false;
}

app.get('/', (req, res) => {
  //Leer el query param de formt
  res.json({ message: 'hola mundo' });
});

app.listen(port, () => {
  console.log(`Server listening on server port http://localhost:${port}`);
});

//app.options(/.*/, cors());

// app.options('/movies/:id',cors() => {
//   //Va al metodo que confirma CORS
//   // setCors(res, req.header('origin'));
//   return res.sendStatus(204);
// });

// app.options('/movies', (req, res) => {
//   // <- útil para GET con headers custom o futuros POST
//   //Va al metodo que confirma CORS
//   // setCors(res, req.header('origin'));
//   return res.sendStatus(204);
// });

//Todos los recursos que sean MOVIES se idenfitica con /movies
app.get('/movies', (req, res) => {
  // res.header('Access-Control-Allow-Origin', '*');
  //Esta sirve para que todos los origenes puedan acceder
  //Cuando la peticion es del mismo origin
  //http://localhost:1234 -> http://localhost:1234
  //No te envia la cabecera origin, solo cuando el dominio es diferente
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

//el :id va a ser dinamico
//regex -> es usar como comodines las busquedas
app.get('/movies/:id', (req, res) => {
  //path to regex
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: 'movie not found' });
});

//request de json
app.post('/movies', (req, res) => {
  //Codigo para pruebas
  // console.log('content-type:', req.headers['content-type']);
  // console.log('body: ', req.body);
  const result = validateMovie(req.body);
  if (result.error) {
    //tambien se puede ocupar el 422 (Unprocessable Entity) o el 400
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  //Aqui sería hacer en la base de datos un "algo"
  const newMovie = {
    id: crypto.randomUUID(),
    //req.body es datos sin revisar
    //req.data es datos ya revisados
    ...result.data, //✖️ No es lo mismo que req.body
  };
  //Esta ya no es necesario
  // const { title, year, director, duration, poster, genre } = req.body;
  //esto no sería rest porque estamos guardando
  //El estado de memoria
  //if Something is missing

  //Es necesario hacer validaciones de los datos hacerlos directamente en el codigo sería algo
  //tardado e innecesario
  // if (!title || !genre || !year || !director || !duration) {
  //   return res.status(400).json({ message: 'Missing required fields' });
  // }
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  //realiza la revision con este metodo que se encuentra en esquemas
  const result = validatePartialMovie(req.body);
  if (!result.success) {
    //Aqui si algun valor no coincide con la validacion entonces se sale y entrega un error
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  //Si todo esas ok entonces pasa por aca
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });
  //todo validado
  //Esto es un JSON

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data, //Le pasamos la info ya validada
  };
  // console.log('The requested id ---->', id);
  // console.log('Change completed');
  movies[movieIndex] = updateMovie;
  return res.json(updateMovie);
});

app.delete('/movies/:id', (req, res) => {
  //Va al metodo que confirma CORS
  // setCors(res, req.header('origin'));
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });
  movies.splice(movieIndex, 1);
  return res.json({ message: 'Movie Deleted' });
});

//Not found (debe de ir al ultimo)
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

//En express no existe el statusCode(400) ---> Se llama status(400)
//Error sintactico
