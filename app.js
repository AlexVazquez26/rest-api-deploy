//Dependencia que sirve para hacer eventos de API mas facilmente
import express, { json } from 'express'; //require -> commonJS
import { moviesRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

const port = process.env.PORT ?? 1234;
const app = express();
app.disable('x-powered-by'); //Disable the header x-powered-by
app.use(corsMiddleware());
app.use(json());
app.use('/movies', moviesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' });
});

app.listen(port, () => {
  console.log(`Server listening on server port http://localhost:${port}`);
});

//Not found (debe de ir al ultimo)
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

//En express no existe el statusCode(400) ---> Se llama status(400)
//Error sintactico
