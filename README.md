# API-Firestore-In-NodeJs-Express
API que se conecta no banco de dados "FireStore" utilizando node.js e express, com documentação

# Configuração do Projeto 
- Aviso importante: caso queira utilizar TypeScript, recomendo iniciar o projeto já em TypeScript. Se você tentar apenas converter arquivos JavaScript para TypeScript, o projeto pode apresentar erros nas rotas e outros problemas de funcionamento.
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
    "dev": "nodemon src/index.js" (Isso faz com que o projeto inicie na index.js em conjunto com o nodemon)
- Instalando dotenv para subir para o render a variavel de ambiente dentro da .env
- npm install dotenv

# Raiz do Projeto
- Arquivo .env 
- Arquivo .gitignore

# .env

- Arquivo necessário para executar o projeto localmente.
Código:
<br/>
FIREBASE_CONFIG={[local onde vai ficar sua chave privada vinda da configuração do projeto do firebase]}

- Como pegar sua chave privada
- Entre no seu projeto do firebase
- Vá até a engrenagem no canto superior esquerdo do lado de "Visão geral do projeto"
- Configurações do projeto
- Contas de Serviço
- Gerar nova chave privada 
- Recomendo baixar o arquivo fora do projeto do vs code, pois pode bugar
- Abra o arquivo em um arquivo .txt e copie tudo que está dentro
- Cole dentro da variável de ambiente FIREBASE_CONFIG={}
- Ps: tudo dentro do .env tem que estar na mesma linha (Não sei o motivo)

### AVISO IMPORTANTE

Nunca compartilhe sua chave privada do Firebase. Ela é um dado sensível e pode dar acesso completo ao seu banco de dados. Por isso, não exponha sua chave privada, seu arquivo .env ou qualquer outro arquivo de configuração.

# .gitignore
- Apenas isso dentro:
node_modules/<br/>
.env<br/>

Serve para caso queira subir algo para o github ele acaba ignorando arquivos que estão aki dentro (.env e muito importante está aki dentro)

# Estrutura de Pastas
- Pasta src
<br/>
Pasta config<br/>
Pasta controllers<br/>
Arquivo index.js<br/>
Arquivo routes.js<br/>

# Pasta config

- Dentro dessa pasta tem um arquivo 

- firebase.js
Arquivo responsável por configurar e inicializar o Firebase, permitindo que a API acesse os recursos do sistema.

- Código 
<br/>
import 'dotenv/config';<br/>
import admin from 'firebase-admin';<br/>
<br/>
if (!process.env.FIREBASE_CONFIG) {<br/>
  throw new Error("Variável FIREBASE_CONFIG não definida");<br/>
}<br/>

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);<br/>
<br/>
if (!admin.apps.length) {<br/>
  admin.initializeApp({<br/>
    credential: admin.credential.cert(serviceAccount),<br/>
  });<br/>
}<br/>
<br/>
const db = admin.firestore();<br/>
<br/>
export default db;<br/>
<br/>

- Funcionamento:
    A primeira verificação garante que a variável de ambiente FIREBASE_CONFIG esteja definida no arquivo .env.<br/>
    Caso não esteja definida, o sistema emite um erro no console.<br/>
    Se estiver definida, o Firebase é inicializado com as informações dessa variável.<br/>
    Após a inicialização, é exportado o objeto db, que representa o Firestore e será utilizado para realizar operações de CRUD no banco de dados.<br/>

# Pasta controllers
- product.js & userController.js
<br/>
Esses dois arquivos são responsáveis pelo CRUD de produtos e usuários. Neles é possível criar, visualizar, atualizar e deletar tanto os produtos quanto os usuários do sistema.
<br/>
Recomendo abrir o arquivo para ver a explicação detalhada do CRUD.

# Arquivo index.js

Este arquivo é o ponto de partida do projeto.<br/>
<br/>
import express from 'express';<br/>
import routes from './routes.js';<br/>
<br/>
const app = express();<br/>
const port = 3000;<br/>
<br/>
app.use(express.json());<br/>
app.use(routes);<br/>
<br/>
app.listen(port, () => {<br/>
  console.log(`Servidor rodando em http://localhost:${port}`);<br/>
});<br/>
<br/>

- Funcionamento 
Ele define que vamos usar o Express para criar e organizar as rotas (os “caminhos” do sistema), escolhe a porta onde o projeto vai rodar (3000), permite que o sistema receba dados em formato JSON, conecta com o arquivo de rotas e, no final, liga o servidor mostrando uma mensagem de que o projeto está funcionando.

# routes.js

Esse arquivo é responsável por criar as rotas do CRUD, para conseguir publicar, ler o arquivo, atualizar e deletar os arquivos do userController.js e product.js, além de ter uma rota de teste para verificar se as rotas estão funcionando.
<br/>
import db from './config/firebase.js';<br/>
import express from 'express';<br/>
import userController from "./controllers/userController.js"<br/>
import productController from "./controllers/product.js"<br/>
<br/>
const { Router } = express<br/>;
const routes = Router();<br/>
<br/>
routes.get('/teste-firestore', async (req, res) => {<br/>
  try {<br/>
    const testRef = await db.collection('testes').add({timestamp: new Date()});<br/>
    res.json({success: true, id: testRef.id});<br/>
  } catch (error) {<br/>
    res.status(500).json({error});<br/>
  }<br/>
});<br/>
<br/>
routes.post("/users", (req, res) => userController.create(req,res));<br/>
routes.get("/users", (req, res) => userController.read(req,res));<br/>
routes.put("/users/:id", (req, res) => userController.update(req,res));<br/>
routes.delete("/users/:id", (req, res) => userController.delete(req,res));<br/>
<br/>
routes.post("/products", (req, res) => productController.create(req,res));<br/>
routes.get("/products", (req, res) => productController.read(req,res));<br/>
routes.get("/products/:id", (req, res) => productController.readOne(req,res));<br/>
routes.put("/products/:id", (req, res) => productController.update(req,res));<br/>
routes.delete("/products/:id", (req, res) => productController.delete(req,res))<br/>;
<br/>
export default routes;<br/>

### Funcionamento da routes

- Importações
Ele pega a conexão com o banco de dados (firebase.js).<br/>

Usa o express, que é a ferramenta que ajuda a criar os caminhos.<br/>

Puxa dois arquivos que sabem lidar com usuários (userController) e produtos (productController).<br/>

- Criação das rotas

routes.get('/teste-firestore', ...): cria uma rota de teste só para verificar se o banco está funcionando. Ele grava a hora atual no banco e retorna o ID desse teste.<br/>

- Depois, tem os caminhos de usuários:

POST /users: cria um usuário novo.<br/>

GET /users: lista todos os usuários.<br/>

PUT /users/:id: atualiza os dados de um usuário específico.<br/>

DELETE /users/:id: apaga um usuário específico.<br/>

- E os caminhos de produtos:

POST /products: cria um produto novo.<br/>

GET /products: lista todos os produtos.<br/>

GET /products/:id: mostra os detalhes de um produto específico.<br/>

PUT /products/:id: atualiza um produto específico.<br/>

DELETE /products/:id: apaga um produto específico.<br/>

- Exportação

No final, ele exporta todas essas rotas para serem usadas no sistema principal.<br/>

# Realizando validação de token JWT



# Subindo está API para o Render 

- Primeiro vc precisa subir tudo isso para o github (NÃO SOBE A .env PARA O GITHUB)
- Caso não tenha uma conta no render crie uma e conect com o seu github
- Crie um novo projeto
- Add a new environment
- Create a new Service
- Web
- Escolha o seu arquivo da API do seu github
- Linguage: Node
- branch: main
- Region: Oregon (US West)
- Root Directory: (Vazio pq ele ja ta indo para pasta index do meu projeto.)
- Build Command: npm install
- Start command: npm run dev

- Instance Type: Free 

- Environment Variables
Aqui é a parte mais importante, é aki onde vc vai colocar a variavel de ambiente que está la na sua .env, sem isso o projeto não vai rodar

- NAME_OF_VARIABLE: FIREBASE_CONFIG
- value: Você copia sua chave privada da sua .env

- Ex chave privada:
Algo tipo isso: <br/>
{<br/>
  "type": "service_account",<br/>
  "project_id": "meu-projeto",<br/>
  "private_key_id": "8f6c2f9d...",<br/>
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqh...\n-----END PRIVATE KEY-----\n",<br/>
  "client_email": "firebase-adminsdk@meu-projeto.iam.gserviceaccount.com"<br/>
}<br/>

- Deploy Web Service 

- Se fez tudo certo vai funcionar, caso não funcione vai ter que pesquisar o erro que vai estar dando.

# ACABOU












