// reservationController.test.js
const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const Reservation = require('../../models/Reservation');
const reservationRoutes = require('../../routes/reservationRoutes');

const app = express();
app.use(express.json());
app.use('/api/reservations', reservationRoutes);

let mongoServer;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Reservation.deleteMany({});
});

describe('Reservation Controller Tests', () => {
  describe('POST /api/reservations', () => {
    it('should create a new reservation', async () => {
      const reservationData = {
        service: new mongoose.Types.ObjectId(),
        client: new mongoose.Types.ObjectId(),
        date: new Date(),
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      expect(response.status).toBe(201);
      expect(response.body.service).toBe(reservationData.service.toString());
      expect(response.body.client).toBe(reservationData.client.toString());
      expect(response.body.status).toBe(reservationData.status);
    });

    it('should fail to create reservation without required fields', async () => {
      const reservationData = {
        client: new mongoose.Types.ObjectId(),
        date: new Date()
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/reservations', () => {
    it('should get all reservations', async () => {
      await Reservation.create([
        { service: new mongoose.Types.ObjectId(), client: new mongoose.Types.ObjectId(), date: new Date(), status: 'confirmed' },
        { service: new mongoose.Types.ObjectId(), client: new mongoose.Types.ObjectId(), date: new Date(), status: 'pending' }
      ]);

      const response = await request(app).get('/api/reservations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/reservations/:id', () => {
    it('should get reservation by id', async () => {
      const reservation = await Reservation.create({
        service: new mongoose.Types.ObjectId(),
        client: new mongoose.Types.ObjectId(),
        date: new Date(),
        status: 'confirmed'
      });

      const response = await request(app).get(`/api/reservations/${reservation._id}`);

      expect(response.status).toBe(200);
      expect(response.body.service).toBe(reservation.service.toString());
    });

    it('should return 404 for non-existent reservation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/reservations/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/reservations/:id', () => {
    it('should update reservation', async () => {
      const reservation = await Reservation.create({
        service: new mongoose.Types.ObjectId(),
        client: new mongoose.Types.ObjectId(),
        date: new Date(),
        status: 'pending'
      });

      const updateData = {
        status: 'confirmed'
      };

      const response = await request(app)
        .put(`/api/reservations/${reservation._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('DELETE /api/reservations/:id', () => {
    it('should delete reservation', async () => {
      const reservation = await Reservation.create({
        service: new mongoose.Types.ObjectId(),
        client: new mongoose.Types.ObjectId(),
        date: new Date(),
        status: 'pending'
      });

      const response = await request(app).delete(`/api/reservations/${reservation._id}`);

      expect(response.status).toBe(200);

      const deletedReservation = await Reservation.findById(reservation._id);
      expect(deletedReservation).toBeNull();
    });
  });
});