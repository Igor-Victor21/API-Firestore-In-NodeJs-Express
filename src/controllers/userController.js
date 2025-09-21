import  db  from "../config/firebase.js";

export default {
  // Criar usuário (já estava correto)
  create: async (req, res) => {
    try {
      const { fullName, email,password, cpf, cep, address, complement, numberPhone, dateOfBirth } = req.body;

      // 1. Validação dos campos obrigatórios
      if (!fullName || !email || !cpf) {
        return res.status(400).json({ error: 'Nome completo, email e CPF são obrigatórios' });
      }

      // 2. Cria o documento com tratamento seguro para campos opcionais
      const userData = {
        fullName,
        email,
        password,
        cpf,
        cep: cep || null,           // Converte undefined para null
        address: address || null,    // Garante que não será undefined
        complement: complement || null,
        numberPhone: numberPhone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : null
        // createdAt: new Date().toISOString()
      };

      // 4. Cria o usuário no Firestore
      const docRef = await db.collection('users').add(userData);

      return res.status(201).json({
        id: docRef.id,
        ...userData
      });

    } catch (error) {
      console.error('Erro detalhado:', error);
      return res.status(500).json({
        error: 'Falha ao criar usuário',
      });
    }
  },

  read: async (req, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(users);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao ler usuários';
      return res.status(500).json({ error: errorMessage });
    }
  },

  // Atualizar usuário (Firestore)
  update: async (req, res) => {
    const uid = req.params.id;
    const data = req.body;

    try {
      await db.collection("users").doc(uid).update(data); // Correto: .doc(uid).update()
      return res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  // Deletar usuário (Firestore)
  delete: async (req, res) => {
    const uid = req.params.id;
    try {
      await db.collection("users").doc(uid).delete(); // Correto: .doc(uid).delete()
      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return res.status(500).json({ error: 'Erro ao deletar usuário', details: errorMessage });
    }
  }
};