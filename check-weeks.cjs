const fs = require('fs');
const Papa = require('papaparse');

function parseDataBR(dataStr) {
  const [data, hora] = dataStr.split(' ');
  const [dia, mes, ano] = data.split('/');
  return new Date(`${ano}-${mes}-${dia}T${hora || '00:00:00'}`);
}

function calcularSemana(dataInscricao, dataFim) {
  const diff = dataFim - dataInscricao;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const semana = Math.floor(dias / 7);
  return semana;
}

const conteudo = fs.readFileSync('data-base/rkbz-2026-chamadas-de-trabalho-cbtd-2026-08-01-2026-10-0.csv', 'utf-8');
const resultado = Papa.parse(conteudo, { header: true });
const dados = resultado.data.filter(row => row.id_palestra && row.criado);

const dataFim = new Date('2026-01-15');

console.log('HOJE É 08/01/2026');
console.log('Prazo final: 15/01/2026 00:00:00');
console.log('');

// Verificar cálculo para hoje
const hoje0 = new Date('2026-01-08T00:00:00');
const hoje12 = new Date('2026-01-08T12:00:00');
const hoje23 = new Date('2026-01-08T23:59:59');

console.log('Cálculo de semanas:');
console.log('08/01/2026 00:00:00 -> dias até fim:', Math.floor((dataFim - hoje0) / (1000*60*60*24)), '-> semana:', Math.floor(Math.floor((dataFim - hoje0) / (1000*60*60*24)) / 7));
console.log('08/01/2026 12:00:00 -> dias até fim:', Math.floor((dataFim - hoje12) / (1000*60*60*24)), '-> semana:', Math.floor(Math.floor((dataFim - hoje12) / (1000*60*60*24)) / 7));
console.log('08/01/2026 23:59:59 -> dias até fim:', Math.floor((dataFim - hoje23) / (1000*60*60*24)), '-> semana:', Math.floor(Math.floor((dataFim - hoje23) / (1000*60*60*24)) / 7));
console.log('');

// Agrupar por semana
const porSemana = {};
dados.forEach(row => {
  const dataInscricao = parseDataBR(row.criado);
  const semana = calcularSemana(dataInscricao, dataFim);
  if (!porSemana[semana]) porSemana[semana] = [];
  porSemana[semana].push(row.criado);
});

Object.keys(porSemana).sort((a,b) => a-b).forEach(sem => {
  const datas = porSemana[sem].sort();
  console.log(`\nSemana ${sem}: ${datas.length} inscrições`);
  console.log('  Primeira:', datas[0]);
  console.log('  Última:', datas[datas.length - 1]);

  if (sem == '1') {
    // Quantas do dia 08/01?
    const dia08 = datas.filter(d => d.startsWith('08/01/2026'));
    console.log('  Do dia 08/01:', dia08.length);
  }
});

console.log('\nTotal:', dados.length);
