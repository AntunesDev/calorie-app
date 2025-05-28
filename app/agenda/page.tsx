'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Trash2, PlusCircle } from "lucide-react";

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgendaAlimentar() {
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [dia, setDia] = useState(hoje());
  const [log, setLog] = useState<{ alimentos: any[]; calorias_total: number }>({ alimentos: [], calorias_total: 0 });
  const [prompt, setPrompt] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/alimentos').then(r => r.json()).then(setAlimentos);
  }, []);

  useEffect(() => {
    fetch('/api/foodlog?data=' + dia)
      .then(r => r.json())
      .then(res => {
        setLog({
          alimentos: Array.isArray(res.alimentos) ? res.alimentos.filter(isAlimentoValido) : [],
          calorias_total: typeof res.calorias_total === "number" ? res.calorias_total : 0,
        });
      });
  }, [dia]);

  function isAlimentoValido(a: any) {
    return a && typeof a === 'object' && a.nome && a.unidade && typeof a.quantidade === "number";
  }

  // Atualiza log (agenda) no backend
  function syncLog(alimentosAtualizados: any[]) {
    setSaving(true);
    fetch('/api/foodlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: dia, alimentos: alimentosAtualizados.filter(isAlimentoValido) })
    })
      .then(r => r.json())
      .then(res => {
        setLog({
          alimentos: Array.isArray(res.alimentos) ? res.alimentos.filter(isAlimentoValido) : [],
          calorias_total: typeof res.calorias_total === "number" ? res.calorias_total : 0,
        });
        setSaving(false);
        toast({ title: "Agenda atualizada!"});
      });
  }

  // Ao adicionar um alimento
  function adicionarItem(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setSaving(true);
    fetch('/api/foodlog/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, dia })
    })
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          toast({ title: "Erro: " + res.error});
        } else if (res.item && isAlimentoValido(res.item)) {
          const novosAlimentos = [...(log.alimentos || []), res.item];
          setPrompt("");
          syncLog(novosAlimentos); // já salva e atualiza log!
        } else {
          toast({ title: "Erro: Alimento inválido retornado pela IA."});
        }
        setSaving(false);
      })
      .catch(() => {
        setSaving(false);
        toast({ title: "Erro ao adicionar alimento"});
      });
  }

  // Ao remover um alimento
  function removerItem(index: number) {
    const novos = [...log.alimentos];
    novos.splice(index, 1);
    syncLog(novos); // já salva
  }

  return (
    <Card className="shadow-xl border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl max-w-lg mx-auto">
      <CardContent className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-primary">Data:</label>
          <Input
            type="date"
            value={dia}
            onChange={e => setDia(e.target.value)}
            className="w-full rounded-xl"
          />
        </div>

        <form onSubmit={adicionarItem} className="flex flex-col gap-2 mb-4">
          <Input
            type="text"
            placeholder="Ex: 2 ovos cozidos, 100g arroz, 1 banana"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="rounded-xl"
            disabled={saving}
          />
          <Button type="submit" className="w-full rounded-xl flex gap-2 items-center" disabled={saving || !prompt}>
            <PlusCircle size={18} /> Adicionar
          </Button>
        </form>

        <div>
          <div className="font-bold mb-2 text-lg text-primary">Alimentos do Dia</div>
          {(!log.alimentos || log.alimentos.length === 0) && (
            <p className="text-muted-foreground mb-3">Nenhum alimento adicionado ainda.</p>
          )}
          <ul className="space-y-2">
            {(log.alimentos || []).map((a: any, i: number) =>
              isAlimentoValido(a) ? (
                <li
                  key={i}
                  className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 shadow-sm"
                >
                  <span className="flex-1">{a.nome} — <b>{a.quantidade} {a.unidade}</b> - <b>{a.calorias} kcal</b></span>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removerItem(i)}
                    className="rounded-full"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </Button>
                </li>
              ) : null
            )}
          </ul>
          <p className="mt-4 text-base font-bold text-accent">
            Calorias totais estimadas: <span className="font-extrabold text-primary">{Math.round(log.calorias_total)} kcal</span>
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full mt-4 rounded-xl"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </CardContent>
    </Card>
  );
}
