'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User, PlusCircle } from "lucide-react"; // npm install lucide-react

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [log, setLog] = useState({ calorias_total: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/perfil')
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          router.replace('/perfil');
        } else {
          setUser(data);
        }
        setLoading(false);
      });
  }, [router]);

  useEffect(() => {
    fetch('/api/foodlog?data=' + hoje())
      .then(r => r.json())
      .then(setLog)
      .catch(() => setLog({ calorias_total: 0 }));
  }, []);

  if (loading) return <Card className="p-6 mt-8 text-center">Carregando...</Card>;
  if (!user) return null;

  const restante = Math.round(user.deficit - (log.calorias_total || 0));
  const percentual = Math.min(100, Math.round((log.calorias_total / user.deficit) * 100));

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <Card className="shadow-xl border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <User size={38} className="text-primary" />
          <CardTitle className="text-primary text-lg font-bold">Consumo de hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={percentual} className="h-3 bg-primary/10 [&>*]:bg-primary rounded-full" />
          <div className="mt-3 font-bold text-2xl text-primary text-center">
            {Math.round(log.calorias_total || 0)} / {Math.round(user.deficit)} kcal
          </div>
          <div className="mt-1 text-sm text-center text-muted-foreground">
            {percentual}% da sua meta diária
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl border-2 border-primary/40 bg-white/90 backdrop-blur-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-accent font-bold text-center">Resumo Diário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <div>Déficit diário recomendado: <b className="text-primary">{Math.round(user.deficit)} kcal</b></div>
          <div>Calorias consumidas hoje: <b className="text-primary">{Math.round(log.calorias_total || 0)} kcal</b></div>
          <div>
            Restante para consumir:&nbsp;
            <b className={restante > 0 ? "text-green-700" : "text-red-700"}>
              {restante > 0 ? restante : 0} kcal
            </b>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push('/perfil')}
          className="flex gap-2 items-center border-primary text-primary hover:bg-primary/10 rounded-xl font-semibold"
        >
          <User size={16} /> Editar Perfil
        </Button>
        <Button
          onClick={() => router.push('/agenda')}
          className="flex gap-2 items-center bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold"
        >
          <PlusCircle size={18} /> Adicionar Alimentos
        </Button>
      </div>
    </div>
  );
}
