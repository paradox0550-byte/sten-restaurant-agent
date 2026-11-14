# Claude Project adapter

Use `assistant/system-instructions.md` as canonical project instructions. Add the knowledge directory files and Evidence Registry as Project Knowledge. Keep establishment-specific configuration and manager memory in a separate project/workspace or authenticated tenant store; never mix establishments.

The included `skills/` workflows are provider-neutral reference skills. Adapt their metadata and packaging to the current Claude Skills format before installation; do not assume this Markdown directory is already an installable skill bundle.

MCP configuration is intentionally empty until a real, secured MCP server exists.
