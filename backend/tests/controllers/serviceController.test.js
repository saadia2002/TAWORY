const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const Service = require('../../models/Service');
const serviceRoutes = require('../../routes/serviceRoutes');

const app = express();
app.use(express.json());
app.use('/api', serviceRoutes);  // Adjusted path

let mongoServer;

jest.setTimeout(100000);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Service.deleteMany({});
});

describe('Service Controller Tests', () => {
    describe('POST /api/services', () => {
        it('should create a new service', async () => {
            const categoryId = new mongoose.Types.ObjectId();
            const serviceProviderId = new mongoose.Types.ObjectId();

            const serviceData = {
                name: 'Test Service',
                description: 'Test Description',
                price: 100,
                serviceProvider: serviceProviderId,  // Utilisation de l'ObjectId
                category: categoryId                  // Utilisation de l'ObjectId
            };

            const response = await request(app)
                .post('/api/services')
                .send(serviceData);

            expect(response.status).toBe(201);
            expect(response.body.name).toBe(serviceData.name);
            expect(response.body.description).toBe(serviceData.description);
            expect(response.body.price).toBe(serviceData.price);
        });

        it('should fail to create service without name', async () => {
            const categoryId = new mongoose.Types.ObjectId();
            const serviceProviderId = new mongoose.Types.ObjectId();

            const serviceData = {
                description: 'Test Description',
                price: 100,
                serviceProvider: serviceProviderId,
                category: categoryId
            };

            const response = await request(app)
                .post('/api/services')
                .send(serviceData);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/services', () => {
        it('should get all services', async () => {
            const categoryId1 = new mongoose.Types.ObjectId();
            const serviceProviderId1 = new mongoose.Types.ObjectId();
            const categoryId2 = new mongoose.Types.ObjectId();
            const serviceProviderId2 = new mongoose.Types.ObjectId();

            await Service.create([
                { name: 'Service 1', description: 'Description 1', price: 50, serviceProvider: serviceProviderId1, category: categoryId1 },
                { name: 'Service 2', description: 'Description 2', price: 100, serviceProvider: serviceProviderId2, category: categoryId2 }
            ]);

            const response = await request(app).get('/api/services');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toBe(2);
        });
    });

    describe('GET /api/services/:id', () => {
        it('should get service by id', async () => {
            const categoryId = new mongoose.Types.ObjectId();
            const serviceProviderId = new mongoose.Types.ObjectId();

            const service = await Service.create({
                name: 'Test Service',
                description: 'Test Description',
                price: 100,
                serviceProvider: serviceProviderId,
                category: categoryId
            });

            const response = await request(app).get(`/api/services/${service._id}`);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(service.name);
        });

        it('should return 404 for non-existent service', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/services/${nonExistentId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/services/:id', () => {
        it('should update service', async () => {
            const categoryId = new mongoose.Types.ObjectId();
            const serviceProviderId = new mongoose.Types.ObjectId();

            const service = await Service.create({
                name: 'Original Name',
                description: 'Original Description',
                price: 100,
                serviceProvider: serviceProviderId,
                category: categoryId
            });

            const updateData = {
                name: 'Updated Name',
                description: 'Updated Description',
                price: 150,
                serviceProvider: serviceProviderId,
                category: categoryId
            };

            const response = await request(app)
                .put(`/api/services/${service._id}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updateData.name);
            expect(response.body.description).toBe(updateData.description);
            expect(response.body.price).toBe(updateData.price);
        });
    });

    describe('DELETE /api/services/:id', () => {
        it('should delete service', async () => {
            const categoryId = new mongoose.Types.ObjectId();
            const serviceProviderId = new mongoose.Types.ObjectId();

            const service = await Service.create({
                name: 'Test Service',
                description: 'Test Description',
                price: 100,
                serviceProvider: serviceProviderId,
                category: categoryId
            });

            const response = await request(app).delete(`/api/services/${service._id}`);

            expect(response.status).toBe(200);

            const deletedService = await Service.findById(service._id);
            expect(deletedService).toBeNull();
        });
    });
});
