// importa os bibliotecas necessários
const serialport = require('serialport');
const express = require('express');
const mysql = require('mysql2');

// constantes para configurações
const SERIAL_BAUD_RATE = 9600;
const SERVIDOR_PORTA = 3300;

// habilita ou desabilita a inserção de dados no banco de dados
const HABILITAR_OPERACAO_INSERIR = true;

// função para comunicação serial
const serial = async (
    valoresSensorTemp,
    // valoresSensorDigital,
) => {

    // conexão com o banco de dados MySQL
    let poolBancoDados = mysql.createPool(
        {
            host: 'localhost',
            user: 'usuarioInsert',
            password: 'Winesense#2026',
            database: 'wineSense',
            port: 3307
        }
    ).promise();

    // lista as portas seriais disponíveis e procura pelo Arduino
    const portas = await serialport.SerialPort.list();
    const portaArduino = portas.find((porta) => porta.vendorId == 2341 && porta.productId == 43);
    if (!portaArduino) {
        throw new Error('O arduino não foi encontrado em nenhuma porta serial');
    }

    // configura a porta serial com o baud rate especificado
    const arduino = new serialport.SerialPort(
        {
            path: portaArduino.path,
            baudRate: SERIAL_BAUD_RATE
        }
    );

    // evento quando a porta serial é aberta
    arduino.on('open', () => {
        console.log(`A leitura do arduino foi iniciada na porta ${portaArduino.path} utilizando Baud Rate de ${SERIAL_BAUD_RATE}`);
    });

    // processa os dados recebidos do Arduino
    // processa os dados recebidos do Arduino
    arduino.pipe(new serialport.ReadlineParser({ delimiter: '\r\n' })).on('data', async (data) => {
        console.log(data);
        const valores = data.split(';');
        const sensorTemp = parseFloat(valores[0]);
        // const sensorAnalogico = parseFloat(valores[1]);

        // armazena os valores dos sensores nos arrays correspondentes
        valoresSensorTemp.push(sensorTemp);
        //valoresSensorDigital.push(sensorDigital);

        // insere os dados no banco de dados (se habilitado)
        if (HABILITAR_OPERACAO_INSERIR) {
            const tempOriginal = Number(sensorTemp);

            // Definição das variações calibradas para os 26 sensores
            const variacoes = [
                { fkSensor: 1, valor: tempOriginal },
                { fkSensor: 2, valor: tempOriginal + 0.5 },
                { fkSensor: 3, valor: tempOriginal - 0.8 },
                { fkSensor: 4, valor: tempOriginal + 2.1 },
                { fkSensor: 5, valor: tempOriginal - 1.5 },
                { fkSensor: 6, valor: tempOriginal + 0.2 },
                { fkSensor: 7, valor: tempOriginal + 5.5 },
                { fkSensor: 8, valor: tempOriginal - 3.2 },
                { fkSensor: 9, valor: tempOriginal + 1.2 },
                { fkSensor: 10, valor: tempOriginal - 0.4 },
                { fkSensor: 11, valor: tempOriginal + 2.8 },
                { fkSensor: 12, valor: tempOriginal - 0.1 },
                { fkSensor: 13, valor: tempOriginal + 1.7 },
                { fkSensor: 14, valor: tempOriginal - 2.5 },
                { fkSensor: 15, valor: tempOriginal + 0.9 },
                { fkSensor: 16, valor: tempOriginal + 4.2 },
                { fkSensor: 17, valor: tempOriginal - 0.7 },
                { fkSensor: 18, valor: tempOriginal + 0.3 },
                { fkSensor: 19, valor: tempOriginal + 2.6 },
                { fkSensor: 20, valor: tempOriginal - 1.1 },
                { fkSensor: 21, valor: tempOriginal * 1.05 },
                { fkSensor: 22, valor: tempOriginal - 3.5 },
                { fkSensor: 23, valor: tempOriginal + 1.1 },
                { fkSensor: 24, valor: tempOriginal - 0.2 },
                { fkSensor: 25, valor: tempOriginal + 4.8 },
                { fkSensor: 26, valor: tempOriginal }
            ];

            // Executa as inserções em lote para os 26 sensores simulados
            variacoes.forEach(v => {
                poolBancoDados.query(
                    'INSERT INTO registro (temperatura, fkSensor) VALUES (?, ?)',
                    [v.valor.toFixed(2), v.fkSensor]
                ).then(() => {
                    console.log(`Sucesso: Sensor ${v.fkSensor} populado com valor ${v.valor.toFixed(2)}`);
                }).catch(err => {
                    console.error(`Erro ao inserir simulado do Sensor ${v.fkSensor}:`, err);
                });
            });
        }

    });

    // evento para lidar com erros na comunicação serial
    arduino.on('error', (mensagem) => {
        console.error(`Erro no arduino (Mensagem: ${mensagem}`)
    });
}

// função para criar e configurar o servidor web
const servidor = (
    valoresSensorTemp,
) => {
    const app = express();

    // configurações de requisição e resposta
    app.use((request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
        next();
    });

    // inicia o servidor na porta especificada
    app.listen(SERVIDOR_PORTA, () => {
        console.log(`API executada com sucesso na porta ${SERVIDOR_PORTA}`);
    });

    // define os endpoints da API para cada tipo de sensor
    app.get('/sensores/temperatura', (_, response) => {
        return response.json(valoresSensorTemp);
    });

}

// função principal assíncrona para iniciar a comunicação serial e o servidor web
(async () => {
    // arrays para armazenar os valores dos sensores
    const valoresSensorTemp = [];

    // inicia a comunicação serial
    await serial(
        valoresSensorTemp
    );

    // inicia o servidor web
    servidor(
        valoresSensorTemp
    );
})();