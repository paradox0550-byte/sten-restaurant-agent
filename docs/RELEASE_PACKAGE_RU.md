# STEN 0.5.0 — пакет знаний для ChatGPT Project

## Distribution contract

Пользовательский архив — это curated knowledge pack для ChatGPT Project, а не исходный код и не развёртываемый сервер. Инструкция для пилотной группы: [PILOT_FRIENDS_GUIDE_RU.md](PILOT_FRIENDS_GUIDE_RU.md). It contains:
- nine STEN knowledge Markdown files;
- a separate Project instruction file.

The installation guide and user guide are maintained separately in the documentation set and Dropbox Paper. Internal evidence registries, source crosswalks, graph provenance catalogs, research registers, source files, tests and runtime code are not part of the tenant archive.

## Build and verification

The release archive is produced by `npm run package:source` from the explicit `tenant_distribution.files` allowlist in `package-manifest.json`.

The CI release gate must pass:
1. evidence registry validation;
2. source/package manifest validation;
3. high-confidence secret scan;
4. complete automated test suite;
5. tenant archive build and allowlist comparison;
6. artifact upload.

Архив создаётся скриптом `scripts/create-source-archive.js` из `tenant_distribution.files`; фактическое имя — `sten-knowledge-pack-0.5.0.zip`. `SHA256SUMS.txt` — контрольная сумма, `CONTENTS.txt` — перечень содержимого. `CONTENTS.txt` is the file inventory.

## Current Dropbox publication record

- Uploaded file: `STEN-Project-Knowledge-Pack-0.5.0.zip`.
- Dropbox path: `/STEN Restaurant Agent/05. Обновления и версии/STEN-Project-Knowledge-Pack-0.5.0.zip`.
- Archive SHA-256: `0a7f19e3a0939eef3b9eb956d6ee172e811d2734849ebe1afbbcb0ea33cb9fdb`.
- The file exists in Dropbox. A public anyone-with-the-link URL has not yet been enabled; this must be done in Dropbox web UI and then tested in a private browser session.

## User release procedure

1. Download the archive artifact from a successful main-branch CI run.
2. Inspect the nested tenant ZIP and confirm it contains the nine knowledge files, README and Project instructions only.
3. Scan the extracted tenant files for configured private source identities and locators.
4. Upload the ZIP and its checksum/inventory to the Dropbox release folder.
5. Update the Dropbox Paper release log with the actual commit, CI run, checksum and final Dropbox paths.
6. Verify the user-facing Dropbox link with a separate browser/account if public access is intended.

## Important boundaries

- A file excluded from the tenant ZIP is not private if it remains in a public GitHub repository or its history.
- Do not put confidential source materials into a public repository.
- A green CI run proves only the automated checks it executes. It does not certify expert correctness, legal compliance, or successful operation at a restaurant.
- Stage 11 substantive validation remains open until specialist review and controlled pilots are completed.
- No release is published until the owner approves the final contents and distribution link.


## Closed pilot candidate — 20 November 2026

- Main commit: `8bcff642340c6a4d1a524769560bda002629ac1f`.
- Successful CI: [run 44680980200](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/44680980200).
- Automated tests: 139 passed, 0 failed.
- Tenant archive: `sten-knowledge-pack-0.5.0.zip`, 11/11 allowlisted files verified.
- SHA-256: `b57c02814cb9737ac4fcc1a277f023a8b039789adc55c10acf60f4fc23ed1287`.
- GitHub Actions artifact: `sten-knowledge-pack-8bcff642340c6a4d1a524769560bda002629ac1f` (available until 20 December 2026).

This candidate is intended for a closed friends pilot in separate ChatGPT Projects using synthetic or anonymized data. It is not a deployed STEN server/API or a general production SaaS release. The public GitHub Release and Dropbox publication remain owner-controlled and have not been performed.
