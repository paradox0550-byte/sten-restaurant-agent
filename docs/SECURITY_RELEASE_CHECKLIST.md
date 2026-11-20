# STEN 0.5.0 — проверка безопасности релизного пакета

Дата подготовки: 16 ноября 2026 года.

## Цель и границы

Документ фиксирует проверки, которые можно выполнить над исходным пакетом STEN. Это не аудит инфраструктуры, не тест на проникновение, не DLP-проверка и не сертификат соответствия.

## Проверки исходного пакета

- [x] Secret scan выполнен в CI run [43695928368](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43695928368): 143 tracked text files и 18 088 добавленных строк достижимой истории Git; совпадений высокоуверенных credential-паттернов нет.
- [x] CI использовал полный Git history checkout (`fetch-depth: 0`); проверены refs, доступные этому checkout.
- [x] Выполнен контент-аудит source catalog, evidence registry и процедур: оригинальные внутренние документы не включены; источники обобщены, а прямые идентификаторы заявлены как исключённые. Дополнительная проверка текущего архива не выявила email-, IBAN- или паспортоподобных идентификаторов.
- [ ] Владелец подтверждает право публично распространять обобщённые методики, основанные на предоставленных корпоративных материалах.
- [x] Высокоуверенные credential-паттерны в текущем снимке и доступной истории не обнаружены. Это не доказывает отсутствие всех типов секретов и персональных данных.
- [x] Архив сверён с `package-manifest.json`: 147/147 файлов, без пропусков и лишних файлов.
- [x] SHA-256 проверен локально и совпадает с файлом контрольной суммы в скачанном CI-артефакте.

## Результаты содержательной проверки состава

- В `knowledge/graph/sources.json` описаны шесть источников класса PRACTICE. Для исходных корпоративных материалов прямо отмечено, что персональные имена, адреса, поставщики, внутренние контакты и программные процедуры исключены из обобщённого графа.
- В `knowledge/procedures/operational-procedures.json` правила пакета запрещают воспроизводить идентификаторы сотрудников, гостей, поставщиков, компаний и систем.
- В пакете присутствуют обобщённые методики и записи происхождения, а не оригинальные внутренние регламенты/выгрузки, перечисленные в описаниях источников.
- Это проверка видимого содержимого текущих файлов, а не юридическое заключение о конфиденциальности. Владелец данных должен подтвердить право распространения методик и отсутствие неочевидной коммерческой тайны.

## Результаты, подтверждаемые кодом и тестами

В runtime предусмотрены обязательный tenantId на границах, запрет выполнения инструмента по умолчанию, проверка разрешения на каждый вызов, валидация аргументов и изоляция in-memory memory/audit адаптеров по tenant. Это проверяется автоматическими тестами.

Эти меры являются инженерными защитами библиотеки. Они не создают полноценную производственную систему идентификации пользователей и не заменяют серверную авторизацию.

## Обязательные меры интегратора перед производственной эксплуатацией

- Аутентифицировать пользователя на доверенной стороне сервера.
- Получать tenantId и разрешения из доверенной сессии/политики, а не из текста, сгенерированного моделью.
- Использовать постоянное хранилище с разграничением доступа между организациями и ресторанами.
- Настроить шифрование при передаче и хранении, секрет-хранилище, ротацию ключей, резервное копирование и журнал доступа.
- Определить сроки хранения, удаление, экспорт и обработку персональных данных.
- Ограничить rate limits, размер файлов, типы файлов и доступные инструменты.
- Не предоставлять модели произвольный shell, файловую систему, SQL, сетевой доступ или выполнение кода.
- Проводить независимое тестирование безопасности до подключения реальных коммерческих и кадровых данных.

## Открытые риски версии 0.5.0

1. В комплекте нет production API и сервера MCP.
2. Нет производственной аутентификации и авторизации.
3. Memory и audit adapters в пакете — временные in-memory реализации для разработки/тестов.
4. Нет постоянного векторного хранилища.
5. Нет XLSX-парсера.
6. ChatGPT OpenAPI и Claude MCP конфигурации являются незаполненными шаблонами.
7. Secret scan покрывает выбранные credential-паттерны в текущем снимке и доступной истории Git, но не является полной DLP-проверкой и не доказывает отсутствие всех видов персональных или коммерческих данных.
8. Stage 11 требует содержательной проверки знаний экспертами.

## Критерии допуска к выпуску

Релиз исходного кода 0.5.0 можно считать подготовленным только после:
- успешных тестов;
- успешной проверки Evidence Registry;
- успешной проверки package manifest;
- успешного secret scan без неразобранных находок;
- ручного просмотра состава файлов и отсутствия приватных операционных данных;
- подтверждения владельцем прав на публичное распространение обобщённых методик, основанных на внутренних материалах;
- создания архива из проверенного commit;
- проверки состава архива и SHA-256;
- подтверждения владельца перед публикацией GitHub Release.

Даже после этого пакет остаётся working core и не является production SaaS или сертифицированным средством соответствия.


## Актуальный тестовый кандидат — 16 ноября 2026

Последний подтверждённый CI для предыдущего кандидата: run [43719986139](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43719986139), commit `c2e296767aa06a5ff9dd677ee9b030f161b08b4e`: 99/99 tests passed, Evidence Registry, package validation, secret scan and source archive succeeded. После него добавлен пользовательский план тестирования и обновлён manifest; финальная проверка нового HEAD выполняется отдельным CI run.

Тестовый пакет предназначен для закрытого пользовательского пилота в ChatGPT Project. Публичный GitHub Release не опубликован. Проверка исходного кода не является аудитом защищённого production-host, DLP, penetration test или юридическим подтверждением прав на распространение.


## Final private pilot candidate verification — 16 November 2026

- [x] Latest branch-head CI run [43765995720](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/43765995720), commit `f13535c528b3d17b5ae4bd687a875d84b6d9a80e`: 99/99 tests, Evidence Registry, package integrity, secret scan and source archive passed.
- [x] Package manifest: 147/147 tracked paths.
- [x] Candidate artifact: `sten-source-7d09d2ecd867112bdb5a0261b2d5aa0052bdb1a9`, SHA-256 `91aa5f65deee52b1a3629f778d6629f12e1644a57cfb5657c9c6b00a90b3e11d`, expires 15 December 2026.
- [ ] Public redistribution rights and public release approval remain owner decisions. Private Project-based user testing can begin without publishing a GitHub Release.


## Closed friends-pilot candidate — 20 November 2026

- [x] Main commit: `8bcff642340c6a4d1a524769560bda002629ac1f`.
- [x] CI run [44680980200](https://github.com/paradox0550-byte/sten-restaurant-agent/actions/runs/44680980200) completed successfully.
- [x] 139/139 automated tests passed.
- [x] Evidence Registry validation passed.
- [x] Source manifest validation passed: 293 tracked files, 293 declared source-manifest paths.
- [x] High-confidence secret-pattern scan passed: 292 tracked text files and 42,959 added history lines scanned; no high-confidence credential patterns found. This is not a full DLP or privacy audit.
- [x] Tenant knowledge pack built and allowlist-verified: 11/11 files.
- [x] Archive SHA-256: `b57c02814cb9737ac4fcc1a277f023a8b039789adc55c10acf60f4fc23ed1287`.
- [x] GitHub Actions artifact: `sten-knowledge-pack-8bcff642340c6a4d1a524769560bda002629ac1f`; artifact expires 20 December 2026.
- [ ] Owner has not yet approved a public GitHub Release or public Dropbox distribution link.
- [ ] Rights to publicly redistribute all generalized methodologies and materials remain subject to owner confirmation.
- [ ] This candidate is for a closed ChatGPT Project pilot using synthetic/anonymized data, not a production SaaS deployment.

The green run confirms the checks listed above only. It does not validate answer quality across all 77 processes, legal compliance at a restaurant, infrastructure security, or professional outcomes.
