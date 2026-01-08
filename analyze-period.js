import fs from 'fs';
import Papa from 'papaparse';

function parseDataBR(dataStr) {
  // Formato: DD/MM/YYYY HH:MM:SS
  const [data, hora] = dataStr.split(' ');
  const [dia, mes, ano] = data.split('/');
  return new Date(`${ano}-${mes}-${dia}T${hora || '00:00:00'}`);
}

// Ler o CSV de 2024
const arquivos = fs.readdirSync('./data-base');
const arquivo2024 = arquivos.find(f => f.includes('rkbz-2024-'));

const conteudo = fs.readFileSync(`./data-base/${arquivo2024}`, 'utf-8');
const resultado = Papa.parse(conteudo, { header: true });
const dados = resultado.data.filter(row => row.id_palestra && row.criado);

// Definir período
const dataInicio = new Date('2023-12-06T00:00:00');
const dataFim = new Date('2023-12-29T23:59:59');

// Filtrar inscrições no período
const inscricoesNoPeriodo = dados.filter(row => {
  const dataInscricao = parseDataBR(row.criado);
  return dataInscricao >= dataInicio && dataInscricao <= dataFim;
});

const total2024 = dados.length;
const totalNoPeriodo = inscricoesNoPeriodo.length;
const percentual = (totalNoPeriodo / total2024) * 100;

console.log('\n=== ANÁLISE DO PERÍODO 06/12/2023 à 29/12/2023 ===\n');
console.log(`Total de inscrições em 2024: ${total2024}`);
console.log(`Inscrições no período (06/12 - 29/12): ${totalNoPeriodo}`);
console.log(`Percentual: ${percentual.toFixed(2)}%`);
console.log(`\nOu seja: ${percentual.toFixed(1)}% de todas as inscrições de 2024 vieram nesse período de 24 dias!`);

// Mostrar algumas datas para confirmar
console.log('\n=== Primeiras 5 inscrições do período ===');
inscricoesNoPeriodo.slice(0, 5).forEach(row => {
  console.log(`- ${row.criado}`);
});

console.log('\n=== Últimas 5 inscrições do período ===');
inscricoesNoPeriodo.slice(-5).forEach(row => {
  console.log(`- ${row.criado}`);
});
