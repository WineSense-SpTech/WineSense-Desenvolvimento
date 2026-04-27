-- Banco de dados wineSense
CREATE DATABASE wineSense;
USE wineSense;
CREATE TABLE endereco (
	idEndereco INT PRIMARY KEY AUTO_INCREMENT,
	CEP CHAR(8) NOT NULL,
	numero INT,
	cidade VARCHAR (40),
	estado VARCHAR (30)
);

CREATE TABLE uva(
	idUva INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(20) NOT NULL
);

-- Tabela para guardar os dados do sensor, como em que tanque ele está localizado na empresa contratante
CREATE TABLE sensor(
	idSensor INT PRIMARY KEY AUTO_INCREMENT,
	nomeTanque VARCHAR(20) NOT NULL,
	codSensor INT NOT NULL,
	condicao VARCHAR(20) NOT NULL,
	CONSTRAINT condicaoC CHECK(condicao IN ('Funcionando', 'Defeituoso'))
);

-- Tabela para guardar os dados dos tipos de vinho produzidos pela empresa
CREATE TABLE vinho(
	idVinho INT PRIMARY KEY AUTO_INCREMENT,
	fkUva INT, 
	FOREIGN KEY (fkUva) REFERENCES uva(idUva),
	tipoVinho VARCHAR(20) NOT NULL,
	tempMinima INT NOT NULL,
	tempMaxima INT NOT NULL,
	CONSTRAINT cTipo CHECK (tipoVinho IN('Branco', 'Tinto'))
);

-- Tabela empresa para guardar os dados da empresa cliente do sistema
CREATE TABLE empresa(
	idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
	razaoSocial VARCHAR(50) NOT NULL,
	telefone VARCHAR(20),
	fkEndereco INT,
    CONSTRAINT cFkEndereco FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco)
);

-- Tabela usuário que vai guardar os dados de acesso do usuário que vai acessar o banco/ dashboard
CREATE TABLE usuario(
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(40) NOT NULL,
	sobrenome VARCHAR(40) NOT NULL,
	email VARCHAR(60) NOT NULL UNIQUE,
	telefone VARCHAR(20),
	senha VARCHAR(20) NOT NULL,
    fkEmpresa INT,
    CONSTRAINT cFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE tanque(
	idTanque INT PRIMARY KEY AUTO_INCREMENT,
    codTanque VARCHAR(30) NOT NULL,
    localTanque VARCHAR (50),
    fkSensor INT,
	FOREIGN KEY (fkSensor) REFERENCES sensor (idSensor),
    fkVinho INT,
    CONSTRAINT cFkVinho FOREIGN KEY (fkVinho) REFERENCES vinho (idVinho),
    fkEmpresa INT, 
	CONSTRAINT ctFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (idEmpresa)
);

-- Tabela para armazenar os registros feitos pelo sensor
CREATE TABLE registro(
	idRegistro INT PRIMARY KEY AUTO_INCREMENT,
	dataHora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	temperatura DECIMAL(5, 2) NOT NULL,
    fkSensor INT,
    CONSTRAINT cFkSensor FOREIGN KEY (fkSensor) REFERENCES sensor (idSensor)
);

-- INSERTS 
INSERT INTO endereco (CEP, numero, cidade, estado) VALUES
('02223000',45, 'São Paulo', 'SP'),
('01123560', 60, 'Ribeirão Preto', 'SP'),
('01123000',40, 'Campinas', 'SP'),
('06623560', 6, 'Santana', 'SP');

INSERT INTO empresa(razaoSocial, telefone, fkEndereco) VALUES
('Wine', '5511987614523', 2),
('Reservado', '5511977014235',1),
('Bourbon','5511933614523', 3),
('Carbenet', '5511954014235',4);

INSERT INTO usuario(nome, sobrenome, email, telefone, senha, fkEmpresa) VALUES
('Carolina', 'Soares', 'carol.soares@gmail.com', '5511993114452', '123456',1),
('Julia', 'Araripe', 'julia.araripe@gmail.com', '5511993116682', '123555',2),
('Carlos', 'Sanches', 'carlos.sanches@gmail.com', '5511992214452', '445566',3),
('Jonas', 'Bastos', 'jonas.bastos@gmail.com', '5511945116682', '112233',4);

INSERT INTO uva(nome) VALUES
('Malbec'),('Cabernet'),('Rosada'),('Bourbon');

INSERT INTO vinho(fkUva, tipoVinho, tempMinima, tempMaxima) VALUES
(1, 'Tinto', 13, 15),(2, 'Tinto', 8, 14),
(3, 'Branco', 10, 20),(4, 'Branco', 9, 13);

INSERT INTO sensor (nomeTanque,codSensor,condicao) VALUES
('Tanque A24', '004', 'Funcionando'),
('Tanque A24', '014', 'Funcionando'),
('Tanque mil', '002', 'Defeituoso'),
('Tanque 0300', '003', 'Funcionando');

INSERT INTO tanque(codTanque,localTanque,fkSensor ,fkVinho,fkEmpresa) VALUES
('001', 'Rua do vinho 554', 1, 1, 1),
('002', 'Rua da uva 54', 2, 2, 2),
('003', 'Rua do estrado 5', 3, 3, 3),
('004', 'Rua tosca 44', 4, 4, 4);

INSERT INTO registro(temperatura,fkSensor) VALUES 
(14.5,1),
(10.5,2),
(14.5,3),
(10.5,4);

-- SELECTS 

-- Ver temperatura registrada por sensor, Base de gráficos em tempo real
SELECT s.idSensor AS 'Sensor', s.nomeTanque AS 'Nome', s.codSensor AS 'Código', r.dataHora
FROM sensor s
JOIN registro r 
ON s.idSensor = r.fkSensor;

-- selecionar tipo de vinho 
SELECT 
    fkUva AS 'Tipo uva',
    CASE 
        WHEN tipoVinho = 'Tinto' THEN 'Vinho Tinto'
        WHEN tipoVinho = 'Branco' THEN 'Vinho Branco'
    END AS 'Categoria'
FROM vinho;

-- Detectar temperatura fora do ideal
SELECT 
	idRegistro AS Registro, 
	nomeTanque AS 'Nome Tanque', 
	dataHora, 
	temperatura,
	CASE 
		WHEN r.temperatura BETWEEN v.tempMinima AND v.tempMaxima 
		THEN 'Ideal'
		ELSE 'Alerta'
	END AS 'Status'	
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN tanque t ON s.idSensor = t.fkSensor
JOIN vinho v ON t.fkVinho = v.idVinho
JOIN empresa e ON t.fkEmpresa = e.idEmpresa;

-- Qual empresa é dona de cada tanque
SELECT t.codTanque AS Codigo, e.razaoSocial AS Empresa
FROM tanque t
JOIN empresa e 
ON t.fkEmpresa = e.idEmpresa;

-- Monitoramento geral da fermentação
SELECT 
	e.razaoSocial AS Empresa, 
	t.codTanque AS Codigo, 
	v.tipoVinho AS Tipo, 
	s.codSensor AS 'Cod Sensor', 
	r.temperatura, 
	v.tempMinima, 
	v.tempMaxima, 
	r.dataHora
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN tanque t ON s.idSensor = t.fkSensor
JOIN vinho v ON t.fkVinho = v.idVinho
JOIN empresa e ON t.fkEmpresa = e.idEmpresa;