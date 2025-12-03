const Values = require('./src/models/Values')
const connection = require('./src/database/index')

const valuesData = [
    {
        description: "Acréscimo Frente e Verso",
        value: 0.02,
        start_date: Date.now(),
        end_date: null
    },
    {
        description: "Preço de Encadernação",
        value: 4.50,
        start_date: Date.now(),
        end_date: null
    },
    {
        description: "Preço base P&B",
        value: 0.19,
        start_date: Date.now(),
        end_date: null
    },
    {
        description: "Acréscimo Colorido",
        value: 0.37,
        start_date: Date.now(),
        end_date: null
    }
];

async function seedValues() {
    try {
        await connection.sync();
        console.log("Banco de dados sincronizado.");
        const count = await Values.count();
        if (count > 0) {
            console.log(`A tabela 'values' já tem ${count} registros. Pulando o seed.`);
            return;
        }

        await Values.bulkCreate(valuesData);
        console.log(`✅ ${valuesData.length} valores inseridos com sucesso!`);

    } catch (error) {
        console.error("❌ Erro ao executar o seed de values:", error);
    } finally {
        await connection.close();
        console.log("Conexão com o banco de dados fechada.");
    }
}

seedValues();