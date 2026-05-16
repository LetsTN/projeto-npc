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

function getImageSrc(path: string): string {
  return "/" + path.replace(/^public[\\/]/, "");
}

const ICON_COLORS = ["#ffe708", "#b414f7", "#35cfff", "#61fd7d", "#ff3131"];

const QM_PATH =
  "M 157.75 -227.671875 C 113.835938 -230.035156 62.828125 -226.660156 10.472656 -224.96875 C 3.039062 -185.109375 11.148438 -144.238281 14.523438 -102.6875 C 17.902344 -60.128906 18.578125 -17.226562 20.941406 26.011719 C 70.597656 31.414062 120.929688 39.183594 171.597656 41.210938 C 168.21875 -35.46875 164.167969 -114.847656 160.453125 -195.242188 C 160.113281 -206.054688 161.464844 -217.539062 157.75 -227.671875 Z M 86.136719 -90.867188 C 83.433594 -82.082031 85.800781 -72.289062 85.800781 -62.828125 C 76.679688 -61.140625 67.558594 -60.800781 59.453125 -61.140625 C 59.113281 -67.222656 58.101562 -75.664062 58.101562 -82.082031 C 58.777344 -99.648438 67.894531 -109.78125 74.988281 -122.28125 C 77.355469 -125.660156 80.394531 -129.710938 82.082031 -133.765625 C 85.125 -142.546875 86.136719 -157.410156 82.421875 -169.910156 C 78.707031 -180.382812 63.167969 -187.8125 54.046875 -177.003906 C 50.667969 -170.246094 49.992188 -163.492188 50.332031 -154.035156 C 40.535156 -153.359375 34.453125 -151.667969 24.320312 -152.34375 C 21.957031 -184.433594 36.480469 -206.730469 62.492188 -209.769531 C 98.636719 -213.148438 114.847656 -183.082031 111.132812 -142.210938 C 109.78125 -125.660156 99.988281 -113.835938 93.230469 -102.6875 C 90.867188 -98.636719 87.488281 -94.582031 86.136719 -90.867188 Z M 58.777344 -37.496094 C 68.570312 -39.183594 78.707031 -39.183594 89.515625 -40.199219 C 89.851562 -28.375 91.203125 -18.578125 91.203125 -5.40625 C 82.421875 -4.390625 71.273438 -3.378906 60.464844 -3.378906 C 59.113281 -14.1875 58.777344 -26.347656 58.777344 -37.496094 Z M 124.644531 -91.878906 C 124.308594 -88.839844 124.644531 -86.136719 123.632812 -81.40625 C 123.632812 -81.070312 123.632812 -77.691406 123.292969 -79.71875 C 123.96875 -83.097656 122.957031 -88.839844 124.644531 -91.878906 Z M 122.957031 -69.246094 C 122.28125 -70.261719 123.292969 -72.964844 122.957031 -74.3125 C 123.96875 -73.300781 122.957031 -70.9375 122.957031 -69.246094 Z M 120.929688 -38.847656 C 121.265625 -39.183594 121.941406 -39.859375 121.605469 -39.183594 C 121.265625 -22.632812 121.941406 -2.703125 119.917969 15.539062 C 119.242188 7.769531 120.253906 -2.027344 120.59375 -11.484375 C 121.265625 -21.28125 121.265625 -31.078125 120.929688 -38.847656 Z M 44.925781 13.511719 C 52.359375 11.484375 63.503906 12.835938 72.289062 15.539062 C 61.140625 14.863281 54.722656 13.511719 44.925781 13.511719 Z M 44.925781 13.511719";

function QuestionMarkIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 396.75 396.749985"
      width={28}
      height={28}
      aria-hidden="true"
    >
      <g transform="translate(100, 27)">
        <g fill={color} fillOpacity="1">
          <g transform="translate(0.858029, 254.378699)">
            <path d={QM_PATH} />
          </g>
        </g>
      </g>
    </svg>
  );
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
                      <QuestionMarkIcon color={iconColor} />
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
