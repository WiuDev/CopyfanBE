const Course = require('./src/models/Courses');
const connection = require('./src/database/index')

const coursesData = [
    {
        title: "Engenharia de Software",
        degree: "Bacharelado",
        modality: "Presencial"
    },
    {
        title: "Direito",
        degree: "Bacharelado",
        modality: "Presencial"
    },
    {
        title: "Marketing Digital Avançado",
        degree: "Bacharelado",
        modality: "EAD"
    },
    {
        title: "Inteligência Artificial Aplicada",
        degree: "Mestrado",
        modality: "Presencial"
    },
    {
        title: "Ciência de Dados",
        degree: "Doutorado",
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