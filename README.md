# API-Firestore-In-NodeJs-Express
API que se conecta no banco de dados "FireStore" utilizando node.js e express, com documentação

# Configuração do Projeto 

- Criando o projeto em node
    npm init (Não configurei nada)
- Instalando nodemon para não precisar ficar reiniciar o projeto toda vez
    npm install --save-dev nodemon
- Instalando o express para trabalhar com as rotas
    npm install --save express
- Instalando o pacote para trabalhar com Firebase na parte do back-end
    npm install firebase-admin --save
- Instalando firebase
    npm install firebase
- No package.json na parte de scripts
    "dev": "nodemon index.js" (Isso faz com que o projeto inicie na index.js em conjunto com o nodemon)
- Instalando dotenv para subir para o render a variavel de ambiente dentro da .env
- npm install dotenv


# Arquivo index.js

- Import do express
    import express from 'express';

- Import de bibliotecas do firebase
    import { initializeApp, cert } from "firebase-admin/app";<br/>
    import { getFirestore } from "firebase-admin/firestore";<br/>

- Obtendo o Token do firebase (A chave privada que está dentro do arquivo da pasta config) 
    const firebaseToken = require('./config/{nome do seu arquivo}');


- Criando uma constante para minha aplicação (app) instânciada com o express para gerenciar as rotas
    const app = express();  

- Criando a porta
    const port = 3000;

- Inicializando o firebase
    initializeApp({<br/>
        credential: cert(serviceAccount)<br/>
    });<br/>

- Inicialize o Cloud Firestore e obtenha uma referência ao serviço
    const db = getFirestore(app);

- Informando ao express o tipo de dados que será enviado ao JSON
app.use(express.json());

# Rotas







# Crie uma pasta config
- Fui no site do firebase entrei na configuração do projeto
- Contas e serviço 
- Gerei uma chave nova privada
- E salvei dentro da pasta config 




