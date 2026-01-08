import fs from 'fs';
import Papa from 'papaparse';

// Períodos de inscrição de cada ano (do briefing)
const periodos = {
  '2026': { inicio: '2025-11-28', fim: '2026-01-15' },
  '2025': { inicio: '2024-12-02', fim: '2025-01-21' },
  '2024': { inicio: '2023-12-01', fim: '2024-02-02' },
  '2023': { inicio: '2022-11-30', fim: '2023-02-01' },
  '2022': { inicio: '2022-01-02', fim: '2022-01-31' }
};

function parseDataBR(dataStr) {
  // Formato: DD/MM/YYYY HH:MM:SS
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

async function processarAno(ano) {
  const arquivos = fs.readdirSync('./data-base');
  const arquivo = arquivos.find(f => f.includes(`rkbz-${ano}-`));

  if (!arquivo) {
    console.log(`Arquivo não encontrado para ${ano}`);
    return null;
  }

  const conteudo = fs.readFileSync(`./data-base/${arquivo}`, 'utf-8');
  const resultado = Papa.parse(conteudo, { header: true });
  const dados = resultado.data.filter(row => row.id_palestra && row.criado);

  const dataInicio = new Date(periodos[ano].inicio);
  const dataFim = new Date(periodos[ano].fim);

  // Calcular total de semanas
  const diffTotal = dataFim - dataInicio;
  const diasTotal = Math.ceil(diffTotal / (1000 * 60 * 60 * 24));
  const totalSemanas = Math.ceil(diasTotal / 7);

  // Contar inscrições por semana e rascunhos por semana
  const porSemana = {};
  const rascunhosPorSemana = {};

  dados.forEach(row => {
    const dataInscricao = parseDataBR(row.criado);
    const semana = calcularSemana(dataInscricao, dataFim);
    const ehRascunho = row.status === 'rascunho';

    // Se a semana for negativa ou maior que total, ajustar
    if (semana >= 0 && semana < totalSemanas) {
      porSemana[semana] = (porSemana[semana] || 0) + 1;
      if (ehRascunho) {
        rascunhosPorSemana[semana] = (rascunhosPorSemana[semana] || 0) + 1;
      }
    } else if (semana >= totalSemanas) {
      // Inscrições antes do período vão para a última semana disponível
      porSemana[totalSemanas - 1] = (porSemana[totalSemanas - 1] || 0) + 1;
      if (ehRascunho) {
        rascunhosPorSemana[totalSemanas - 1] = (rascunhosPorSemana[totalSemanas - 1] || 0) + 1;
      }
    } else {
      // Inscrições depois do fim vão para semana 0
      porSemana[0] = (porSemana[0] || 0) + 1;
      if (ehRascunho) {
        rascunhosPorSemana[0] = (rascunhosPorSemana[0] || 0) + 1;
      }
    }
  });

  return {
    total_inscricoes: dados.length,
    total_semanas: totalSemanas,
    periodo_inicio: periodos[ano].inicio,
    periodo_fim: periodos[ano].fim,
    por_semana: porSemana,
    rascunhos_por_semana: rascunhosPorSemana
  };
}

async function gerarTodosDados() {
  const dadosCompletos = {};

  for (const ano of Object.keys(periodos)) {
    console.log(`Processando ${ano}...`);
    const dados = await processarAno(ano);
    if (dados) {
      dadosCompletos[ano] = dados;
      console.log(`  Total: ${dados.total_inscricoes} inscrições em ${dados.total_semanas} semanas`);
      console.log(`  Por semana:`, dados.por_semana);
      console.log(`  Rascunhos por semana:`, dados.rascunhos_por_semana);
    }
  }

  // Salvar em arquivo JSON
  fs.writeFileSync('./dados-processados.json', JSON.stringify(dadosCompletos, null, 2));
  console.log('\n✅ Dados salvos em dados-processados.json');

  // Gerar código JavaScript para copiar
  const jsCode = `const dadosOriginais = ${JSON.stringify(dadosCompletos, null, 2)};`;
  fs.writeFileSync('./dados-para-dashboard.js', jsCode);
  console.log('✅ Código JavaScript salvo em dados-para-dashboard.js');

  return dadosCompletos;
}

gerarTodosDados();
