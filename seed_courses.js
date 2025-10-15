const Course = require('./src/models/Courses');
const connection = require('./src/database/index')

const coursesData = [
    {
        title: "Algoritmos e Estrutura de Dados",
        degree: "Ciência da Computação",
        levelSeries: "1º Semestre",
        modality: "Presencial"
    },
    {
        title: "Cálculo Diferencial e Integral I",
        degree: "Engenharia Civil",
        levelSeries: "2º Semestre",
        modality: "Presencial"
    },
    {
        title: "Marketing Digital Avançado",
        degree: "Comunicação Social",
        levelSeries: "4º Semestre",
        modality: "EAD"
    },
    {
        title: "Direito Constitucional",
        degree: "Direito",
        levelSeries: "3º Semestre",
        modality: "Presencial"
    },
    {
        title: "Contabilidade de Custos",
        degree: "Administração",
        levelSeries: "5º Semestre",
        modality: "EAD"
    }
];

async function seedCourses() {
    try {
        await connection.sync();
        console.log("Banco de dados sincronizado.");
        const count = await Course.count();
        if (count > 0) {
            console.log(`A tabela 'courses' já tem ${count} registros. Pulando o seed.`);
            return;
        }

        await Course.bulkCreate(coursesData);
        console.log(`✅ ${coursesData.length} cursos inseridos com sucesso!`);

    } catch (error) {
        console.error("❌ Erro ao executar o seed de courses:", error);
    } finally {
        await connection.close();
        console.log("Conexão com o banco de dados fechada.");
    }
}

seedCourses();