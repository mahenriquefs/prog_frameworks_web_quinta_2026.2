const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        const alunos = await prisma.aluno.findMany({
            skip: (page-1)*pageSize,
            take: Number(pageSize),
            orderBy: {
                [orderBy]: order
            }
        });

        const total = await prisma.aluno.count();

        return {alunos, total};
    }

    async findById(id){
        const aluno = await prisma.aluno.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
    }

    async update(id, dados){
        const aluno = await prisma.aluno.findUnique({
            where: {
                id: Number(id)
            }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        const data = {};

        if(dados.nome !== undefined){
            if(!dados.nome){
                throw new AlunoInvalidoError();
            }
            data.nome = dados.nome;
        }

        if(dados.email !== undefined){
            if(!dados.email){
                throw new AlunoInvalidoError();
            }
            data.email = dados.email;
        }

        if(Object.keys(data).length === 0){
            throw new AlunoInvalidoError();
        }

        try{
            const alunoAtualizado = await prisma.aluno.update({
                where: {
                    id: Number(id)
                },
                data
            });

            return alunoAtualizado;
        }catch(error){
            if(error.code === "P2002"){
                throw new AlunoInvalidoError();
            }

            throw error;
        }
    }

    async create(aluno){
        const {nome, email} = aluno;

        if(!nome || !email){
            throw new AlunoInvalidoError();
        }

        const novoAluno = await prisma.aluno.create({data: aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();