# WineSense — Sensor de Temperatura na Fermentação de Vinho

O WineSense é uma solução baseada em IoT para monitoramento contínuo da temperatura durante o processo de fermentação vinícola. O sistema utiliza sensores térmicos integrados a uma plataforma web, permitindo identificar rapidamente qualquer desvio no controle térmico e realizar intervenções imediatas, reduzindo perdas e garantindo a qualidade do vinho.

### 📊 Diagrama de Visão de Negócio

<img src="diagramas\visao-de-negocio\diagrama-negocio-winesense.png" width="500"/>

## 💻 Site Institucional
<div align="center">
  <img src="site-institucional\home.png" width="500"/>
  <img src="site-institucional\sobre.png" width="500"/>
  <img src="site-institucional\simulador.png" width="500"/>
</div>


## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.


### 📋 Pré-requisitos

- Arduino Uno
- Sensor de temperatura LM35
- Arduino IDE instalada
- Navegador web moderno (para o simulador financeiro)

```
Arduino IDE: https://docs.arduino.cc/software/ide/
```

### 🔧 Instalação

**1. Clone o repositório:**

```
git clone https://github.com/isacardosods/WineSense.git
```

**2. Abra o código do Arduino na IDE:**

```
Arquivo > Abrir > sensor-temperatura.ino
```

**3. Conecte o LM35 ao Arduino Uno:**

```
Pino esquerdo (VCC) → 5V
Pino do meio (Vout) → A0
Pino direito (GND) → GND
```

**4. Abra o simulador financeiro no navegador:**

```
Abrir o arquivo: simulador-financeiro/simuladorFinanceiro.html diretamente no navegador
```

**5. Abra e execute o arquivo SQL no MySQL:**

```
Abrir o arquivo: banco-de-dados\BD-Sprint1-final.sql no MySQL
```

## 🛠️ Construído com

* Arduino Uno — Plataforma de prototipagem eletrônica
* LM35 — Sensor de temperatura analógico
* [Arduino IDE](https://docs.arduino.cc/software/ide/) — Ambiente de desenvolvimento
* HTML/CSS/JavaScript — Simulador financeiro web
* [MySQL](https://dev.mysql.com) — Banco de dados

## ✒️ Autores

* **Ana Clara Ferreira Clarete**
* **Beatriz Mustafa Ferreira**
* **Emanuelly Cristini Alves de Melo**
* **Fernanda Rodrigues Leal**
* **Isabella Cardoso dos Santos** 
* **Sarah Tiemi Sato**
* **Thays Ramos da Silva Delfino**

## 📚 Fontes e Referências

* OIV — Organização Internacional da Vinha e do Vinho: https://www.oiv.int
* UC Davis — Problem Fermentations: https://wineserver.ucdavis.edu
* Wikipedia — Fermentation in Winemaking: https://en.wikipedia.org/wiki/Fermentation_in_winemaking
* Embrapa Uva e Vinho: https://www.embrapa.br/uva-e-vinho
* Carla Lopes André et al. — Implantação de Sistema IoT para Monitoramento da Temperatura do Processo de Fermentação em uma Vitivinícola Instalada no Vale do São Francisco. Revista de Engenharia e Pesquisa Aplicada, v.9, n.3, 2024.