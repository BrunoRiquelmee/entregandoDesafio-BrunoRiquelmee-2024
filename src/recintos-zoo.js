class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false, toleraEspecies: true },
        };
    }

    
    analisaRecintos(tipoAnimal, quantidade) {
       
        const animal = this.animaisPermitidos[tipoAnimal];
        if (!animal) {
            return { erro: 'Animal inválido' };
        }
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        const recintosViaveis = this.recintos.filter((recinto) => {
            
            if (!animal.biomas.includes(recinto.bioma) && !(animal.toleraEspecies && recinto.bioma === 'savana e rio')) {
                return false;
            }

            const espacoNecessario = quantidade * animal.tamanho;
            const espacoOcupado = recinto.animais.reduce(
                (acc, a) => acc + a.quantidade * this.animaisPermitidos[a.especie].tamanho,
                0
            );

            const carregaEspeciesDiferentes = recinto.animais.some((a) => a.especie !== tipoAnimal);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoNecessario - (carregaEspeciesDiferentes ? 1 : 0);

            
            if (espacoLivre < 0) {
                return false;
            }

            
            if (animal.carnivoro && recinto.animais.some((a) => a.especie !== tipoAnimal)) {
                return false;
            }

            
            if (tipoAnimal === 'MACACO' && recinto.animais.length === 0) {
                return false; 
            }

           
            if (tipoAnimal === 'HIPOPOTAMO' && !animal.toleraEspecies && recinto.animais.length > 0) {
                return false; 
            }

            return true;
        });

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return {
            recintosViaveis: recintosViaveis.map((r) => {
                const espacoOcupado = r.animais.reduce(
                    (acc, a) => acc + a.quantidade * this.animaisPermitidos[a.especie].tamanho,
                    0
                );
                const espacoLivre = r.tamanhoTotal - espacoOcupado - quantidade * animal.tamanho;
                return `Recinto ${r.numero} (espaço livre: ${espacoLivre}, total: ${r.tamanhoTotal})`;
            }),
        };
    }
}

export { RecintosZoo as RecintosZoo };
