# 🍷 WineSense — Repositório de Desenvolvimento

![STATUS CONCLUÍDO](https://img.shields.io/badge/Status-Concluído-orange?style=for-the-badge)
![INSTITUIÇÃO SPTECH SCHOOL](https://img.shields.io/badge/Institui%C3%A7%C3%A3o-SPTech%20School-blue?style=for-the-badge)

O **WineSense** é uma solução baseada em IoT para monitoramento da temperatura durante o processo de fermentação do vinho.

Este repositório contém a **implementação técnica do projeto**, incluindo sensores, banco de dados, APIs, dashboards e demais componentes necessários para o funcionamento da solução.

---

## 🚀 Visão Geral do Sistema

O sistema realiza:

- Coleta de dados via sensor de temperatura  
- Envio e armazenamento dos dados  
- Processamento e análise  
- Exibição em dashboard  
- Geração de alertas  

---

## 🧠 Arquitetura da Solução

A solução é composta por:

- Dispositivo IoT (Arduino + sensor)
- API de ingestão de dados  
- Banco de dados relacional  
- API de aplicação  
- Dashboard web  
- Site institucional  

---

## 📦 Entregas por Disciplina

### 💻 Algoritmos

- Site Estático Institucional  
  - HTML, CSS e JavaScript  
  - Estrutura com reaproveitamento de componentes  

- Site Estático Dashboard  
  - Visualização de dados com gráficos (Chart.js)  

- Sistema de Cadastro e Login  
  - Interface estática para autenticação de usuários  

---

### 🧩 Tecnologia da Informação

- Diagrama de Solução  
  - Arquitetura técnica do projeto  

- Gestão de Projeto  
  - Organização por Sprints  
  - Controle de atividades  

- Backlog da Sprint  
  - Demandas priorizadas  
  - Pontuação e organização  

---

### 🗄️ Banco de Dados

- Modelagem Lógica (v1)  
- Estrutura relacional do sistema  

- Scripts SQL  
  - Criação do banco  
  - Criação de tabelas  
  - Execução em ambiente local  

---

### ⚙️ Arquitetura Computacional

- Integração Sensor + Sistema  
  - Leitura de dados do sensor  

- Simulação com gráficos  
  - Representação dos dados coletados  

- Comunicação com API local  

---

### 🖥️ Sistemas Operacionais

- Configuração de ambiente Linux (VM)  

- Instalação do MySQL  
  - Banco de dados da aplicação  

- Integração Arduino → MySQL  

- Validação da solução técnica  
  - Testes completos do sistema  
  - Validação da arquitetura  

---

## 🔧 Tecnologias Utilizadas

### ![Arduino Uno](https://img.shields.io/badge/Arduino_Uno-00979C?style=for-the-badge&logo=arduino&logoColor=white) ![Sensor LM35](https://img.shields.io/badge/Sensor_LM35-4B4B4B?style=for-the-badge&logo=microchip&logoColor=white)
### ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
### ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![VirtualBox](https://img.shields.io/badge/VirtualBox-183D61?style=for-the-badge&logo=virtualbox&logoColor=white)

---

## ▶️ Manual de Instalação

### 1. Clonar o repositório ou fazer o download do .zip do projeto

```bash
git clone https://github.com/seu-repositorio/winesense-dev.git
```

---

### 2. Executar o banco de dados

- Abrir a VM Linux com as seguintes configurações de portas:
  - 3307 - 3306
  - 2222 - 22
- Tenha Banco de Dados MySQL instalado na VM
- Executar Scripts de Criação do Banco de Dados disponível no Repositório no MySQL da VM

---

### 3. Rodar o Arduino

- Montar o Arduíno com o sensor de temperatura LM32
- Abrir o código `.ino` do repositório na IDE
- Verifique no arquivo `sensor-temperatura\grafico\mains.js` as configurações do Banco de Dados
- Conectar o sensor numa das portas USB
- Iniciar leitura dos dados atravéz da API `data-aqu-ino` e exeutar no Terminal os comandos `npm i` e `npm start` 

---

### 4. Ligar a API que suporta o site

- Entrar no repositório `web-data-viz`
- Verifique ou Crie o arquivo `.env` e `.env.dev` para ver se o Banco de Dados MySQL e as Portas estão configurados
- Executar os comando no Terminal `npm i` e `npm start`

### 5. Rodar o site e usar

- Abrir o navegador e cole a URL: `localhost:3333`
- Explore o site com a navegação em "NavBar"

---

## 📊 Funcionalidades

- Cadastro de usuários  
- Cadastro de empresas e vinhos  
- Monitoramento de temperatura  
- Dashboard com gráficos  
- Alertas em tempo real  
- Histórico de dados  

---

## 🚫 Limitações

- Monitoramento apenas de temperatura  
- Não realiza controle automático  
- Integração limitada ao ambiente local  

---

## 👥 Equipe

- Enzo Basseto Martelozzo
- Guilherme Gonçalves Britto
- Jonatas Pereira Teles 
- Marcos Paulos de Carvalho Ribeiro  
- Marina Santos Paixão Ribeiro  
- Rafael de Campos Naleto Filho  

---

## 📌 Observações

Este repositório é destinado ao desenvolvimento e testes da solução, podendo sofrer alterações frequentes conforme evolução do projeto.
