"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import data from "../../../data.json";

export function generateStaticParams() {
  const days = Object.values(data);
  return days.flatMap((chars, diaIndex) =>
    chars.map((_, charIndex) => ({
      diaIndex: String(diaIndex),
      charIndex: String(charIndex),
    }))
  );
}

type Character = {
  nome: string;
  descrição: string;
  imagem: string;
  imagem_escondida: string;
};

function getImageSrc(path: string): string {
  return "/" + path.replace(/^public[\\/]/, "");
}

function readUnlockedCookie(): string[] {
  if (typeof document === "undefined") return [];
  const match = document.cookie.match(/(?:^|;\s*)unlocked=([^;]*)/);
  if (!match) return [];
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

function writeUnlockedCookie(names: string[]): void {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `unlocked=${encodeURIComponent(JSON.stringify(names))};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
}

function wordMatch(input: string, target: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  if (norm(input) === norm(target)) return true;

  const inputWords = norm(input)
    .split(/[\s\-]+/)
    .filter((w) => w.length >= 3);
  const targetWords = norm(target)
    .split(/[\s\-]+/)
    .filter((w) => w.length >= 3);

  return inputWords.some((iw) => targetWords.includes(iw));
}

export default function PersonagemPage({
  params,
}: {
  params: Promise<{ diaIndex: string; charIndex: string }>;
}) {
  const { diaIndex, charIndex } = use(params);
  const router = useRouter();

  const dayKeys = Object.keys(data);
  const days = Object.values(data) as Character[][];
  const char = days[Number(diaIndex)]?.[Number(charIndex)];
  const dayName = dayKeys[Number(diaIndex)];

  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(readUnlockedCookie());
  }, []);

  if (!char) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        Personagem não encontrado.
      </div>
    );
  }

  const isUnlocked = unlocked.includes(char.nome);

  function handleGuess() {
    if (wordMatch(input, char.nome)) {
      const newUnlocked = [...new Set([...unlocked, char.nome])];
      setUnlocked(newUnlocked);
      writeUnlockedCookie(newUnlocked);
      setError(false);
      setJustUnlocked(true);
    } else {
      setError(true);
    }
  }

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "16px 16px 40px",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={() => router.back()}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 20,
          padding: "6px 8px",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "inherit",
        }}
      >
        ← Voltar
      </button>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          borderRadius: 16,
          overflow: "hidden",
          marginBottom: 24,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
        }}
      >
        <Image
          src={
            isUnlocked
              ? getImageSrc(char.imagem)
              : getImageSrc(char.imagem_escondida)
          }
          alt={isUnlocked ? char.nome : "Personagem desconhecido"}
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          style={{
            objectFit: "cover",
            filter: isUnlocked ? undefined : "blur(6px) brightness(0.5)",
          }}
          priority
        />
      </div>

      {isUnlocked ? (
        <div>
          {justUnlocked && (
            <p
              style={{
                textAlign: "center",
                color: "#61fd7d",
                fontWeight: 600,
                marginBottom: 12,
                fontSize: 15,
              }}
            >
              🎉 Parabéns! Você descobriu quem é!
            </p>
          )}

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            {dayName}
          </p>

          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {char.nome}
          </h2>

          <p style={{ lineHeight: 1.75, color: "#555", fontSize: 15 }}>
            {char.descrição}
          </p>
        </div>
      ) : (
        <div>
          <p
            style={{
              textAlign: "center",
              marginBottom: 20,
              color: "#666",
              fontSize: 15,
            }}
          >
            Você sabe quem é este personagem?
          </p>

          <input
            aria-label="Nome do personagem"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
            placeholder="Digite o nome..."
            style={{
              width: "100%",
              padding: "13px 14px",
              fontSize: 16,
              borderRadius: 10,
              border: error ? "2px solid #ef4444" : "1.5px solid #ddd",
              outline: "none",
              marginBottom: error ? 6 : 14,
              background: "var(--background)",
              color: "var(--foreground)",
            }}
          />

          {error && (
            <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 14 }}>
              Tente novamente!
            </p>
          )}

          <button
            onClick={handleGuess}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: 16,
              fontWeight: 600,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
}
