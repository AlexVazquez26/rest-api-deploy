const frutas = [
  { nombre: 'manzana', color: 'rojo', precio: 10 },
  { nombre: 'plátano', color: 'amarillo', precio: 5 },
  { nombre: 'uva', color: 'morado', precio: 15 },
  { nombre: 'pera', color: 'verde', precio: 8 },
  { nombre: 'fresa', color: 'rojo', precio: 12 },
];

function filtradoRojas() {
  const rojas = frutas.filter((fruta) => {
    return fruta.color === 'rojo';
  });
  return rojas;
}
console.log(filtradoRojas());

function filtrarRojasCaras() {
  const rojasCaras = frutas.filter((frutaCara) => {
    return frutaCara.color === 'rojo' && frutaCara.precio > 10;
  });
  return rojasCaras;
}
console.log('Segundo ejercicio: \n', filtrarRojasCaras());

const colorPicker = (color) => frutas.filter((fruta) => fruta.color === color);

console.log(
  'Usando Arrow function con parametro de entrada y filtrado: \n',
  colorPicker('verde')
);

const numeros = [3, 8, 12, 5, 20, 7];

function numerosMayores() {
  const mayores = numeros.filter((numero) => {
    return numero >= 10;
  });
  return mayores;
}

//FormaCorta

console.log('Tercer ejercicio: \n', numerosMayores());

const mayores = numeros.filter((numero) => numero >= 10);

console.log('Arrow Function: ', mayores);
