'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { User, ArrowLeft, Pencil } from "lucide-react"; // npm install lucide-react

export default function Perfil() {
  const [form, setForm] = useState({ sexo: '', idade: '', peso: '', altura: '', exercicio_horas: '' });
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/perfil')
      .then(res => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          sexo: data.sexo || '',
          idade: data.idade || '',
          peso: data.peso || '',
          altura: data.altura || '',
          exercicio_horas: data.exercicio_horas || ''
        });
      }).catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/perfil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        idade: Number(form.idade),
        peso: Number(form.peso),
        altura: Number(form.altura),
        exercicio_horas: Number(form.exercicio_horas),
      })
    });
    const data = await res.json();
    setUser(data);
    setSaving(false);
    toast({ title: "Perfil salvo!" });
  };

  if (user) {
    return (
      <Card className="shadow-xl border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl max-w-lg mx-auto">
        <CardHeader className="flex flex-col items-center gap-2">
          <User size={38} className="text-primary" />
          <CardTitle className="text-primary text-lg font-bold">Seu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-muted rounded-xl p-4 mb-4">
            <div><b className="text-primary">Sexo:</b> {user.sexo}</div>
            <div><b className="text-primary">Idade:</b> {user.idade} anos</div>
            <div><b className="text-primary">Peso:</b> {user.peso} kg</div>
            <div><b className="text-primary">Altura:</b> {user.altura} cm</div>
            <div><b className="text-primary">Exercício/dia:</b> {user.exercicio_horas} horas</div>
          </div>
          <div className="bg-accent/10 rounded-xl p-4 mb-4">
            <div><b className="text-accent">TMB:</b> {Math.round(user.tmb)} kcal</div>
            <div><b className="text-accent">Calorias manutenção:</b> {Math.round(user.calorias_manutencao)} kcal</div>
            <div><b className="text-accent">Déficit recomendado:</b> {Math.round(user.deficit)} kcal/dia</div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setUser(null)}
              className="flex gap-2 items-center border-primary text-primary hover:bg-primary/10"
            >
              <Pencil size={16} /> Editar Perfil
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="flex gap-2 items-center"
            >
              <ArrowLeft size={16} /> Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl max-w-lg mx-auto">
      <CardHeader className="flex flex-col items-center gap-2">
        <User size={38} className="text-primary" />
        <CardTitle className="text-primary text-lg font-bold">Cadastro do Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label className="text-primary font-semibold">Sexo</Label>
            <Select value={form.sexo} onValueChange={v => handleChange("sexo", v)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-primary font-semibold">Idade</Label>
            <Input
              type="number"
              value={form.idade}
              onChange={e => handleChange("idade", e.target.value)}
              required
              placeholder="Ex: 28"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-primary font-semibold">Peso (kg)</Label>
            <Input
              type="number"
              value={form.peso}
              onChange={e => handleChange("peso", e.target.value)}
              required
              placeholder="Ex: 75"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-primary font-semibold">Altura (cm)</Label>
            <Input
              type="number"
              value={form.altura}
              onChange={e => handleChange("altura", e.target.value)}
              required
              placeholder="Ex: 172"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-primary font-semibold">Horas de exercício/dia</Label>
            <Input
              type="number"
              step="0.1"
              value={form.exercicio_horas}
              onChange={e => handleChange("exercicio_horas", e.target.value)}
              required
              placeholder="Ex: 1"
              className="rounded-xl"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full rounded-xl mt-2"
            onClick={() => router.back()}
          >
            Voltar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
