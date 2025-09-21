import db from './config/firebase.js';
import express from 'express';
import userController from "./controllers/userController.js"
import productController from "./controllers/product.js"

const { Router } = express;
const routes = Router();

routes.get('/teste-firestore', async (req, res) => {
  try {
    const testRef = await db.collection('testes').add({timestamp: new Date()});
    res.json({success: true, id: testRef.id});
  } catch (error) {
    res.status(500).json({error});
  }
});

routes.post("/users", (req, res) => userController.create(req,res));
routes.get("/users", (req, res) => userController.read(req,res));
routes.put("/users/:id", (req, res) => userController.update(req,res));
routes.delete("/users/:id", (req, res) => userController.delete(req,res));


routes.post("/products", (req, res) => productController.create(req,res));
routes.get("/products", (req, res) => productController.read(req,res));
routes.get("/products/:id", (req, res) => productController.readOne(req,res));
routes.put("/products/:id", (req, res) => productController.update(req,res));
routes.delete("/products/:id", (req, res) => productController.delete(req,res));

export default routes;