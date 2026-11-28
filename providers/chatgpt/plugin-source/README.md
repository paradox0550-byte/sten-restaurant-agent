# DUMRAUF Intelligence — ChatGPT plugin source

This directory is the repository-controlled source package for the DUMRAUF Intelligence ChatGPT plugin. The installed plugin is a deployment artifact; edit these files in GitHub and rebuild rather than editing Plugin Creator directly.

## 27 skill files

- general — Общие запросы и безопасный выбор режима
- finance — Финансы ресторана
- excel — Excel и табличные данные
- operations — Операционное управление
- people — HR и персональные данные
- marketing — Маркетинг ресторана
- procurement — Закупки и поставщики
- fire_safety — Пожарная безопасность
- bar_wine — Бар и алкоголь
- labor_law — Трудовое право
- occupational_safety — Охрана труда
- compliance — Санитария и комплаенс
- staff_management — Управление персоналом
- franchise — Франчайзинг
- iiko_inventory — iiko и складской учет
- brand_strength — Сила бренда
- process_architecture — Архитектура процессов
- opening_and_governance — Открытие и управление объектом
- accountability — Ответственность и исполнение
- secretary — Секретарь руководителя
- management — Ситуационное управление
- document-analysis — Анализ документов
- financial-reconciliation — Сверка банка, POS и ОФД
- management-decisions — Управленческие решения
- restaurant-finance — Финансовый анализ ресторана
- dumrauf-core-knowledge — Базовая база знаний DUMRAUF
- dumrauf-director — Основной управляющий агент

## Non-negotiable principles
- No source = No fact
- Calculation before interpretation
- Missing is not zero
- Evidence over confidence
- Источники, формулы, ограничения и неизвестные данные должны быть видимы
- Не заявлять о подключении к iiko, банку, ОФД или другим системам без действующего инструмента

## Verification
The package contains 27 individual SKILL.md files. A skill file is not proof of successful end-to-end testing. Test coverage and maturity must be reported only from reproducible checks.

## Privacy
Do not include client documents, bank statements, payroll, personal data, secrets, tokens or infrastructure configuration in the package.

## Compatibility note
The internal plugin identifier in plugin.json is retained for compatibility with the existing installed integration. The public product identity and display name are DUMRAUF Intelligence.
