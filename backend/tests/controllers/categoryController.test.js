const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const Category = require('../../models/Category');
const categoryRoutes = require('../../routes/categoryRoutes');

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

let mongoServer;

// Configuration globale du timeout
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await Category.deleteMany({});
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
});

describe('Category Controller Tests', () => {
  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(categoryData.name);
      expect(response.body.description).toBe(categoryData.description);
    });

    it('should fail to create category without name', async () => {
      const categoryData = {
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/categories')
        .send(categoryData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      await Category.create([
        { name: 'Category 1', description: 'Description 1' },
        { name: 'Category 2', description: 'Description 2' }
      ]);

      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get category by id', async () => {
      const category = await Category.create({
        name: 'Test Category',
        description: 'Test Description'
      });

      const response = await request(app)
        .get(`/api/categories/${category._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(category.name);
    });

    it('should return 404 for non-existent category', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/categories/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      const category = await Category.create({
        name: 'Original Name',
        description: 'Original Description'
      });

      const updateData = {
        name: 'Updated Name',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/categories/${category._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      const category = await Category.create({
        name: 'Test Category',
        description: 'Test Description'
      });

      const response = await request(app)
        .delete(`/api/categories/${category._id}`);

      expect(response.status).toBe(200);
      
      const deletedCategory = await Category.findById(category._id);
      expect(deletedCategory).toBeNull();
    });
  });
});