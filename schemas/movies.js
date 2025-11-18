//librería que hace validaciones de datos
// const z = require('zod'); commonJs
import z from 'zod';

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie tittle is required. Please Check URL ',
  }),
  year: z.number({}).int().positive().min(1900).max(2026), //el positivo no es necesario si pones rangos
  director: z.string(),
  duration: z.number().positive().max(300),
  rate: z.number().min(0).max(10).default(0), //S ele puede poner optional(), null(), default()
  poster: z.string().url({
    message: 'Poster must be a valid URL',
  }),
  genre: z
    .array(
      z.enum([
        'Drama',
        'Action',
        'Crime',
        'Adventure',
        'Terror',
        'Romance',
        'Sci-Fi',
        'Animation',
        'Biography',
        'Fantasy',
      ])
    )
    .nonempty({
      message: 'At least one genre is required',
    }),
});

//=============================esto es con commonJS=============================
// function validateMovie(object) {
//   return movieSchema.safeParse(object);
// }

// function validatePartialMovie(object) {
//   //revisa cada uno de los elementos que estan dentro del esquema SI estan, si no estan los ignora

//   //por ejemplo no tiene que cumplir con todos y cada uno de ellos
//   //Si existe "tittle" entonces valida tittle con el esquema de arriba
//   //Si no existe no hará nada  esto lo hace ----> partial()
//   return movieSchema.partial().safeParse(object);
// }

// module.exports = {
//   validateMovie,
//   validatePartialMovie,
// };
//=============================esto es con commonJS=============================
export function validateMovie(input) {
  return movieSchema.safeParse(input);
}
export function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input);
}
