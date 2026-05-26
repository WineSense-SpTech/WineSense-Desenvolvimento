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
    tipoVinho VARCHAR(20) NOT NULL,
    tempMinima INT NOT NULL,
    tempMaxima INT NOT NULL,
    CONSTRAINT cTipo CHECK (tipoVinho IN('Branco', 'Tinto'))
);

-- Tabela associativa entre vinho e uva (relação N:N)
CREATE TABLE receitaVinho(
    idReceitaVinho INT PRIMARY KEY AUTO_INCREMENT,
    idVinhoUva INT NOT NULL,
    fkVinho INT NOT NULL,
    FOREIGN KEY (idVinhoUva) REFERENCES uva(idUva),
    FOREIGN KEY (fkVinho) REFERENCES vinho(idVinho)
);

-- Tabela de grupos de empresas
CREATE TABLE grupoEmpresa(
    codGrupo CHAR(5) PRIMARY KEY,
    nomeGrupo VARCHAR(50) NOT NULL
);

-- Tabela empresa para guardar os dados da empresa cliente do sistema
CREATE TABLE empresa(
    codEmpresa CHAR(5) PRIMARY KEY,
    razaoSocial VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    fkEndereco INT,
    fkGrupo CHAR(5),
    CONSTRAINT cFkEndereco FOREIGN KEY (fkEndereco) REFERENCES endereco(idEndereco),
    CONSTRAINT cFkGrupo FOREIGN KEY (fkGrupo) REFERENCES grupoEmpresa(codGrupo)
);

-- Tabela usuário que vai guardar os dados de acesso do usuário que vai acessar o banco/ dashboard
CREATE TABLE usuario(
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100),
    Email VARCHAR(60) NOT NULL UNIQUE,
    senha VARCHAR(20) NOT NULL,
    cargo VARCHAR(45),
    fkEmpresa CHAR(5),
    fkGrupo CHAR(5),
    CONSTRAINT cFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(codEmpresa),
    CONSTRAINT cFkGrupoUsr FOREIGN KEY (fkGrupo) REFERENCES grupoEmpresa(codGrupo)
);

CREATE TABLE tanque(
    idTanque INT PRIMARY KEY AUTO_INCREMENT,
    codTanque VARCHAR(30) NOT NULL,
    localTanque VARCHAR (50),
    fkSensor INT,
    FOREIGN KEY (fkSensor) REFERENCES sensor (idSensor),
    fkVinho INT,
    CONSTRAINT cFkVinho FOREIGN KEY (fkVinho) REFERENCES vinho (idVinho),
    fkEmpresa CHAR(5),
    CONSTRAINT ctFkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa (codEmpresa)
);

-- Tabela para armazenar os registros feitos pelo sensor
CREATE TABLE registro(
    idRegistro INT PRIMARY KEY AUTO_INCREMENT,
    dataHora DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    temperatura DECIMAL(5, 2) NOT NULL,
    fkSensor INT,
    CONSTRAINT cFkSensor FOREIGN KEY (fkSensor) REFERENCES sensor (idSensor)
);

-- Tabela para armazenar os alertas gerados a partir dos registros
CREATE TABLE alerta(
    idAlerta INT PRIMARY KEY AUTO_INCREMENT,
    fkRegistro INT NOT NULL,
    tipoAlerta VARCHAR(45) NOT NULL,
    CONSTRAINT cFkRegistro FOREIGN KEY (fkRegistro) REFERENCES registro(idRegistro)
);

-- INSERTS
INSERT INTO endereco (CEP, numero, cidade, estado) VALUES
('02223000', 45, 'São Paulo', 'SP'),
('01123560', 60, 'Ribeirão Preto', 'SP'),
('01123000', 40, 'Campinas', 'SP'),
('06623560', 6, 'Santana', 'SP');

INSERT INTO grupoEmpresa (codGrupo, nomeGrupo) VALUES
('GRP01', 'Grupo Sul'),
('GRP02', 'Grupo Norte');

INSERT INTO empresa (codEmpresa, razaoSocial, telefone, fkEndereco, fkGrupo) VALUES
('AB123', 'Wine', '5511987614523', 2, 'GRP01'),
('CD456', 'Reservado', '5511977014235', 1, 'GRP01'),
('EF789', 'Bourbon', '5511933614523', 3, 'GRP02'),
('CCO01', 'Carbenet', '5511954014235', 4, 'GRP02');

INSERT INTO usuario (nome, sobrenome, Email, senha, cargo, fkEmpresa, fkGrupo) VALUES
('Carolina', 'Soares', 'carol.soares@gmail.com', '123456', 'adm', 'AB123', 'GRP01'),
('Julia', 'Araripe', 'julia.araripe@gmail.com', '123555', 'usuario', 'CD456', 'GRP01'),
('Carlos', 'Sanches', 'carlos.sanches@gmail.com', '445566', 'adm', 'EF789', 'GRP02'),
('Jonas', 'Bastos', 'jonas.bastos@gmail.com', '112233', 'usuario', 'CCO01', 'GRP02');

INSERT INTO uva (nome) VALUES
('Malbec'), ('Cabernet'), ('Rosada'), ('Bourbon');

INSERT INTO vinho (tipoVinho, tempMinima, tempMaxima) VALUES
('Tinto', 13, 15),
('Tinto', 8, 14),
('Branco', 10, 20),
('Branco', 9, 13);

INSERT INTO receitaVinho (idVinhoUva, fkVinho) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

INSERT INTO sensor (nomeTanque, codSensor, condicao) VALUES
('Tanque A24', '004', 'Funcionando'),
('Tanque A24', '014', 'Funcionando'),
('Tanque mil', '002', 'Defeituoso'),
('Tanque 0300', '003', 'Funcionando');

INSERT INTO tanque (codTanque, localTanque, fkSensor, fkVinho, fkEmpresa) VALUES
('001', 'Rua do vinho 554', 1, 1, 'AB123'),
('002', 'Rua da uva 54', 2, 2, 'CD456'),
('003', 'Rua do estrado 5', 3, 3, 'EF789'),
('004', 'Rua tosca 44', 4, 4, 'CCO01');

INSERT INTO registro (temperatura, fkSensor) VALUES
(14.5, 1),
(10.5, 2),
(14.5, 3),
(10.5, 4);

INSERT INTO alerta (fkRegistro, tipoAlerta) VALUES
(3, 'Temperatura acima do limite'),
(4, 'Sensor defeituoso');

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
	u.nome as uva,
	r.temperatura, 
	v.tempMinima, 
	v.tempMaxima, 
	r.dataHora
FROM registro r
JOIN sensor s ON r.fkSensor = s.idSensor
JOIN tanque t ON s.idSensor = t.fkSensor
JOIN vinho v ON t.fkVinho = v.idVinho
JOIN uva u ON v.fkUva = u.idUva
JOIN empresa e ON t.fkEmpresa = e.idEmpresa;