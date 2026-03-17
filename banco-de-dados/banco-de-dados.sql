-- Banco de dados wineSense
CREATE DATABASE wineSense;
USE wineSense;

-- Tabela usuário que vai guardar os dados de acesso do usuário que vai acessar o banco/ dashboard
CREATE TABLE usuario(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(40) NOT NULL,
sobrenome VARCHAR(40) NOT NULL,
email VARCHAR(60) NOT NULL UNIQUE,
telefone VARCHAR(20),
senha VARCHAR(20) NOT NULL
);

-- Tabela empresa para guardar os dados da empresa cliente do sistema
CREATE TABLE empresa(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(50) NOT NULL,
email VARCHAR(60) UNIQUE,
telefone VARCHAR(20),
endereco Varchar(40)
);

-- Tabela para guardar os dados dos tipos de vinho produzidos pela empresa
CREATE TABLE vinho(
id INT PRIMARY KEY AUTO_INCREMENT,
tipoUva VARCHAR(50) NOT NULL,
tipoVinho VARCHAR(20) NOT NULL,
tempMinima INT,
tempMaxima INT,
CONSTRAINT cTipo CHECK (tipoVinho IN('Branco', 'Tinto'))
);


CREATE TABLE uva(
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(20),
tempMinima INT,
tempMaxima INT
);


-- Tabela para guardar os dados do sensor, como em que tanque ele está localizado na empresa contratante
CREATE TABLE sensor(
id INT PRIMARY KEY AUTO_INCREMENT,
tanqueLocalizado VARCHAR(20) NOT NULL
);

-- Tabela para armazenar os registros feitos pelo sensor
CREATE TABLE registro(
id INT PRIMARY KEY AUTO_INCREMENT,
data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
temperatura DECIMAL(5, 2) NOT NULL
);


INSERT INTO usuario(nome, sobrenome, email, telefone, senha) VALUES
('Carolina', 'Soares', 'carol.soares@gmail.com', '5511993114452', '123456');

INSERT INTO empresa(nome, email, telefone, endereco) VALUES
('Wine', 'wine@gmail.com', '5511987614523', 'Brasil', 'São Paulo', 'Campinas', 'Rua do Vinho', 567);

INSERT INTO vinho(tipoUva, tipoVinho, tempMinima, tempMaxima) VALUES
('Malbec', 'Tinto', 12, 16);

INSERT INTO uva(nome, tempMinima, tempMaxima) VALUES
('Malbec', 12, 16);

INSERT INTO sensor (tanqueLocalizado) VALUE('Tanque A24');

INSERT INTO registro(temperatura) VALUES 
(14.4);

SELECT * FROM vinho WHERE tipoVinho = 'Tinto';

SELECT * FROM empresa WHERE nomeEstado = 'São Paulo';

SELECT 
    tipoUva AS 'Uva',
    CASE 
        WHEN tipoVinho = 'Tinto' THEN 'Vinho Tinto'
        WHEN tipoVinho = 'Branco' THEN 'Vinho Branco'
    END AS 'Categoria'
FROM vinho;

SELECT data_hora, temperatura 
FROM registro 
ORDER BY data_hora DESC;






