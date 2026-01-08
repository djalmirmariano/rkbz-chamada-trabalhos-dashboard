console.log('\n=== ANÁLISE DE CAMPANHA DE E-MAILS - 2026 ===\n');

// Dados atuais
const cliquesAtuais = 2900;
const emailsEnviados = 4;
const inscricoesAtuais = 185;
const mediaUltimaSemana = 57.68; // % histórico

console.log('📧 DADOS ATUAIS DA CAMPANHA:');
console.log(`   E-mails enviados: ${emailsEnviados}`);
console.log(`   Cliques totais: ${cliquesAtuais.toLocaleString()}`);
console.log(`   Inscrições geradas: ${inscricoesAtuais}`);
console.log('');

// Cálculos
const cliquesPorEmail = cliquesAtuais / emailsEnviados;
const taxaConversao = (inscricoesAtuais / cliquesAtuais) * 100;

console.log('📊 MÉTRICAS DE PERFORMANCE:');
console.log(`   Cliques por e-mail: ${cliquesPorEmail.toFixed(0)}`);
console.log(`   Taxa de conversão (clique → inscrição): ${taxaConversao.toFixed(2)}%`);
console.log('');

console.log('='.repeat(60));
console.log('\n🎯 META: Última semana com 57.68% do total (média histórica)\n');
console.log('='.repeat(60));

// Calcular meta
// Se a última semana tem 57.68%, então as inscrições atuais representam 42.32%
const percAteAgora = 100 - mediaUltimaSemana;
const totalProjetado = inscricoesAtuais / (percAteAgora / 100);
const inscricoesNecessariasUltimaSemana = totalProjetado - inscricoesAtuais;

console.log(`\n📈 PROJEÇÃO NECESSÁRIA:`);
console.log(`   Inscrições até agora: ${inscricoesAtuais} (${percAteAgora.toFixed(2)}% do total)`);
console.log(`   Inscrições necessárias na última semana: ${Math.round(inscricoesNecessariasUltimaSemana)}`);
console.log(`   Total projetado: ${Math.round(totalProjetado)} inscrições`);
console.log('');

// Calcular cliques necessários
const cliquesNecessarios = inscricoesNecessariasUltimaSemana / (taxaConversao / 100);
const emailsNecessarios = cliquesNecessarios / cliquesPorEmail;

console.log('📬 CAMPANHA NECESSÁRIA PARA A ÚLTIMA SEMANA:');
console.log(`   Cliques necessários: ${Math.round(cliquesNecessarios).toLocaleString()}`);
console.log(`   E-mails a enviar: ${Math.ceil(emailsNecessarios)}`);
console.log('');

// Resumo
console.log('='.repeat(60));
console.log('\n✅ RESUMO - AÇÕES RECOMENDADAS:\n');
console.log('='.repeat(60));
console.log(`\n   1️⃣  Enviar ${Math.ceil(emailsNecessarios)} e-mails na última semana`);
console.log(`   2️⃣  Gerar ~${Math.round(cliquesNecessarios).toLocaleString()} cliques`);
console.log(`   3️⃣  Meta: ${Math.round(inscricoesNecessariasUltimaSemana)} inscrições`);
console.log(`   4️⃣  Resultado: ${Math.round(totalProjetado)} inscrições totais\n`);

// Comparação com outros anos
console.log('📊 COMPARAÇÃO COM ANOS ANTERIORES:\n');
console.log(`   2022: 364 inscrições → ${totalProjetado > 364 ? '✅' : '❌'} Supera`);
console.log(`   2023: 569 inscrições → ${totalProjetado > 569 ? '✅' : '❌'} ${totalProjetado > 569 ? 'Supera' : 'Não alcança'}`);
console.log(`   2024: 955 inscrições → ${totalProjetado > 955 ? '✅' : '❌'} Não alcança`);
console.log(`   2025: 621 inscrições → ${totalProjetado > 621 ? '✅' : '❌'} Não alcança`);
console.log('');

// Cenários alternativos
console.log('='.repeat(60));
console.log('\n🎲 CENÁRIOS ALTERNATIVOS:\n');
console.log('='.repeat(60));

// Cenário para igualar 2025
const metaIgualar2025 = 621;
const inscricoesNecessarias2025 = metaIgualar2025 - inscricoesAtuais;
const cliquesNecessarios2025 = inscricoesNecessarias2025 / (taxaConversao / 100);
const emailsNecessarios2025 = cliquesNecessarios2025 / cliquesPorEmail;

console.log(`\n📍 PARA IGUALAR 2025 (${metaIgualar2025} inscrições):`);
console.log(`   Faltam: ${inscricoesNecessarias2025} inscrições`);
console.log(`   Cliques necessários: ${Math.round(cliquesNecessarios2025).toLocaleString()}`);
console.log(`   E-mails necessários: ${Math.ceil(emailsNecessarios2025)}`);
console.log(`   % na última semana: ${((inscricoesNecessarias2025 / metaIgualar2025) * 100).toFixed(1)}%`);

// Cenário para igualar 2024
const metaIgualar2024 = 955;
const inscricoesNecessarias2024 = metaIgualar2024 - inscricoesAtuais;
const cliquesNecessarios2024 = inscricoesNecessarias2024 / (taxaConversao / 100);
const emailsNecessarios2024 = cliquesNecessarios2024 / cliquesPorEmail;

console.log(`\n📍 PARA IGUALAR 2024 (${metaIgualar2024} inscrições):`);
console.log(`   Faltam: ${inscricoesNecessarias2024} inscrições`);
console.log(`   Cliques necessários: ${Math.round(cliquesNecessarios2024).toLocaleString()}`);
console.log(`   E-mails necessários: ${Math.ceil(emailsNecessarios2024)}`);
console.log(`   % na última semana: ${((inscricoesNecessarias2024 / metaIgualar2024) * 100).toFixed(1)}%`);
console.log('');
