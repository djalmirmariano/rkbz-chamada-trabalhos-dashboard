import fs from 'fs';
import Papa from 'papaparse';

// Ler o CSV de 2024
const arquivos = fs.readdirSync('./data-base');
const arquivo2024 = arquivos.find(f => f.includes('rkbz-2024-'));

const conteudo = fs.readFileSync(`./data-base/${arquivo2024}`, 'utf-8');
const resultado = Papa.parse(conteudo, { header: true });
const dados = resultado.data.filter(row => row.id_palestra);

console.log('\n=== ANÁLISE DE INSCRIÇÕES CRUZADAS - INSPIRA 2024 ===\n');

// Criar mapa de palestrantes e seus formatos
const palestranteFormatos = new Map();

dados.forEach(row => {
  const palestrante1 = row.id_1_palestrante;
  const palestrante2 = row.id_2_palestrante;
  const formato = row.formato || 'não especificado';

  // Adicionar palestrante 1
  if (palestrante1 && palestrante1 !== 'N/A') {
    if (!palestranteFormatos.has(palestrante1)) {
      palestranteFormatos.set(palestrante1, new Set());
    }
    palestranteFormatos.get(palestrante1).add(formato);
  }

  // Adicionar palestrante 2 (se existir)
  if (palestrante2 && palestrante2 !== 'N/A') {
    if (!palestranteFormatos.has(palestrante2)) {
      palestranteFormatos.set(palestrante2, new Set());
    }
    palestranteFormatos.get(palestrante2).add(formato);
  }
});

// Filtrar apenas inscrições Inspira
const inscricoesInspira = dados.filter(row => row.formato === 'inspira');

// Identificar palestrantes únicos que se inscreveram em Inspira
const palestrantesInspira = new Set();
inscricoesInspira.forEach(row => {
  if (row.id_1_palestrante && row.id_1_palestrante !== 'N/A') {
    palestrantesInspira.add(row.id_1_palestrante);
  }
  if (row.id_2_palestrante && row.id_2_palestrante !== 'N/A') {
    palestrantesInspira.add(row.id_2_palestrante);
  }
});

console.log(`Total de inscrições no formato Inspira: ${inscricoesInspira.length}`);
console.log(`Total de palestrantes únicos em Inspira: ${palestrantesInspira.size}\n`);

// Verificar quantos desses palestrantes têm inscrições em outros formatos
let palestrantesComOutrosFormatos = 0;
const formatosCruzados = {};

palestrantesInspira.forEach(palestrante => {
  const formatos = palestranteFormatos.get(palestrante);

  // Se tem mais de 1 formato, significa que se inscreveu em outros também
  if (formatos && formatos.size > 1) {
    palestrantesComOutrosFormatos++;

    // Contar combinações
    formatos.forEach(formato => {
      if (formato !== 'inspira') {
        formatosCruzados[formato] = (formatosCruzados[formato] || 0) + 1;
      }
    });
  }
});

const percentualCruzado = (palestrantesComOutrosFormatos / palestrantesInspira.size) * 100;

console.log('='.repeat(50));
console.log(`\n📊 RESULTADO:`);
console.log(`   ${palestrantesComOutrosFormatos} palestrantes se inscreveram em Inspira E outros formatos`);
console.log(`   Isso representa ${percentualCruzado.toFixed(2)}% dos palestrantes de Inspira\n`);
console.log('='.repeat(50));

console.log(`\n📍 FORMATOS ADICIONAIS (além de Inspira):\n`);
Object.entries(formatosCruzados)
  .sort((a, b) => b[1] - a[1])
  .forEach(([formato, count]) => {
    console.log(`   ${formato}: ${count} palestrantes`);
  });

console.log(`\n💡 OBSERVAÇÃO:`);
console.log(`   ${palestrantesInspira.size - palestrantesComOutrosFormatos} palestrantes (${(100 - percentualCruzado).toFixed(2)}%) se inscreveram APENAS em Inspira`);
