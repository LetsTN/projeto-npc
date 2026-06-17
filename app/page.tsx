"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import data from "./data.json";

type Character = {
  nome: string;
  descrição: string;
  imagem: string;
  imagem_escondida: string;
};

const ICON_COLORS = ["#ffe708", "#b414f7", "#35cfff", "#61fd7d", "#ff3131"];

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

export default function Home() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => setUnlocked(readUnlockedCookie());
    refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, []);

  const days = Object.entries(data) as [string, Character[]][];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 0 40px" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
        <Image
          src="/topo.png"
          alt="Topo"
          fill
          sizes="(max-width: 480px) 100vw, 480px"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <p
        style={{
          textAlign: "center",
          fontSize: 15,
          color: "#666",
          padding: "16px 24px 28px",
          lineHeight: 1.5,
        }}
      >
        Converse e conheça personalidades do espiritismo
      </p>

      {days.map(([dia, chars], diaIdx) => (
        <section key={dia} style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "#888",
              marginBottom: 12,
              padding: "0 16px",
            }}
          >
            {dia}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            {chars.map((char, charIdx) => {
              const isUnlocked = unlocked.includes(char.nome);
              const offset = days
                .slice(0, diaIdx)
                .reduce((sum, [, c]) => sum + c.length, 0);
              const iconColor =
                ICON_COLORS[(offset + charIdx) % ICON_COLORS.length];
              return (
                <button
                  key={char.nome}
                  onClick={() =>
                    router.push(`/personagem/${diaIdx}/${charIdx}`)
                  }
                  style={{
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                    background: "var(--background)",
                    borderRadius: 0,
                    overflow: "hidden",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1",
                      overflow: "hidden",
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
                      sizes="100vw"
                      style={{
                        objectFit: "cover",
                        filter: isUnlocked
                          ? undefined
                          : "blur(6px) brightness(0.5)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "8px 6px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: isUnlocked ? "var(--foreground)" : "#aaa",
                    }}
                  >
                    {isUnlocked ? (
                      char.nome
                    ) : (
                      <div
                        style={{
                          background: iconColor,
                          borderRadius: "50%",
                          width: 96,
                          height: 96,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        <Image
                          src={`/${charIdx + 1}.svg`}
                          alt="Personagem desconhecido"
                          width={96}
                          height={96}
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
