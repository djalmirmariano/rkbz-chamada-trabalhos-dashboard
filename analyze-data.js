import fs from 'fs';
import Papa from 'papaparse';

const anos = ['2022', '2023', '2024', '2025', '2026'];

async function analisarCSV(ano) {
  const arquivos = fs.readdirSync('./data-base');
  const arquivo = arquivos.find(f => f.includes(`rkbz-${ano}-`));

  if (!arquivo) {
    console.log(`Arquivo não encontrado para ${ano}`);
    return;
  }

  const conteudo = fs.readFileSync(`./data-base/${arquivo}`, 'utf-8');
  const resultado = Papa.parse(conteudo, { header: true });

  const dados = resultado.data.filter(row => row.id_palestra); // Remove linhas vazias

  console.log(`\n======== ANO ${ano} ========`);
  console.log(`Arquivo: ${arquivo}`);
  console.log(`Total de inscrições: ${dados.length}`);

  // Contar por status
  const porStatus = {};
  dados.forEach(row => {
    const status = row.status || 'sem status';
    porStatus[status] = (porStatus[status] || 0) + 1;
  });

  console.log('\nDistribuição por STATUS:');
  Object.entries(porStatus).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  // Contar por formato
  const porFormato = {};
  dados.forEach(row => {
    const formato = row.formato || 'sem formato';
    porFormato[formato] = (porFormato[formato] || 0) + 1;
  });

  console.log('\nDistribuição por FORMATO:');
  Object.entries(porFormato).sort((a, b) => b[1] - a[1]).forEach(([formato, count]) => {
    console.log(`  ${formato}: ${count}`);
  });

  // Análise das datas para ver a distribuição por semana
  const inscricoesComData = dados.filter(row => row.criado);
  console.log(`\nInscrições com data de criação: ${inscricoesComData.length}`);

  // Mostrar algumas datas para entender o formato
  if (inscricoesComData.length > 0) {
    console.log('\nExemplo de datas (primeiras 3):');
    inscricoesComData.slice(0, 3).forEach(row => {
      console.log(`  ${row.criado}`);
    });
  }

  return {
    total: dados.length,
    porStatus,
    porFormato,
    inscricoesComData: inscricoesComData.length
  };
}

console.log('ANÁLISE DOS DADOS DOS CSVs\n');
console.log('Comparando com os dados do dashboard:');
console.log('2022: 362 inscrições');
console.log('2023: 567 inscrições');
console.log('2024: 631 inscrições');
console.log('2025: 418 inscrições');
console.log('2026: 48 inscrições');
console.log('=====================================');

for (const ano of anos) {
  await analisarCSV(ano);
}
