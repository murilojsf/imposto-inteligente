import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, Calculator, Info, TrendingDown, TrendingUp } from "lucide-react";
import {
  brl,
  pct,
  simularPF,
  simularPJ,
  type RegimePJ,
} from "@/lib/tax";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Simulador PF vs PJ — Comparação tributária" },
      { name: "description", content: "Simule IRPF, INSS e custos PJ para comparar sua renda líquida mensal e anual." },
      { property: "og:title", content: "Simulador PF vs PJ — Comparação tributária" },
      { property: "og:description", content: "Simule IRPF, INSS e custos PJ para comparar sua renda líquida mensal e anual." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

function Index() {
  const [rendaMensal, setRendaMensal] = useState(15000);
  const [atividade, setAtividade] = useState("Consultoria / Desenvolvimento");
  const [possuiCustos, setPossuiCustos] = useState("nao");
  const [custos, setCustos] = useState(300);
  const [estado, setEstado] = useState("SP");
  const [cidade, setCidade] = useState("São Paulo");
  const [regime, setRegime] = useState<RegimePJ>("SIMPLES");
  const [anexo, setAnexo] = useState<"III" | "V">("III");

  const custosFinal = possuiCustos === "sim" ? custos : 0;

  const pf = useMemo(() => simularPF(rendaMensal), [rendaMensal]);
  const pj = useMemo(
    () =>
      simularPJ({
        rendaMensal,
        custosMensais: custosFinal,
        regimePJ: regime,
        anexoSimples: anexo,
      }),
    [rendaMensal, custosFinal, regime, anexo],
  );

  const diff = pj.liquido - pf.liquido;
  const melhor = diff >= 0 ? "PJ" : "PF";
  const economiaMensal = Math.abs(diff);
  const economiaAnual = economiaMensal * 12;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">Simulador PF vs PJ</h1>
              <p className="text-xs text-muted-foreground">DARF · IRPF · DAS · Simples Nacional</p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Simulação tributária educacional
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* FORM */}
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Seus dados</CardTitle>
            <CardDescription>Cálculo em tempo real conforme você ajusta os campos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="renda">Renda mensal</Label>
                <span className="text-sm font-semibold tabular-nums">{brl(rendaMensal)}</span>
              </div>
              <Input
                id="renda"
                type="number"
                min={0}
                step={500}
                value={rendaMensal}
                onChange={(e) => setRendaMensal(Number(e.target.value) || 0)}
              />
              <Slider
                value={[rendaMensal]}
                min={1000}
                max={50000}
                step={500}
                onValueChange={([v]) => setRendaMensal(v)}
              />
              <p className="text-xs text-muted-foreground">
                Renda anual estimada: <span className="font-medium">{brl(rendaMensal * 12)}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Atividade exercida</Label>
              <Input value={atividade} onChange={(e) => setAtividade(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Possui custos?</Label>
                <Select value={possuiCustos} onValueChange={setPossuiCustos}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="sim">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Custos mensais</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={possuiCustos === "nao"}
                  value={custos}
                  onChange={(e) => setCustos(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    {ESTADOS.map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Regime PJ desejado</Label>
              <Select value={regime} onValueChange={(v) => setRegime(v as RegimePJ)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEI">MEI</SelectItem>
                  <SelectItem value="SIMPLES">Simples Nacional</SelectItem>
                  <SelectItem value="LTDA">LTDA (Simples)</SelectItem>
                  <SelectItem value="SLU">SLU (Simples)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {regime !== "MEI" && (
              <div className="space-y-2">
                <Label>Anexo do Simples</Label>
                <Select value={anexo} onValueChange={(v) => setAnexo(v as "III" | "V")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="III">Anexo III (serviços / fator R aplicável)</SelectItem>
                    <SelectItem value="V">Anexo V (intelectuais sem fator R)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RESULTS */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className={`border-2 ${diff >= 0 ? "border-emerald-500/40" : "border-amber-500/40"}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription>Melhor cenário tributário</CardDescription>
                  <CardTitle className="text-2xl mt-1">
                    {melhor === "PJ" ? `PJ — ${labelRegime(regime)}` : "Pessoa Física"}
                  </CardTitle>
                </div>
                <Badge
                  className={
                    diff >= 0
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15"
                  }
                >
                  {diff >= 0 ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
                  {melhor}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Metric label="Economia mensal" value={brl(economiaMensal)} accent />
                <Metric label="Economia anual" value={brl(economiaAnual)} accent />
              </div>
              <ComparisonBar pfLiquido={pf.liquido} pjLiquido={pj.liquido} bruto={rendaMensal} />
            </CardContent>
          </Card>

          {/* PF vs PJ cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pessoa Física</CardTitle>
                  <Badge variant="outline">IRPF + INSS</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Bruto" value={brl(pf.bruto)} />
                <Row label="INSS" value={`- ${brl(pf.inss)}`} muted />
                <Row label="IRPF (DARF)" value={`- ${brl(pf.irpf)}`} muted />
                <div className="h-px bg-border my-2" />
                <Row label="Total impostos" value={brl(pf.totalImpostos)} bold />
                <Row label="Alíquota efetiva" value={pct(pf.aliquotaEfetiva)} muted />
                <Row label="Líquido" value={brl(pf.liquido)} bold highlight />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Pessoa Jurídica</CardTitle>
                  <Badge variant="outline">{labelRegime(regime)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Faturamento" value={brl(pj.bruto)} />
                {regime === "MEI" ? (
                  <Row label="DAS (fixo)" value={`- ${brl(pj.das)}`} muted />
                ) : (
                  <>
                    <Row label="DAS / Simples" value={`- ${brl(pj.das)}`} muted />
                    <Row label="Pró-labore" value={brl(pj.prolabore)} muted />
                    <Row label="INSS pró-labore" value={`- ${brl(pj.inssProlabore)}`} muted />
                    <Row label="IRRF pró-labore" value={`- ${brl(pj.irrfProlabore)}`} muted />
                    <Row label="Distribuição lucros (isenta)" value={brl(pj.distribuicaoLucros)} muted />
                  </>
                )}
                <Row label="Custos operacionais" value={`- ${brl(pj.custosOperacionais)}`} muted />
                <Row label="Contador" value={`- ${brl(pj.contador)}`} muted />
                <div className="h-px bg-border my-2" />
                <Row label="Total impostos" value={brl(pj.totalImpostos)} bold />
                <Row label="Alíquota efetiva" value={pct(pj.aliquotaEfetiva)} muted />
                <Row label="Líquido" value={brl(pj.liquido)} bold highlight />
                {pj.aviso && (
                  <Alert className="mt-3">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription className="text-xs">{pj.aviso}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Simulação tributária educacional</AlertTitle>
            <AlertDescription className="text-xs leading-relaxed">
              Os valores são estimativas baseadas em tabelas vigentes (IRPF, INSS, Simples Nacional, MEI) e podem variar conforme situação específica, deduções, dependentes, fator R, ISS municipal e outros. Não constitui aconselhamento jurídico ou contábil. Consulte um contador antes de tomar decisões.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <footer className="border-t mt-8 py-6 text-center text-xs text-muted-foreground">
        Simulador PF vs PJ · Cálculo local · Sem armazenamento de dados
      </footer>
    </div>
  );
}

function labelRegime(r: RegimePJ) {
  return r === "MEI"
    ? "MEI"
    : r === "SIMPLES"
    ? "Simples Nacional"
    : r === "LTDA"
    ? "LTDA"
    : "SLU";
}

function Row({
  label,
  value,
  bold,
  muted,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span
        className={`tabular-nums ${bold ? "font-semibold" : ""} ${
          highlight ? "text-emerald-600 dark:text-emerald-400 text-base" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function ComparisonBar({
  pfLiquido,
  pjLiquido,
  bruto,
}: {
  pfLiquido: number;
  pjLiquido: number;
  bruto: number;
}) {
  const max = Math.max(pfLiquido, pjLiquido, bruto, 1);
  const pfPct = Math.max(0, (pfLiquido / max) * 100);
  const pjPct = Math.max(0, (pjLiquido / max) * 100);
  return (
    <div className="mt-6 space-y-3">
      <BarRow label="PF líquido" value={brl(pfLiquido)} pct={pfPct} color="bg-slate-400" />
      <BarRow label="PJ líquido" value={brl(pjLiquido)} pct={pjPct} color="bg-emerald-500" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <ArrowRight className="h-3 w-3" />
        Comparativo do que efetivamente entra no seu bolso.
      </div>
    </div>
  );
}

function BarRow({ label, value, pct: p, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}
