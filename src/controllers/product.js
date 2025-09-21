import  db  from "../config/firebase.js";

export default {
  // Criar um novo produto
  create: async (req, res) => {
    try {
      const { name, description, width, height, length, price, image, section } = req.body;

      const newProduct = {
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        image,
        section: section || 'Todos',
      };

      const docRef = await db.collection('products').add(newProduct);
      return res.status(201).json({ id: docRef.id, ...newProduct });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  },

  // Retornar os produtos (com filtro por seção opcional)
  read: async (req, res) => {
    try {
      const section = req.query.section?.toString(); // ?section=Promoção

      // Inicia a coleção de produtos
      let query = db.collection('products'); // Usando Query aqui

      // Se a seção for fornecida, aplica o filtro
      if (section) {
        query = query.where('section', '==', section);
      }

      // Executando a consulta
      const querySnapshot = await query.get();
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  },

  // Retornar informações de um produto
  readOne: async (req, res) => {
    try {
      const id = req.params.id;

      const productDoc = await db.collection('products').doc(id).get();

      if (!productDoc.exists) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.status(200).json({ id: productDoc.id, ...productDoc.data() });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  },

  // Atualizar informações de um produto
  update: async (req, res) => {
    try {
      const id = req.params.id;
      const { name, description, width, height, length, price, image, section } = req.body;

      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();

      if (!product.exists) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await productRef.update({
        name,
        description,
        width: parseFloat(width),
        length: parseFloat(length),
        height: parseFloat(height),
        price: parseFloat(price),
        image,
        section,
      });

      return res.status(200).json({ id, name, description, price, section });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  },

  // Deletar um produto
  delete: async (req, res) => {
    try {
      const id = req.params.id;

      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();

      if (!product.exists) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await productRef.delete();

      return res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  },
};