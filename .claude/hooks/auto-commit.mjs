#!/usr/bin/env node
/**
 * Hook `Stop`: copia de seguridad automática.
 *
 * Tras cada turno de Claude, confirma todo el árbol de trabajo y, si hay un
 * upstream configurado, hace push. Nunca bloquea a Claude ni falla de forma
 * ruidosa: cualquier error se reporta por `systemMessage` (no consume tokens)
 * y el proceso siempre termina con código 0.
 *
 * Configurado en `.claude/settings.json` (evento `Stop`).
 */
import { execFileSync } from "node:child_process";

function tryGit(args) {
  try {
    const out = execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { ok: true, out: out.trim() };
  } catch (err) {
    return { ok: false, out: `${err.stdout ?? ""}${err.stderr ?? ""}`.trim() };
  }
}

function emit(systemMessage) {
  if (systemMessage) process.stdout.write(JSON.stringify({ systemMessage }));
}

const firstLine = (s) => s.split("\n")[0]?.trim() ?? "";

// 1. Estar dentro de un repositorio git.
if (!tryGit(["rev-parse", "--is-inside-work-tree"]).ok) process.exit(0);

// 2. Preparar todo el árbol.
tryGit(["add", "-A"]);

// 3. `git diff --cached --quiet` termina con 0 si NO hay nada preparado.
if (tryGit(["diff", "--cached", "--quiet"]).ok) process.exit(0);

// 4. Confirmar.
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
const commit = tryGit(["commit", "--quiet", "-m", `chore: guardado automático (${stamp})`]);
if (!commit.ok) {
  emit(`Auto-commit falló: ${firstLine(commit.out)}`);
  process.exit(0);
}

// 5. Push sólo si la rama tiene upstream.
if (tryGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]).ok) {
  const push = tryGit(["push", "--quiet"]);
  emit(push.ok ? `Guardado y subido (${stamp}).` : `Commit hecho; el push falló: ${firstLine(push.out)}`);
} else {
  emit(`Guardado en local (${stamp}). Aún sin remoto configurado.`);
}

process.exit(0);
