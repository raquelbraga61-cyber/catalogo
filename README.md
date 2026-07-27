# Sacolão 🍎🥬🥦

> Uma plataforma premium, moderna e responsiva para catálogo, carrinho de compras e gestão administrativa desenvolvida com **React**, **TypeScript** e **Tailwind CSS**.

Este projeto foi construído para fornecer uma experiência fluida, limpa e elegante para os clientes fazerem seus pedidos de hortifrúti diretamente pelo site e enviá-los de forma instantânea para o WhatsApp do estabelecimento. Além do catálogo, possui uma área administrativa integrada para controlo completo de produtos e categorias.

---

## ✨ Funcionalidades Principais

### Para os Clientes:
- **Catálogo Inteligente**: Navegação fluida categorizada com ícones personalizados (Frutas, Verduras, Legumes, Grãos) e mecanismo de busca dinâmico em tempo real.
- **Venda Flexível (KG/UNI/MISTA)**: Suporte dinâmico para compras fracionadas por quilo, unidade ou ambos. 
- **Modo Negociável**: Quando o produto admite formato misto e o cliente opta por comprar por unidades soltas, o sistema exibe de forma clara o aviso **"Valor a negociar"** e as unidades adicionadas no carrinho entram como orçamento, mantendo total clareza.
- **Controle de Quantidade Simplificado**: O carrinho gerencia todas as quantidades de **1 em 1** (ex: 1 kg, 2 kg, ... ou 1 un, 2 un, ...), prevenindo confusões de frações e unificando a experiência da balança.
- **Carrinho de Compras Interativo**: Carrinho expansível com animações suaves via `motion`, permitindo ajustes rápidos e cálculo automático de subtotais.
- **Checkout com WhatsApp**: Integração perfeita de envio de pedido. Ao fechar a compra, o cliente envia uma mensagem organizada automaticamente ao atendente do WhatsApp de forma limpa, discriminando produtos, o subtotal estimado de itens pesados, e detalhando os itens cujo valor é a negociar.

### Para Administradores:
- **Painel Administrativo Embutido**: Gerenciamento de estoque completo com proteção básica de segurança para novos produtos e novas categorias.
- **Gerenciador de Categorias**: Criação ou remoção ágil de categorias com suporte a seleções de emojis.
- **Formulário de Produtos Completo**: Adicione ou edite produtos, definindo preços por KG ou UNI, tipos de venda autorizados, descrição do item e imagem.

---

## 🎨 Decisão e Identidade Visual

- **Paleta de Criação**: Baseada em tons orgânicos de verde floresta (`#176c33`), suaves off-white de fundo (`#f7fbf2`) e tons refinados de terracota/laranja (`#a5521b`) para avisos e informações de itens a negociar.
- **Tipografia**: Interface construída usando fontes geométricas com excelente espaçamento tipográfico e arranjos hierárquicos para o máximo de legibilidade de nomes de frutas e preços.
- **Espaçamento e Layout**: Design móvel-primeiro balanceado com visual bento e grids expansivos em telas desktop, evitando estiramentos indesejados e mantendo o foco do usuário nos produtos.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite** para empacotamento rápido e servidor de desenvolvimento otimizado
- **Tailwind CSS v4** para uma folha de estilos rápida, moderna e utilitária
- **Motion (framer-motion)** para efeitos de transição refinados de visualização, animações de entrada e interações de botões
- **Lucide React** para iconografia consistente e representativa

---

## 🚀 Como Iniciar o Projeto Localmente

Siga os passos abaixo após clonar ou exportar este projeto do seu GitHub:

### 1. Pré-requisitos
Certifique-se de que tem o [Node.js](https://nodejs.org/) instalado na sua máquina (recomendado v18 ou superior).

### 2. Instalar Dependências
Navegue até a pasta do projeto e instale todos os pacotes necessários:
```bash
npm install
```

### 3. Rodar o Servidor de Desenvolvimento
Inicie o Vite localmente para testar a aplicação em seu navegador:
```bash
npm run dev
```
O console exibirá o endereço local (geralmente `http://localhost:3000` ou `http://localhost:5173`).

### 4. Compilar para Produção (Build)
Gere os arquivos estáticos altamente otimizados na pasta `dist/` para realizar o deploy em plataformas de hospedagem (como GitHub Pages, Vercel, Netlify, ou Cloud Run):
```bash
npm run build
```

---

## 📦 Como Hospedar no GitHub Pages

Se desejar hospedar este site estático de graça através do **GitHub Pages**, siga estes breves passos adicionais:

1. Instale a dependência de deploy do GitHub Pages no projeto:
   ```bash
   npm install --save-dev gh-pages
   ```
2. No seu arquivo `vite.config.ts`, adicione a propriedade `base` baseada no nome do seu repositório:
   ```typescript
   export default defineConfig({
     base: '/nome-do-seu-repositorio/',
     // ... restante das configurações
   })
   ```
3. No arquivo `package.json`, adicione os seguintes scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Execute o deploy de maneira automática:
   ```bash
   npm run deploy
   ```

---

## 📄 Licença
Este projeto é de uso livre para estudos, personalizações e comercialização local de mercados e feirantes. Sinta-se gratuito para contribuir com commits e novas expansões!
