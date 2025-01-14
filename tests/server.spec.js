
const request = require('supertest');
const server = require('../index');

describe('Operaciones CRUD de cafes', () => {
  it('GET /cafes - Obtiene un código 200 y un arreglo con por lo menos 1 objeto', async () => {
    const { body: cafes, statusCode } = await request(server)
      .get('/cafes')
      .send();

    expect(statusCode).toBe(200);
    expect(cafes).toBeInstanceOf(Array);
    expect(cafes.length).toBeGreaterThan(0);
    expect(cafes[0]).toBeInstanceOf(Object);
  });

  it('DELETE /cafes/:id - Obtiene un código 404 al intentar eliminar un café con un id que no existe', async () => {
    const jwt = 'token';
    const deleteCafeId = 5;
    const { statusCode } = await request(server)
      .delete(`/cafes/${deleteCafeId}`)
      .set('Authorization', jwt)
      .send();

    expect(statusCode).toBe(404);
  });

  it('POST /cafes - Agrega un nuevo café y devuelve un código 201', async () => {
    const nuevoCafe = { id: 5, nombre: 'Café Irlandés'};
    const response = await request(server)
    .post('/cafes')
    .send(nuevoCafe)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json'); // <-- Asegura que la respuesta sea JSON
    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(nuevoCafe);
    //muestra el último café agregado
    const ultimoCafe = response.body[response.body.length - 1];
    expect(ultimoCafe).toMatchObject(nuevoCafe);
    console.log('Último café agregado:', ultimoCafe);
  });

  it('PUT /cafes/:id - debería devolver un status code 400 si los ids no coinciden', async () => {
    const cafeActualizado = { id: 1, nombre: 'Café Latte', descripcion: 'Café con leche' };
    const response = await request(server).put('/cafes/2').send(cafeActualizado);
    expect(response.status).toBe(400);
});
});
