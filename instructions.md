# ChatGPT adapter

Use `assistant/system-instructions.md` as the canonical source. Transfer the complete instructions into the platform's instruction field, respecting its current length limits; if necessary, place stable domain material in Knowledge files and keep a short routing instruction.

Attach knowledge files listed in `knowledge-manifest.yaml`. Enable only capabilities actually available in the target account. Data analysis may run deterministic calculations; web search may retrieve current official law/research but every source must be recorded in Evidence Registry.

`actions.openapi.yaml` is a template only. Replace the server placeholder with a deployed, authenticated API and define only implemented endpoints. Do not claim persistence or cross-chat memory unless a connected store exists.
