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

            // Definição das variações calibradas para os 26 sensores oficiais
            const variacoes = [
                // ====== SÃO PAULO (Sensores 1 ao 11) ======
                { fkSensor: 1, valor: tempOriginal },               // SP-T01: Temperatura Normal (~14.0°C)
                { fkSensor: 2, valor: tempOriginal + 0.5 },         // SP-T02: Variação sutil (~14.5°C)
                { fkSensor: 3, valor: tempOriginal - 0.8 },         // SP-T03: Estável frio (~13.2°C)
                { fkSensor: 4, valor: tempOriginal + 2.1 },         // SP-T04: Atenção Quente (~16.1°C)
                { fkSensor: 5, valor: tempOriginal - 1.5 },         // SP-T05: Estável frio (~12.5°C)
                { fkSensor: 6, valor: tempOriginal + 0.2 },         // SP-T06: Temperatura Normal (~14.2°C)
                { fkSensor: 7, valor: tempOriginal + 5.5 },         // SP-T07: CRÍTICO QUENTE / DEFEITUOSO (~19.5°C)
                { fkSensor: 8, valor: tempOriginal - 3.2 },         // SP-T08: Alerta Frio (~10.8°C)
                { fkSensor: 9, valor: tempOriginal + 1.2 },         // SP-T09: Estável alto (~15.2°C)
                { fkSensor: 10, valor: tempOriginal - 0.4 },        // SP-T10: Temperatura Normal (~13.6°C)
                { fkSensor: 11, valor: tempOriginal + 2.8 },        // SP-T11: Atenção Quente (~16.8°C)

                // ====== CAMPINAS (Sensores 12 ao 17) ======
                { fkSensor: 12, valor: tempOriginal - 0.1 },        // CP-T01: Temperatura Normal (~13.9°C)
                { fkSensor: 13, valor: tempOriginal + 1.7 },        // CP-T02: Estável alto (~15.7°C)
                { fkSensor: 14, valor: tempOriginal - 2.5 },        // CP-T03: Alerta Frio (~11.5°C)
                { fkSensor: 15, valor: tempOriginal + 0.9 },        // CP-T04: Temperatura Normal (~14.9°C)
                { fkSensor: 16, valor: tempOriginal + 4.2 },        // CP-T05: CRÍTICO QUENTE (~18.2°C)
                { fkSensor: 17, valor: tempOriginal - 0.7 },        // CP-T06: Estável frio (~13.3°C)

                // ====== RIO DE JANEIRO (Sensores 18 ao 26) ======
                { fkSensor: 18, valor: tempOriginal + 0.3 },        // RJ-T01: Temperatura Normal (~14.3°C)
                { fkSensor: 19, valor: tempOriginal + 2.6 },        // RJ-T02: Atenção Quente (~16.6°C)
                { fkSensor: 20, valor: tempOriginal - 1.1 },        // RJ-T03: Estável frio (~12.9°C)
                { fkSensor: 21, valor: tempOriginal * 1.05 },       // RJ-T04: Variação percentual (~14.7°C)
                { fkSensor: 22, valor: tempOriginal - 3.5 },        // RJ-T05: CRÍTICO FRIO (~10.5°C)
                { fkSensor: 23, valor: tempOriginal + 1.1 },        // RJ-T06: Temperatura Normal (~15.1°C)
                { fkSensor: 24, valor: tempOriginal - 0.2 },        // RJ-T07: Estável frio (~13.8°C)
                { fkSensor: 25, valor: tempOriginal + 4.8 },        // RJ-T08: CRÍTICO QUENTE (~18.8°C)
                { fkSensor: 26, valor: tempOriginal }               // RJ-T09: Temperatura Normal (~14.0°C)
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