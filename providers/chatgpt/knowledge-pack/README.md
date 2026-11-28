# DUMRAUF Intelligence — пользовательский комплект знаний

**Версия:** 0.5.1  
**Назначение:** подключение DUMRAUF Intelligence к ChatGPT Project.

## Состав
- Девять Markdown-файлов знаний в этой папке.
- Отдельные инструкции проекта: `providers/chatgpt/project-instructions-ru.md`.
- Алгоритм подключения: `docs/CONNECTION_ALGORITHM_RU.md`.
- Руководство пользователя: `docs/USER_GUIDE_RU.md`.

## Подключение
1. Создайте ChatGPT Project.
2. Вставьте содержимое project-instructions-ru.md в поле Project instructions.
3. Загрузите все девять Markdown-файлов из этой папки в Sources.
4. Проверьте, что все девять файлов доступны, а инструкция сохранена отдельно.
5. Начните чат внутри Project и задайте текущую управленческую задачу.

## Девять файлов
1. 01-core-rules-and-evidence.md — роль DUMRAUF, доказательность и границы выводов.
2. 02-restaurant-management-and-shift.md — управленческий цикл и работа смены.
3. 03-guest-service-and-recovery.md — гостевой путь, сервис и восстановление.
4. 04-food-safety-haccp-marking.md — операционная модель пищевой безопасности.
5. 05-iiko-stock-and-calculator-audit.md — товарный учёт и калькуляционный контур.
6. 06-menu-engineering-and-kitchen-workforce.md — экономика меню и нагрузка кухни.
7. 07-finance-payroll-and-labor.md — P&L, ФОТ и производительность.
8. 08-operational-audit-and-checklists.md — аудит и корректирующие действия.
9. 09-stage-11-scope-and-validation.md — зрелость методик и критерии проверки.

## Ограничения
Project использует инструкции и документы как контекст модели. Само подключение не запускает программное ядро и не создаёт интеграции с POS/iiko, банком, API или серверной памятью. Не смешивайте файлы разных выпусков. При обновлении заменяйте весь комплект целиком.

**Нет источника — нет факта. Отсутствует — не значит ноль.**
