const localPath =
  /(^|\/)(\.(?:claude|codex|agents|local)(\/|$)|(?:CLAUDE|CODEX|AGENTS)(?:\.local)?\.md$)/i;
const attribution =
  /^(?:co-authored-by|signed-off-by|author|generated(?:\s+with|\s+by)?|written\s+by|created\s+by)\s*:?[^\r\n]*(?:claude|codex|anthropic|openai)/im;
const assistantIdentity = /\b(?:claude|codex|anthropic|openai)\b/i;

export function checkPath(path) {
  if (localPath.test(path))
    throw new Error(`Local assistant/runtime file must not be tracked: ${path}`);
  if (/(^|\/)\.env(?:\..+)?$/.test(path) && !path.endsWith('.env.example'))
    throw new Error(`Environment file must not be tracked: ${path}`);
}

export function checkText(text, label) {
  if (attribution.test(text)) throw new Error(`Assistant attribution is not permitted: ${label}`);
}

export function checkIdentity(identity) {
  if (assistantIdentity.test(identity))
    throw new Error('Assistant commit identity is not permitted.');
}
