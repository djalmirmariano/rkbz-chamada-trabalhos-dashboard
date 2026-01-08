import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const dadosOriginais = {
  "2022": {
    "total_inscricoes": 364,
    "total_semanas": 5,
    "periodo_inicio": "2022-01-02",
    "periodo_fim": "2022-01-31",
    "por_semana": {
      "0": 251,
      "1": 37,
      "2": 37,
      "3": 39
    },
    "rascunhos_por_semana": {}
  },
  "2023": {
    "total_inscricoes": 569,
    "total_semanas": 9,
    "periodo_inicio": "2022-11-30",
    "periodo_fim": "2023-02-01",
    "por_semana": {
      "0": 320,
      "1": 58,
      "2": 62,
      "3": 36,
      "4": 7,
      "5": 26,
      "6": 14,
      "7": 19,
      "8": 27
    },
    "rascunhos_por_semana": {}
  },
  "2024": {
    "total_inscricoes": 955,
    "total_semanas": 9,
    "periodo_inicio": "2023-12-01",
    "periodo_fim": "2024-02-02",
    "por_semana": {
      "0": 462,
      "1": 116,
      "2": 58,
      "3": 67,
      "4": 16,
      "5": 31,
      "6": 66,
      "7": 62,
      "8": 77
    },
    "rascunhos_por_semana": {
      "0": 107,
      "1": 41,
      "2": 16,
      "3": 26,
      "4": 5,
      "5": 14,
      "6": 43,
      "7": 34,
      "8": 36
    }
  },
  "2025": {
    "total_inscricoes": 621,
    "total_semanas": 8,
    "periodo_inicio": "2024-12-02",
    "periodo_fim": "2025-01-21",
    "por_semana": {
      "0": 355,
      "1": 72,
      "2": 30,
      "3": 18,
      "4": 38,
      "5": 53,
      "6": 33,
      "7": 22
    },
    "rascunhos_por_semana": {
      "0": 76,
      "1": 20,
      "2": 16,
      "3": 4,
      "4": 23,
      "5": 28,
      "6": 15,
      "7": 11
    }
  },
  "2026": {
    "total_inscricoes": 185,
    "total_semanas": 7,
    "periodo_inicio": "2025-11-28",
    "periodo_fim": "2026-01-15",
    "por_semana": {
      "1": 26,
      "2": 18,
      "3": 25,
      "4": 38,
      "5": 36,
      "6": 42
    },
    "rascunhos_por_semana": {
      "1": 25,
      "2": 16,
      "3": 19,
      "4": 26,
      "5": 23,
      "6": 28
    }
  }
};

const cores = {
  "2022": "#8B5CF6",
  "2023": "#06B6D4",
  "2024": "#10B981",
  "2025": "#F59E0B",
  "2026": "#EF4444"
};

const formatarData = (dataStr) => {
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
};

export default function Dashboard() {
  const [anosAtivos, setAnosAtivos] = useState(['2022', '2023', '2024', '2025', '2026']);
  const [modoVisualizacao, setModoVisualizacao] = useState('linha');
  const [mostrarAcumulado, setMostrarAcumulado] = useState(false);

  const maxSemanas = useMemo(() => {
    return Math.max(...Object.values(dadosOriginais).map(d => d.total_semanas));
  }, []);

  const dadosGrafico = useMemo(() => {
    const dados = [];

    for (let semana = maxSemanas - 1; semana >= 0; semana--) {
      const ponto = {
        semana: semana,
        semanaLabel: semana === 0 ? 'Última\nSemana' : `${semana} sem.\nantes`
      };

      let totalInscricoesSemana = 0;
      let totalRascunhosSemana = 0;

      anosAtivos.forEach(ano => {
        const valor = parseInt(dadosOriginais[ano].por_semana[semana] || 0);
        const rascunhos = parseInt(dadosOriginais[ano].rascunhos_por_semana[semana] || 0);
        ponto[ano] = valor;
        totalInscricoesSemana += valor;
        totalRascunhosSemana += rascunhos;
      });

      // Calcular porcentagem de rascunhos
      ponto.percRascunhos = totalInscricoesSemana > 0
        ? (totalRascunhosSemana / totalInscricoesSemana) * 100
        : 0;

      dados.push(ponto);
    }

    return dados;
  }, [anosAtivos, maxSemanas]);

  const dadosAcumulados = useMemo(() => {
    const dados = [];
    const acumuladosPorAno = {};
    anosAtivos.forEach(ano => {
      acumuladosPorAno[ano] = 0;
    });

    // Totais gerais acumulados (não por ano)
    let totalGeralInscricoes = 0;
    let totalGeralRascunhos = 0;

    for (let semana = maxSemanas - 1; semana >= 0; semana--) {
      const ponto = {
        semana: semana,
        semanaLabel: semana === 0 ? 'Última\nSemana' : `${semana} sem.\nantes`
      };

      // Acumular dados de cada ano para o gráfico
      anosAtivos.forEach(ano => {
        const valor = parseInt(dadosOriginais[ano].por_semana[semana] || 0);
        const rascunhos = parseInt(dadosOriginais[ano].rascunhos_por_semana[semana] || 0);

        acumuladosPorAno[ano] += valor;
        ponto[ano] = acumuladosPorAno[ano];

        // Acumular no total geral (para calcular a % corretamente)
        totalGeralInscricoes += valor;
        totalGeralRascunhos += rascunhos;
      });

      // Calcular porcentagem acumulada de rascunhos baseada no total geral
      ponto.percRascunhos = totalGeralInscricoes > 0
        ? (totalGeralRascunhos / totalGeralInscricoes) * 100
        : 0;

      dados.push(ponto);
    }

    return dados;
  }, [anosAtivos, maxSemanas]);

  const toggleAno = (ano) => {
    setAnosAtivos(prev => 
      prev.includes(ano) 
        ? prev.filter(a => a !== ano) 
        : [...prev, ano].sort()
    );
  };

  const dadosParaExibir = mostrarAcumulado ? dadosAcumulados : dadosGrafico;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const percRascunhos = payload.find(p => p.dataKey === 'percRascunhos');

      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <p style={{
            margin: '0 0 12px 0',
            fontWeight: '600',
            color: '#F8FAFC',
            fontSize: '14px',
            letterSpacing: '0.025em'
          }}>
            {label === 0 ? 'Última Semana' : `${label} semana${label > 1 ? 's' : ''} antes do fechamento`}
          </p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'percRascunhos') {
              return (
                <p key={index} style={{
                  margin: '8px 0 0 0',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                  color: entry.color,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '24px',
                  fontSize: '13px'
                }}>
                  <span style={{ fontWeight: '500' }}>% Rascunhos:</span>
                  <span style={{ fontWeight: '700' }}>{entry.value.toFixed(1)}%</span>
                </p>
              );
            }
            return (
              <p key={index} style={{
                margin: '6px 0',
                color: entry.color,
                display: 'flex',
                justifyContent: 'space-between',
                gap: '24px',
                fontSize: '13px'
              }}>
                <span style={{ fontWeight: '500' }}>CBTD {entry.dataKey}:</span>
                <span style={{ fontWeight: '700' }}>{entry.value} {mostrarAcumulado ? 'acumuladas' : 'inscrições'}</span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderGrafico = () => {
    const commonProps = {
      data: dadosParaExibir,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    const renderLines = () => anosAtivos.map(ano => (
      <Line
        key={ano}
        yAxisId="left"
        type="monotone"
        dataKey={ano}
        stroke={cores[ano]}
        strokeWidth={3}
        dot={{ fill: cores[ano], strokeWidth: 2, r: 5 }}
        activeDot={{ r: 8, strokeWidth: 0 }}
      />
    ));

    const renderAreas = () => anosAtivos.map(ano => (
      <Area
        key={ano}
        yAxisId="left"
        type="monotone"
        dataKey={ano}
        stroke={cores[ano]}
        fill={cores[ano]}
        fillOpacity={0.15}
        strokeWidth={2}
      />
    ));

    const renderBars = () => anosAtivos.map(ano => (
      <Bar key={ano} yAxisId="left" dataKey={ano} fill={cores[ano]} radius={[4, 4, 0, 0]} />
    ));

    const ChartComponent = modoVisualizacao === 'linha' ? LineChart : 
                          modoVisualizacao === 'area' ? AreaChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height={450}>
        <ChartComponent {...commonProps}>
          <defs>
            {Object.entries(cores).map(([ano, cor]) => (
              <linearGradient key={ano} id={`gradient-${ano}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={cor} stopOpacity={0.05}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis
            dataKey="semana"
            stroke="#94A3B8"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickFormatter={(value) => value === 0 ? 'Última' : `-${value}`}
            label={{
              value: 'Semanas até o fechamento das inscrições →',
              position: 'bottom',
              offset: 40,
              fill: '#64748B',
              fontSize: 12,
              fontWeight: 500
            }}
          />
          <YAxis
            yAxisId="left"
            stroke="#94A3B8"
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            label={{
              value: mostrarAcumulado ? 'Inscrições Acumuladas' : 'Inscrições por Semana',
              angle: -90,
              position: 'insideLeft',
              fill: '#64748B',
              fontSize: 12,
              fontWeight: 500
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#FF6B6B"
            tick={{ fill: '#FF6B6B', fontSize: 11 }}
            domain={[0, 100]}
            label={{
              value: '% Rascunhos',
              angle: 90,
              position: 'insideRight',
              fill: '#FF6B6B',
              fontSize: 12,
              fontWeight: 500
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => {
              if (value === 'percRascunhos') {
                return <span style={{ color: '#FF6B6B', fontWeight: 500 }}>% Rascunhos</span>;
              }
              return <span style={{ color: '#E2E8F0', fontWeight: 500 }}>CBTD {value}</span>;
            }}
          />
          {modoVisualizacao === 'linha' && renderLines()}
          {modoVisualizacao === 'area' && renderAreas()}
          {modoVisualizacao === 'barra' && renderBars()}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="percRascunhos"
            stroke="#FF6B6B"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#F8FAFC',
      padding: '32px'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <h1 style={{
          fontSize: '42px',
          fontWeight: '800',
          margin: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          <svg width="60" height="53" viewBox="0 0 279 245" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M69.9609 243.027L272.214 114.275L272.202 114.263C275.292 112.288 275.979 108.364 273.735 105.469L272.533 103.924C270.301 101.03 265.983 100.282 262.893 102.244L254.161 107.812C256.147 105.702 256.356 102.501 254.455 100.049L253.253 98.5032C251.021 95.6088 246.704 94.8607 243.613 96.823L195.941 127.177C197.928 125.068 198.137 121.867 196.236 119.414L195.034 117.869C193.133 115.428 189.735 114.508 186.866 115.489L256.528 71.1412C259.618 69.1667 260.305 65.2421 258.061 62.3476L256.859 60.8023C254.627 57.9079 250.31 57.1598 247.219 59.1221L217.662 77.9357C220.752 75.9612 221.439 72.0365 219.195 69.1421L217.993 67.5968C215.761 64.7024 211.443 63.9543 208.353 65.9166L196.346 73.5573C198.64 71.4479 198.97 68.0383 196.971 65.4505L195.77 63.9052C193.77 61.3174 190.103 60.4467 187.148 61.6976L238.45 29.0374C241.54 27.0628 242.227 23.1382 239.983 20.2438L238.781 18.6985C236.549 15.8041 232.232 15.0559 229.141 17.0182L26.8881 145.77C23.7975 147.745 23.1107 151.67 25.3551 154.564L26.557 156.109C28.7891 159.004 33.1062 159.752 36.1968 157.79L47.1368 150.823C44.8433 152.933 44.5122 156.342 46.5113 158.93L47.7131 160.475C49.7122 163.063 53.3794 163.934 56.3351 162.683L26.655 181.583C23.5644 183.557 22.8776 187.482 25.122 190.376L26.324 191.921C28.5561 194.816 32.8732 195.564 35.9639 193.602L74.3269 169.183C71.2363 171.158 70.5495 175.082 72.7939 177.977L73.9959 179.522C75.8969 181.963 79.2941 182.883 82.1639 181.901L63.9022 193.528C60.8115 195.503 60.1247 199.427 62.3691 202.322L63.5711 203.867C65.8033 206.761 70.1203 207.51 73.211 205.547L115.474 178.639C113.487 180.749 113.279 183.95 115.18 186.402L116.382 187.948C118.283 190.388 121.68 191.308 124.55 190.327L60.6522 231.008C57.5616 232.983 56.8748 236.908 59.1192 239.802L60.321 241.347C62.5532 244.242 66.8702 244.99 69.9609 243.027Z" fill="#FAFAFA"/>
            <path d="M249.709 7.6482C250.592 2.5462 255.853 -0.801987 261.458 0.166904C267.063 1.14806 270.877 6.07836 269.994 11.1804C269.111 16.2824 263.85 19.6306 258.245 18.6617C252.64 17.6805 248.825 12.7502 249.709 7.6482Z" fill="#FAFAFA"/>
            <path d="M0.127025 201.377C1.01006 196.275 6.27162 192.927 11.8765 193.896C17.4813 194.877 21.2955 199.808 20.4125 204.91C19.5294 210.012 14.268 213.36 8.66319 212.391C3.05834 211.41 -0.756016 206.479 0.127025 201.377Z" fill="#FAFAFA"/>
            <path d="M257.705 81.8972C258.588 76.7952 263.85 73.447 269.454 74.4158C275.059 75.397 278.873 80.3273 277.99 85.4293C277.107 90.5313 271.846 93.8918 266.241 92.9106C260.636 91.9295 256.822 86.9992 257.705 81.8972Z" fill="#FAFAFA"/>
            <path d="M41.7526 212.182C42.6357 207.08 47.8971 203.732 53.5019 204.701C59.1068 205.682 62.9211 210.613 62.0381 215.715C61.1551 220.817 55.8935 224.165 50.2886 223.196C44.6838 222.215 40.8696 217.284 41.7526 212.182Z" fill="#FAFAFA"/>
            <path d="M154.536 28.4978C105.16 28.4978 63.9636 64.2118 55.4275 111.172H55.4398L44.4264 116.986C45.5915 106.352 48.2896 96.0013 52.4718 86.1039C58.0521 72.9196 66.0485 61.0599 76.2157 50.8927C86.3829 40.7132 98.2303 32.729 111.427 27.1487C125.089 21.3721 139.598 18.4409 154.549 18.4409C165.685 18.4409 176.588 20.0721 187.074 23.2976L175.766 30.7544C168.923 29.2704 161.822 28.4978 154.536 28.4978Z" fill="#FAFAFA"/>
            <path d="M254.013 145.12C254.013 145.122 254.013 145.124 254.013 145.125L264.966 138.179C264.033 149.977 261.237 161.444 256.613 172.36C251.033 185.544 243.037 197.404 232.869 207.571C222.702 217.75 210.855 225.735 197.658 231.315C183.996 237.091 169.487 240.023 154.536 240.023C139.586 240.023 125.077 237.091 111.415 231.315L111.405 231.311C110.697 231.006 109.989 230.7 109.293 230.383L120.76 224.128C131.32 227.893 142.689 229.954 154.536 229.954C204.672 229.954 246.37 193.138 254.013 145.125L254.001 145.133L254.013 145.12Z" fill="#FAFAFA"/>
          </svg>
          CBTD - Chamada de Trabalhos
        </h1>
        <p style={{ 
          color: '#94A3B8', 
          fontSize: '18px',
          fontWeight: '400',
          margin: 0
        }}>
          Comparativo de Inscrições por Semana (2022-2026)
        </p>
      </div>

      {/* Cards de Resumo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {Object.entries(dadosOriginais).map(([ano, dados]) => (
          <div 
            key={ano}
            onClick={() => toggleAno(ano)}
            style={{
              background: anosAtivos.includes(ano) 
                ? `linear-gradient(135deg, ${cores[ano]}15 0%, ${cores[ano]}08 100%)`
                : 'rgba(30, 41, 59, 0.5)',
              border: `2px solid ${anosAtivos.includes(ano) ? cores[ano] : 'rgba(148, 163, 184, 0.1)'}`,
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: anosAtivos.includes(ano) ? 1 : 0.5
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '700',
                color: cores[ano]
              }}>
                {ano}
              </span>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: cores[ano],
                boxShadow: anosAtivos.includes(ano) ? `0 0 12px ${cores[ano]}` : 'none'
              }} />
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '800',
              color: '#F8FAFC',
              marginBottom: '8px'
            }}>
              {dados.total_inscricoes}
            </div>
            <div style={{ 
              color: '#94A3B8', 
              fontSize: '12px',
              lineHeight: '1.4'
            }}>
              <div>inscrições totais</div>
              <div style={{ marginTop: '4px', color: '#64748B' }}>
                {formatarData(dados.periodo_inicio)} → {formatarData(dados.periodo_fim)}
              </div>
              <div style={{ color: '#64748B' }}>
                {dados.total_semanas} semanas
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          {[
            { id: 'linha', label: '📈 Linha' },
            { id: 'area', label: '📊 Área' },
            { id: 'barra', label: '📶 Barras' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setModoVisualizacao(opt.id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: modoVisualizacao === opt.id 
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)'
                  : 'transparent',
                color: modoVisualizacao === opt.id ? '#FFF' : '#94A3B8',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMostrarAcumulado(!mostrarAcumulado)}
          style={{
            padding: '10px 24px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: mostrarAcumulado 
              ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
              : 'rgba(30, 41, 59, 0.8)',
            color: mostrarAcumulado ? '#FFF' : '#94A3B8',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          {mostrarAcumulado ? '✓ Acumulado' : '○ Acumulado'}
        </button>

        <div style={{ 
          marginLeft: 'auto', 
          color: '#64748B', 
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💡</span>
          <span>Clique nos cards acima para filtrar anos</span>
        </div>
      </div>

      {/* Gráfico Principal */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '32px',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <h3 style={{ 
          margin: '0 0 24px 0', 
          color: '#E2E8F0',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '22px' }}>📅</span>
          {mostrarAcumulado 
            ? 'Evolução Acumulada de Inscrições' 
            : 'Inscrições por Semana (Contagem Regressiva)'
          }
        </h3>
        {renderGrafico()}
        <p style={{
          textAlign: 'center',
          color: '#64748B',
          fontSize: '13px',
          marginTop: '16px',
          fontStyle: 'italic'
        }}>
          Semana 0 = última semana de inscrições | Valores negativos = semanas anteriores ao fechamento
        </p>
      </div>

      {/* Insights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>🏆</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#10B981', fontSize: '14px', fontWeight: '600' }}>
            Maior Volume
          </h4>
          <p style={{ margin: 0, color: '#E2E8F0', fontSize: '28px', fontWeight: '800' }}>
            2024
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>
            955 inscrições totais
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚡</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#F59E0B', fontSize: '14px', fontWeight: '600' }}>
            Concentração na Última Semana
          </h4>
          <p style={{ margin: 0, color: '#E2E8F0', fontSize: '28px', fontWeight: '800' }}>
            ~70%
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>
            média de inscrições no final
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>📍</div>
          <h4 style={{ margin: '0 0 8px 0', color: '#EF4444', fontSize: '14px', fontWeight: '600' }}>
            2026 em Andamento
          </h4>
          <p style={{ margin: 0, color: '#E2E8F0', fontSize: '28px', fontWeight: '800' }}>
            185
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: '13px' }}>
            inscrições até agora (faltam ~1 semana)
          </p>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#E2E8F0',
          fontSize: '18px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '22px' }}>📋</span>
          Detalhamento por Semana
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '14px 16px', 
                  borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
                  color: '#94A3B8',
                  fontWeight: '600',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Semana
                </th>
                {anosAtivos.map(ano => (
                  <th key={ano} style={{ 
                    textAlign: 'right', 
                    padding: '14px 16px', 
                    borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
                    color: cores[ano],
                    fontWeight: '700'
                  }}>
                    {ano}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dadosParaExibir.map((linha, idx) => (
                <tr key={idx} style={{ 
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(148, 163, 184, 0.03)'
                }}>
                  <td style={{ 
                    padding: '12px 16px', 
                    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    color: '#E2E8F0',
                    fontWeight: '500'
                  }}>
                    {linha.semana === 0 ? '🏁 Última Semana' : `${linha.semana} semana${linha.semana > 1 ? 's' : ''} antes`}
                  </td>
                  {anosAtivos.map(ano => (
                    <td key={ano} style={{ 
                      textAlign: 'right', 
                      padding: '12px 16px', 
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                      color: linha[ano] > 0 ? '#F8FAFC' : '#475569',
                      fontWeight: linha[ano] > 50 ? '700' : '400',
                      fontVariantNumeric: 'tabular-nums'
                    }}>
                      {linha[ano] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <td style={{ 
                  padding: '14px 16px', 
                  color: '#E2E8F0',
                  fontWeight: '700',
                  borderTop: '2px solid rgba(148, 163, 184, 0.2)'
                }}>
                  📊 TOTAL
                </td>
                {anosAtivos.map(ano => (
                  <td key={ano} style={{ 
                    textAlign: 'right', 
                    padding: '14px 16px', 
                    color: cores[ano],
                    fontWeight: '800',
                    fontSize: '16px',
                    borderTop: '2px solid rgba(148, 163, 184, 0.2)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {dadosOriginais[ano].total_inscricoes}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        color: '#64748B',
        fontSize: '13px'
      }}>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Desenvolvido com
          <svg width="24" height="28" viewBox="0 0 213 249" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M51.5356 13.1287L24.5871 109.521C23.2052 114.358 26.6601 118.85 31.8425 118.85H52.5721C56.0271 118.85 59.1365 116.431 59.8275 113.322L85.394 22.1116C88.5034 11.0558 80.2115 0 68.8103 0C60.5184 0 53.6085 5.52789 51.5356 13.1287Z" fill="#F40059"/>
            <path d="M124.434 74.9708L101.977 152.707C100.595 157.544 104.05 162.035 108.887 162.035H129.616C133.071 162.035 136.181 159.617 136.872 156.507L159.329 78.7712C160.711 73.9343 157.256 69.4429 152.074 69.4429H131.344C128.58 69.4429 125.471 71.8614 124.434 74.9708Z" fill="#F40059"/>
            <path d="M78.8294 74.9708L68.81 109.52C67.428 114.357 70.883 118.848 75.7199 118.848H96.4495C99.9044 118.848 103.014 116.43 103.705 113.321L113.724 78.7712C115.106 73.9343 111.651 69.4429 106.814 69.4429H86.0847C82.9752 69.4429 79.8659 71.8614 78.8294 74.9708Z" fill="#F40059"/>
            <path d="M199.407 34.8928C189.387 34.8928 180.059 41.8027 177.295 51.4765L144.473 170.326C138.6 170.326 131.69 170.326 131.345 170.326C117.525 170.326 101.632 168.599 95.7588 178.273C93.6858 180.691 92.3038 188.637 90.5763 193.129C88.8489 190.019 80.2115 179.309 78.1386 177.582C70.5377 171.708 56.3724 170.672 46.3531 169.981C44.6257 169.981 43.9347 169.29 43.9347 166.526C45.3167 162.38 46.6987 162.034 48.7716 162.034C54.2995 162.034 62.2459 161.689 66.7373 161.689C92.9948 161.343 86.4304 165.835 95.4132 137.85C97.4862 131.285 95.4133 128.867 88.8489 128.867C69.5013 129.212 47.7352 129.212 28.733 128.867C21.4777 128.867 18.0227 131.631 15.6042 138.886C7.65788 165.144 9.0399 159.27 0.748056 185.528C-2.70688 197.275 6.27595 210.403 18.0227 210.749C21.1322 210.749 28.042 210.749 47.0442 210.749C53.6085 210.749 60.1729 213.167 65.3553 216.968L103.014 247.026C106.469 249.79 111.651 248.062 112.688 243.916L122.016 210.749C133.072 210.749 141.364 210.749 143.437 210.749H164.166C167.621 210.749 170.731 208.33 171.422 205.221L210.808 59.7683C217.372 36.6202 199.407 34.8928 199.407 34.8928Z" fill="#F40059"/>
          </svg>
          pela squad REVELA da Rockbuzz
        </p>
        <p style={{ margin: '8px 0 0 0', opacity: 0.7 }}>
          Dashboard atualizado em 05/01/2026
        </p>
      </div>
    </div>
  );
}
