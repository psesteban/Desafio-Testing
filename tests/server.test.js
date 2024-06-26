import request from 'supertest'
import app from '../index.js'
import { describe, expect, test } from 'vitest'

const nuevoCafe = { id: 5, name: 'Café Fake' }
const cafeDistinto = { id: 1, name: 'cafe distinto' }

// 1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto.
describe('SERVER APP', () => {
  test('GET /cafes debería retornar un status code 200 y un arreglo con al menos un objeto', async () => {
    const response = await request(app).get('/cafes')
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toBeInstanceOf(Object)
  })

  // 2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe.
  test('DELETE /cafes/:id debería retornar un status code 404 si el id no existe', async () => {
    const response = await request(app).delete('/cafes/999').set('Authorization', 'Bearer token')
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('message', 'No se encontró ningún cafe con ese id')
  })

  // 3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201.
  test('POST /cafes debería agregar un nuevo café y retornar un status code 201', async () => {
    const response = await request(app).post('/cafes').send(nuevoCafe)
    expect(response.statusCode).toBe(201)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.some(cafe => cafe.id === nuevoCafe.id)).toBeTruthy()
  })

  // 4. Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload.
  test('PUT /cafes/:id debería retornar un status code 400 si el id del parámetro es diferente al id en el payload', async () => {
    const response = await request(app).put('/cafes/9').send(cafeDistinto)
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message', 'El id del parámetro no coincide con el id del café recibido')
  })
})
