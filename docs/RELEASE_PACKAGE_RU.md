# DUMRAUF Intelligence 0.5.1 — пакет поставки

## Назначение

Этот документ описывает три разных артефакта DUMRAUF Intelligence. Их нельзя смешивать: каждый предназначен для своего сценария.

## Состав поставки

### 1. ChatGPT Project knowledge pack

Источник: providers/chatgpt/knowledge-pack/ и providers/chatgpt/project-instructions-ru.md.

- Девять Markdown-файлов знаний — загружаются в Sources проекта.
- Отдельный текст инструкций — вставляется в поле Project instructions.
- Это контекст для модели, а не исполняемый сервер, plugin runtime или интеграция с iiko/POS.

Сборка tenant/source ZIP выполняется командой npm run package:source. Она использует явный allowlist tenant_distribution.files в package-manifest.json, сверяет состав архива и создаёт SHA256SUMS.txt и CONTENTS.txt.

### 2. ChatGPT plugin package

Канонический исходник: providers/chatgpt/plugin-source/.

Сборка: npm run build:chatgpt-plugin.

Ожидаемый файл: dist/dumrauf-intelligence-chatgpt-plugin.tar.gz. Внутри пакета создаётся SOURCE_REVISION.txt, указывающий исходную ревизию Git. Сборка проверяет обязательные файлы и 27 файлов SKILL.md, а также включает канонические reference-файлы из knowledge pack.

Этот архив предназначен для поддерживаемого процесса установки/обновления ChatGPT plugin. Не загружайте его вместо девяти файлов знаний в ChatGPT Project.

### 3. Source package

Полный исходный репозиторий содержит код, тесты, навыки, методики, схемы и документацию. Он предназначен для разработчиков и технической проверки, а не для обычной загрузки в Project.

## Проверки перед распространением

1. npm install --no-audit --no-fund
2. npm run validate:evidence
3. npm run validate:package
4. npm run scan:secrets
5. npm test
6. npm run package:source
7. npm run build:chatgpt-plugin
8. Проверить SOURCE_REVISION.txt, SHA256SUMS.txt, CONTENTS.txt и состав обоих архивов.
9. Убедиться, что GitHub Actions завершился успешно для точного тега/коммита выпуска.

CI подтверждает только те проверки, которые реально запускаются. Он не подтверждает экспертную корректность всех методик, правовую комплаентность или успешную работу на конкретном объекте.

## Публикация артефактов в GitHub Release

Workflow .github/workflows/publish-release-assets.yml можно запустить вручную через GitHub Actions. Укажите тег выпуска (для текущего выпуска — v0.5.1). Workflow проверяет существование опубликованного релиза, устанавливает зависимости, выполняет тесты и проверки, собирает оба архива и прикрепляет к релизу:

- dumrauf-knowledge-pack-0.5.1.zip;
- dumrauf-intelligence-chatgpt-plugin.tar.gz;
- SHA256SUMS.txt;
- CONTENTS.txt.

Не объявляйте файлы опубликованными, пока workflow не завершился успешно и все четыре Assets не видны на странице релиза.

## Безопасность и зрелость

- Не включать клиентские документы, банковские выписки, персональные данные, токены и секреты в поставку.
- Файл, исключённый из ZIP, всё ещё может оставаться доступным в публичном GitHub-репозитории или его истории.
- 77 process inventory topics не являются 77 утверждёнными SOPs.
- 19 source-grounded draft procedure cards не являются утверждёнными SOPs.
- Stage 11 содержательная валидация остаётся открытой до экспертной проверки и контролируемых пилотов.
- Юридические и санитарные выводы требуют актуальных официальных источников и проверки специалистом.

## Выпуск 0.5.1

- Tag: v0.5.1.
- Product: DUMRAUF Intelligence.
- Main merge commit: 7757000df45212158e334b8ec4d9e32721f1b7cd.
- GitHub Actions CI #648 прошёл на PR head commit cff3f93beb569be819b65659debabea4acdc8cd6.
- Официальная страница: https://github.com/paradox0550-byte/sten-restaurant-agent/releases/tag/v0.5.1
- На момент подготовки этого документа Release опубликован, но Assets ещё не прикреплены.