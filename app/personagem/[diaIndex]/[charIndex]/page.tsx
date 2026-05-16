import data from "../../../data.json";
import PersonagemClient from "./PersonagemClient";

export function generateStaticParams() {
  const days = Object.values(data);
  return days.flatMap((chars, diaIndex) =>
    chars.map((_, charIndex) => ({
      diaIndex: String(diaIndex),
      charIndex: String(charIndex),
    })),
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ diaIndex: string; charIndex: string }>;
}) {
  return <PersonagemClient params={params} />;
}
