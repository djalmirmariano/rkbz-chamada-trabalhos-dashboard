import fs from 'fs';
import Papa from 'papaparse';

// Ler o CSV de 2024
const arquivos = fs.readdirSync('./data-base');
const arquivo2024 = arquivos.find(f => f.includes('rkbz-2024-'));

const conteudo = fs.readFileSync(`./data-base/${arquivo2024}`, 'utf-8');
const resultado = Papa.parse(conteudo, { header: true });
const dados = resultado.data.filter(row => row.id_palestra);

console.log('\n=== ANÁLISE POR FORMATO - EDIÇÃO 2024 ===\n');

// Contar por formato
const porFormato = {};
dados.forEach(row => {
  const formato = row.formato || 'não especificado';
  porFormato[formato] = (porFormato[formato] || 0) + 1;
});

const total = dados.length;

// Ordenar por quantidade (decrescente)
const formatosOrdenados = Object.entries(porFormato)
  .sort((a, b) => b[1] - a[1]);

formatosOrdenados.forEach(([formato, count]) => {
  const percentual = (count / total) * 100;
  console.log(`${formato}:`);
  console.log(`  Total: ${count} inscrições`);
  console.log(`  Percentual: ${percentual.toFixed(2)}%`);
  console.log('');
});

console.log('='.repeat(50));
console.log(`TOTAL GERAL: ${total} inscrições\n`);
console.log('='.repeat(50));

// Destacar Inspira
const inspira = porFormato['inspira'] || 0;
const percInspira = (inspira / total) * 100;

console.log(`\n📍 FORMATO "INSPIRA" EM 2024:`);
console.log(`   ${inspira} inscrições (${percInspira.toFixed(2)}% do total)`);
