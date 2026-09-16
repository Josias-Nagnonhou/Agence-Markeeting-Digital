"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { SectionType } from "@/generated/prisma/enums";
import {
  retouchToneOptions,
  retouchLengthOptions,
  type RetouchTone,
  type RetouchLength,
} from "@/lib/ai/prompts/section-retouch";

const sectionTitles: Partial<Record<SectionType, string>> = {
  HEADLINE: "Headline",
  SUBHEADLINE: "Sous-titre",
  PROBLEM_AGITATION: "Problème / agitation",
  BENEFITS: "Bénéfices",
  SOCIAL_PROOF: "Preuves sociales",
  OBJECTIONS: "Gestion des objections",
  CTA: "Appel à l'action",
};

export interface SectionData {
  id: string;
  type: SectionType;
  content: unknown;
}

export function SectionEditor({ section, pageId }: { section: SectionData; pageId: string }) {
  const [content, setContent] = useState(section.content as Record<string, unknown>);
  const [version, setVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSavedRef = useRef(JSON.stringify(section.content));

  const [tone, setTone] = useState<RetouchTone>("STANDARD");
  const [length, setLength] = useState<RetouchLength>("STANDARD");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  async function save(nextContent: Record<string, unknown>) {
    const serialized = JSON.stringify(nextContent);
    if (serialized === lastSavedRef.current) return;

    setContent(nextContent);
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}/sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Échec de l'enregistrement.");
      lastSavedRef.current = serialized;
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRegenerate() {
    setIsRegenerating(true);
    setRegenerateError(null);
    try {
      const response = await fetch(`/api/pages/${pageId}/sections/${section.id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone, length }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "La retouche IA a échoué.");

      const newContent = body.section.content as Record<string, unknown>;
      lastSavedRef.current = JSON.stringify(newContent);
      setContent(newContent);
      setVersion((v) => v + 1);
    } catch (err) {
      setRegenerateError(err instanceof Error ? err.message : "La retouche IA a échoué.");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{sectionTitles[section.type] ?? section.type}</h3>
        <span className="text-xs text-gray-400">
          {isSaving ? "Enregistrement..." : savedAt ? "Enregistré ✓" : ""}
        </span>
      </div>

      <SectionFields key={version} type={section.type} content={content} onBlurSave={save} />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <Select
          value={tone}
          onChange={(e) => setTone(e.target.value as RetouchTone)}
          className="h-8 w-auto text-xs"
        >
          {retouchToneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={length}
          onChange={(e) => setLength(e.target.value as RetouchLength)}
          className="h-8 w-auto text-xs"
        >
          {retouchLengthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Button variant="secondary" size="sm" onClick={handleRegenerate} isLoading={isRegenerating}>
          Régénérer avec l&apos;IA
        </Button>
        {regenerateError && <p className="text-xs text-red-600">{regenerateError}</p>}
      </div>
    </Card>
  );
}

function SectionFields({
  type,
  content,
  onBlurSave,
}: {
  type: SectionType;
  content: Record<string, unknown>;
  onBlurSave: (content: Record<string, unknown>) => void;
}) {
  const [local, setLocal] = useState(content);

  function update(next: Record<string, unknown>) {
    setLocal(next);
  }

  switch (type) {
    case "HEADLINE":
    case "SUBHEADLINE":
      return (
        <div>
          <Label>Texte</Label>
          <Textarea
            defaultValue={local.text as string}
            onChange={(e) => update({ ...local, text: e.target.value })}
            onBlur={() => onBlurSave(local)}
          />
        </div>
      );

    case "PROBLEM_AGITATION":
      return (
        <div className="space-y-3">
          <div>
            <Label>Titre</Label>
            <Input
              defaultValue={local.title as string}
              onChange={(e) => update({ ...local, title: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
          <div>
            <Label>Texte</Label>
            <Textarea
              defaultValue={local.body as string}
              onChange={(e) => update({ ...local, body: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
        </div>
      );

    case "BENEFITS": {
      const items = (local.items as string[]) ?? [];
      return (
        <div className="space-y-3">
          <div>
            <Label>Titre</Label>
            <Input
              defaultValue={local.title as string}
              onChange={(e) => update({ ...local, title: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
          <div>
            <Label>Bénéfices (un par ligne)</Label>
            <Textarea
              defaultValue={items.join("\n")}
              onChange={(e) => update({ ...local, items: e.target.value.split("\n").filter(Boolean) })}
              onBlur={() => onBlurSave(local)}
              rows={5}
            />
          </div>
        </div>
      );
    }

    case "SOCIAL_PROOF": {
      const testimonials = (local.testimonials as { author: string; role?: string; quote: string }[]) ?? [];
      return (
        <div className="space-y-3">
          <div>
            <Label>Titre</Label>
            <Input
              defaultValue={local.title as string}
              onChange={(e) => update({ ...local, title: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 rounded-lg border border-gray-100 p-3">
              <Input
                placeholder="Auteur"
                defaultValue={testimonial.author}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[index] = { ...next[index], author: e.target.value };
                  update({ ...local, testimonials: next });
                }}
                onBlur={() => onBlurSave(local)}
              />
              <Input
                placeholder="Rôle"
                defaultValue={testimonial.role}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[index] = { ...next[index], role: e.target.value };
                  update({ ...local, testimonials: next });
                }}
                onBlur={() => onBlurSave(local)}
              />
              <Input
                placeholder="Témoignage"
                defaultValue={testimonial.quote}
                onChange={(e) => {
                  const next = [...testimonials];
                  next[index] = { ...next[index], quote: e.target.value };
                  update({ ...local, testimonials: next });
                }}
                onBlur={() => onBlurSave(local)}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = { ...local, testimonials: [...testimonials, { author: "", role: "", quote: "" }] };
              update(next);
              onBlurSave(next);
            }}
          >
            + Ajouter un témoignage
          </Button>
        </div>
      );
    }

    case "OBJECTIONS": {
      const items = (local.items as { question: string; answer: string }[]) ?? [];
      return (
        <div className="space-y-3">
          <div>
            <Label>Titre</Label>
            <Input
              defaultValue={local.title as string}
              onChange={(e) => update({ ...local, title: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
          {items.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-gray-100 p-3">
              <Input
                placeholder="Objection"
                defaultValue={item.question}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...next[index], question: e.target.value };
                  update({ ...local, items: next });
                }}
                onBlur={() => onBlurSave(local)}
              />
              <Textarea
                placeholder="Réponse"
                defaultValue={item.answer}
                onChange={(e) => {
                  const next = [...items];
                  next[index] = { ...next[index], answer: e.target.value };
                  update({ ...local, items: next });
                }}
                onBlur={() => onBlurSave(local)}
              />
            </div>
          ))}
        </div>
      );
    }

    case "CTA":
      return (
        <div className="space-y-3">
          <div>
            <Label>Texte du bouton</Label>
            <Input
              defaultValue={local.text as string}
              onChange={(e) => update({ ...local, text: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
          <div>
            <Label>Sous-texte (optionnel)</Label>
            <Input
              defaultValue={local.subtext as string}
              onChange={(e) => update({ ...local, subtext: e.target.value })}
              onBlur={() => onBlurSave(local)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
