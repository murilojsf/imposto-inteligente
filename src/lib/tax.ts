// Cálculos tributários — simulação educacional. Valores baseados em tabelas vigentes (2024/2025).
// Não constitui aconselhamento jurídico/contábil.

export type RegimePJ = "MEI" | "SIMPLES" | "LTDA" | "SLU";

export interface SimInput {
  rendaMensal: number;
  custosMensais: number;
  regimePJ: RegimePJ;
  anexoSimples: "III" | "V"; // III serviços comuns, V intelectuais
}

// ---------- PF ----------
// IRPF tabela mensal 2024+
const IRPF_FAIXAS = [
  { ate: 2259.2, aliq: 0, deduz: 0 },
  { ate: 2826.65, aliq: 0.075, deduz: 169.44 },
  { ate: 3751.05, aliq: 0.15, deduz: 381.44 },
  { ate: 4664.68, aliq: 0.225, deduz: 662.77 },
  { ate: Infinity, aliq: 0.275, deduz: 896.0 },
];

const TETO_INSS_PF = 8157.41;
const INSS_PF_FAIXAS = [
  { ate: 1412.0, aliq: 0.075 },
  { ate: 2666.68, aliq: 0.09 },
  { ate: 4000.03, aliq: 0.12 },
  { ate: TETO_INSS_PF, aliq: 0.14 },
];

export function calcInssPF(salario: number) {
  let inss = 0;
  let anterior = 0;
  const base = Math.min(salario, TETO_INSS_PF);
  for (const f of INSS_PF_FAIXAS) {
    if (base > anterior) {
      const tramo = Math.min(base, f.ate) - anterior;
      inss += tramo * f.aliq;
      anterior = f.ate;
    }
  }
  return inss;
}

export function calcIRPF(baseTributavel: number) {
  for (const f of IRPF_FAIXAS) {
    if (baseTributavel <= f.ate) {
      return Math.max(0, baseTributavel * f.aliq - f.deduz);
    }
  }
  return 0;
}

export interface ResultadoPF {
  bruto: number;
  inss: number;
  irpf: number;
  totalImpostos: number;
  liquido: number;
  aliquotaEfetiva: number;
}

export function simularPF(rendaMensal: number): ResultadoPF {
  // Autônomo recebendo de PJ: carnê-leão. INSS contribuinte individual ~ 11% até teto (simplificado contributivo).
  const inss = calcInssPF(rendaMensal);
  const baseIR = Math.max(0, rendaMensal - inss);
  const irpf = calcIRPF(baseIR);
  const totalImpostos = inss + irpf;
  const liquido = rendaMensal - totalImpostos;
  return {
    bruto: rendaMensal,
    inss,
    irpf,
    totalImpostos,
    liquido,
    aliquotaEfetiva: rendaMensal > 0 ? totalImpostos / rendaMensal : 0,
  };
}

// ---------- PJ ----------
// MEI: DAS fixo (serviços) ~ R$ 75,90/mês (2025). Limite faturamento R$ 81.000/ano.
const MEI_DAS = 75.9;
const MEI_LIMITE_ANUAL = 81000;

// Simples Nacional Anexo III (serviços) — RBT12 base
const SIMPLES_III = [
  { ate: 180000, aliq: 0.06, deduz: 0 },
  { ate: 360000, aliq: 0.112, deduz: 9360 },
  { ate: 720000, aliq: 0.135, deduz: 17640 },
  { ate: 1800000, aliq: 0.16, deduz: 35640 },
  { ate: 3600000, aliq: 0.21, deduz: 125640 },
  { ate: 4800000, aliq: 0.33, deduz: 648000 },
];
// Anexo V (intelectuais sem fator R)
const SIMPLES_V = [
  { ate: 180000, aliq: 0.155, deduz: 0 },
  { ate: 360000, aliq: 0.18, deduz: 4500 },
  { ate: 720000, aliq: 0.195, deduz: 9900 },
  { ate: 1800000, aliq: 0.205, deduz: 17100 },
  { ate: 3600000, aliq: 0.23, deduz: 62100 },
  { ate: 4800000, aliq: 0.305, deduz: 540000 },
];

function aliqSimples(rbt12: number, anexo: "III" | "V") {
  const tabela = anexo === "III" ? SIMPLES_III : SIMPLES_V;
  for (const f of tabela) {
    if (rbt12 <= f.ate) {
      return Math.max(0, (rbt12 * f.aliq - f.deduz) / rbt12);
    }
  }
  return 0;
}

const SALARIO_MINIMO = 1412;
const INSS_PJ_PROLABORE = 0.11; // 11% sobre pró-labore (contribuinte individual via empresa) - simplificado
const IRRF_PROLABORE_USA_TABELA = true;
const CONTADOR_PADRAO = 200; // mensal estimado
const CONTADOR_MEI = 0;

export interface ResultadoPJ {
  regime: RegimePJ;
  bruto: number;
  das: number;
  inssProlabore: number;
  irrfProlabore: number;
  custosOperacionais: number;
  contador: number;
  prolabore: number;
  distribuicaoLucros: number;
  totalImpostos: number;
  totalCustos: number;
  liquido: number;
  aliquotaEfetiva: number;
  aviso?: string;
}

export function simularPJ(input: SimInput): ResultadoPJ {
  const { rendaMensal, custosMensais, regimePJ, anexoSimples } = input;
  const bruto = rendaMensal;
  const anual = bruto * 12;

  if (regimePJ === "MEI") {
    const aviso =
      anual > MEI_LIMITE_ANUAL
        ? `Faturamento anual (R$ ${anual.toLocaleString("pt-BR")}) excede o limite MEI (R$ 81.000).`
        : undefined;
    const contador = CONTADOR_MEI;
    const totalImpostos = MEI_DAS;
    const totalCustos = custosMensais + contador;
    const liquido = bruto - totalImpostos - totalCustos;
    return {
      regime: "MEI",
      bruto,
      das: MEI_DAS,
      inssProlabore: 0,
      irrfProlabore: 0,
      custosOperacionais: custosMensais,
      contador,
      prolabore: 0,
      distribuicaoLucros: liquido,
      totalImpostos,
      totalCustos,
      liquido,
      aliquotaEfetiva: bruto > 0 ? totalImpostos / bruto : 0,
      aviso,
    };
  }

  // Simples / LTDA / SLU — modelo: Simples Nacional
  const rbt12 = anual;
  const aliq = aliqSimples(rbt12, anexoSimples);
  const das = bruto * aliq;

  // Pró-labore: mínimo = 1 salário mínimo (simplificação). Para Anexo V sem fator R, pró-labore ≥ 28% do faturamento ajuda fator R, mas mantemos mínimo.
  const prolabore = Math.max(SALARIO_MINIMO, 0);
  const inssProlabore = prolabore * INSS_PJ_PROLABORE;
  const baseIR = Math.max(0, prolabore - inssProlabore);
  const irrfProlabore = IRRF_PROLABORE_USA_TABELA ? calcIRPF(baseIR) : 0;

  const contador = CONTADOR_PADRAO;
  const totalImpostos = das + inssProlabore + irrfProlabore;
  const totalCustos = custosMensais + contador;
  const lucroDistribuivel = bruto - das - prolabore - custosMensais;
  const distribuicaoLucros = Math.max(0, lucroDistribuivel); // isento de IR
  const liquido =
    (prolabore - inssProlabore - irrfProlabore) + distribuicaoLucros - contador;

  return {
    regime: regimePJ,
    bruto,
    das,
    inssProlabore,
    irrfProlabore,
    custosOperacionais: custosMensais,
    contador,
    prolabore,
    distribuicaoLucros,
    totalImpostos,
    totalCustos,
    liquido,
    aliquotaEfetiva: bruto > 0 ? totalImpostos / bruto : 0,
  };
}

export function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
}
export function pct(v: number) {
  return (v * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 }) + "%";
}
