import fs from 'fs';
import path from 'path';

function parseAFD(filepath: string) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const linhas = content.split(/\r?\n/);

    const marcacoes = [];

    for (const linha of linhas) {
        if (linha.startsWith('3')) {
            const data = linha.slice(10, 18); // AAAAMMDD
            const hora = linha.slice(18, 22); // HHMM
            const pis = linha.slice(22, 34).trim();

            const dataFormatada = `${data.slice(6, 8)}/${data.slice(4, 6)}/${data.slice(0, 4)}`;
            const horaFormatada = `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;

            marcacoes.push({
                pis,
                data: dataFormatada,
                hora: horaFormatada,
            });
        }
    }

    return marcacoes;
}