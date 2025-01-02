const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const User = require("../../models/User");
const userRoutes = require("../../routes/userRoutes");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

let mongoServer;

// Configuration globale du timeout
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
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
    console.error("Cleanup error:", error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.error("Error clearing database:", error);
    throw error;
  }
});

describe("User Controller Tests", () => {
  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword",
        role: "admin",
        dateOfBirth: "1990-01-01",
        image: "image.jpg",
      };

      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it("should fail to create user without required fields", async () => {
      const userData = {
        email: "johndoe@example.com",
      };

      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/users", () => {
    it("should get all users", async () => {
      await User.create([
        {
          name: "User One",
          email: "userone@example.com",
          password: "password1",
          role: "user",
          dateOfBirth: "1995-05-15",
          image: "image1.jpg",
        },
        {
          name: "User Two",
          email: "usertwo@example.com",
          password: "password2",
          role: "admin",
          dateOfBirth: "1993-08-20",
          image: "image2.jpg",
        },
      ]);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should get user by id", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword",
        role: "user",
        dateOfBirth: "1990-01-01",
        image: "image.jpg",
      });

      const response = await request(app).get(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(user.name);
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update user", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword",
        role: "user",
        dateOfBirth: "1990-01-01",
        image: "image.jpg",
      });

      const updateData = {
        name: "Jane Doe",
        role: "admin",
        image: "updatedimage.jpg",
      };

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.role).toBe(updateData.role);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete user", async () => {
      const user = await User.create({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "securepassword",
        role: "user",
        dateOfBirth: "1990-01-01",
        image: "image.jpg",
      });

      const response = await request(app).delete(`/api/users/${user._id}`);

      expect(response.status).toBe(200);
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });
});
