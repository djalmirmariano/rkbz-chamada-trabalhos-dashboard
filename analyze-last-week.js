import fs from 'fs';

// Ler dados processados
const dados = JSON.parse(fs.readFileSync('./dados-processados.json', 'utf-8'));

console.log('\n=== ANÁLISE DA ÚLTIMA SEMANA (Semana 0) ===\n');

const analises = [];

Object.entries(dados).forEach(([ano, info]) => {
  const inscricoesUltimaSemana = parseInt(info.por_semana['0'] || 0);
  const totalInscricoes = info.total_inscricoes;
  const percentual = (inscricoesUltimaSemana / totalInscricoes) * 100;

  analises.push({
    ano,
    ultimaSemana: inscricoesUltimaSemana,
    total: totalInscricoes,
    percentual
  });

  console.log(`${ano}:`);
  console.log(`  Última semana: ${inscricoesUltimaSemana} inscrições`);
  console.log(`  Total: ${totalInscricoes} inscrições`);
  console.log(`  Percentual: ${percentual.toFixed(2)}%`);
  console.log('');
});

// Calcular média (excluindo 2026 que ainda não tem semana 0)
const anosCompletos = analises.filter(item => item.ano !== '2026');
const mediaPercentual = anosCompletos.reduce((sum, item) => sum + item.percentual, 0) / anosCompletos.length;

console.log('='.repeat(50));
console.log(`\n📊 MÉDIA GERAL (2022-2025): ${mediaPercentual.toFixed(2)}% das inscrições acontecem na ÚLTIMA SEMANA\n`);
console.log('='.repeat(50));

// Identificar maior e menor (entre anos completos)
const maior = anosCompletos.reduce((max, item) => item.percentual > max.percentual ? item : max);
const menor = anosCompletos.reduce((min, item) => item.percentual < min.percentual ? item : min);

console.log(`\n🏆 Maior concentração: ${maior.ano} com ${maior.percentual.toFixed(1)}%`);
console.log(`📉 Menor concentração: ${menor.ano} com ${menor.percentual.toFixed(1)}%`);

// Análise 2026 (não tem semana 0 ainda)
console.log('\n⚠️  ATENÇÃO: 2026 ainda NÃO chegou na última semana!');
console.log('   Se seguir a média histórica, deve ter mais:');
const projecao2026 = Math.round((185 / (1 - mediaPercentual/100)) * (mediaPercentual/100));
console.log(`   ~${projecao2026} inscrições na última semana`);
console.log(`   Total projetado: ~${185 + projecao2026} inscrições`);
