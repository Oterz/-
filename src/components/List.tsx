import React, { useState, useEffect, useRef } from 'react';
import DocumentIcon from '../components/icons/DocumentIcon';
import DeleteDocumentIcon from './icons/DeleteDocumentIcon';
import { createRowAPI, fetchRowsAPI, updateRowAPI, deleteRowAPI } from '../api/api';

const columns = [
  'Уровень',
  'Наименование работ',
  'Основная з/п',
  'Оборудование',
  'Накладные расходы',
  'Сметная прибыль',
];

interface Task {
  id: number;
  parentId: number | null;
  values: Record<string, string>;
  level: number;
  isNew?: boolean;
  
}

const List: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const editingRowRef = useRef<HTMLDivElement | null>(null);

  // Рекурсивная распаковка данных с backend
  const flattenRows = (data: any[], parentId: number | null = null, level: number = 0): Task[] => {
    return data.flatMap((item) => [
      {
        id: item.id,
        parentId: parentId,
        level: level,
        values: {
          'Уровень': '',
          'Наименование работ': item.rowName,
          'Основная з/п': item.salary.toString(),
          'Оборудование': item.equipmentCosts.toString(),
          'Накладные расходы': item.overheads.toString(),
          'Сметная прибыль': item.estimatedProfit.toString(),
        },
      },
      ...flattenRows(item.child || [], item.id, level + 1),
    ]);
  };

  // Получаем строки с backend
  const loadRows = async () => {
    const data = await fetchRowsAPI();
    const formatted = flattenRows(data);
    setTasks(formatted);

    // ✅ Если нет данных — создать рутовую строку
    if (formatted.length === 0) {
      handleAddRow(null, 0);
    }
  };

  // Инициализация
  useEffect(() => {
    loadRows();
  }, []);

  // Добавить строку
  const handleAddRow = (parentId: number | null, level: number) => {
    const tempId = Date.now();
    const newRow: Task = {
      id: tempId,
      parentId,
      level,
      isNew: true,
      values: columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {}),
    };
    setTasks((prev) => {
      const indexToInsert = prev.findIndex(row => row.id === parentId);
      const before = prev.slice(0, indexToInsert + 1); // всё до родителя включительно
      const after = prev.slice(indexToInsert + 1); // всё после родителя
    
      return [...before, newRow, ...after];
    });
    setEditingRowId(tempId);
  };

  // Удалить строку
  const handleDeleteRow = async (id: number) => {
    await deleteRowAPI(id);
    await loadRows(); // Перезагрузка данных

    // Проверка: если всё удалено — создать новую рутовую строку
    setTimeout(() => {
      setTasks((currentTasks) => {
        if (currentTasks.length === 0) {
          handleAddRow(null, 0);
        }
        return currentTasks;
      });
    }, 100); // небольшая задержка для обновления данных
  };

  // Подтвердить (создание/обновление)
  const handleConfirmRow = async (row: Task) => {
    const payload = {
      rowName: row.values['Наименование работ'],
      salary: Number(row.values['Основная з/п']),
      equipmentCosts: Number(row.values['Оборудование']),
      overheads: Number(row.values['Накладные расходы']),
      estimatedProfit: Number(row.values['Сметная прибыль']),
    };

    if (row.isNew) {
      await createRowAPI(row.parentId, payload);
    } else {
      await updateRowAPI(row.id, payload);
    }

    setEditingRowId(null);
    await loadRows();
  };

  // Изменение значения в строке
  const handleInputChange = (id: number, key: string, value: string) => {
    setTasks((prev) =>
      prev.map((row) => (row.id === id ? { ...row, values: { ...row.values, [key]: value } } : row))
    );
  };

  // Подтвердить по Enter
  const handleInputKeyDown = (e: React.KeyboardEvent, row: Task) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmRow(row);
    }
  };

  // Включить редактирование по двойному клику
  const handleDoubleClick = (id: number) => setEditingRowId(id);

  // Выключить редактирование при клике вне строки
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingRowRef.current && !editingRowRef.current.contains(event.target as Node)) {
        setEditingRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Рендер дерева
  const renderTree = (parentId: number | null = null): React.ReactNode => {
    const rows = tasks
      .filter((row) => row.parentId === parentId)
      .sort((a, b) => b.id - a.id); // Сортировка по убыванию id (новые сверху)
  
    return rows.map((row) => (
      <React.Fragment key={row.id}>
        <div
          className="todo-list__row"
          onDoubleClick={() => handleDoubleClick(row.id)}
          ref={editingRowId === row.id ? editingRowRef : null}
        >
          {columns.map((col, idx) =>
            col === 'Уровень' ? (
              <div
                key={idx}
                className="table__col table__col--level"
                style={{ paddingLeft: `${row.level * 20}px` }}
              >
                <div className={`tree-icon-wrapper ${row.level === 0 ? 'root' : ''}`}>
                  <DocumentIcon
                    onClick={() => editingRowId === null && !row.isNew && handleAddRow(row.id, row.level + 1)}
                    className="todo-input__icon-btn"
                  />
                  <DeleteDocumentIcon
                    onClick={() => handleDeleteRow(row.id)}
                    className="delete-icon"
                  />
                </div>
              </div>
            ) : editingRowId === row.id ? (
              <input
                key={idx}
                value={row.values[col]}
                onChange={(e) => handleInputChange(row.id, col, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(e, row)}
                placeholder={col}
                autoFocus={idx === 1}
                className={`todo-input__field ${
                  col === 'Наименование работ' ? 'todo-input__field--name' : 'todo-input__field--other'
                }`}
              />
            ) : (
              <div
                key={idx}
                className={`table__col ${
                  col === 'Наименование работ' ? 'table__col--name' : 'table__col--other'
                }`}
              >
                {row.values[col]}
              </div>
            )
          )}
        </div>
        {renderTree(row.id)} {/* Рекурсивный вызов */}
      </React.Fragment>
    ));
  };

  // Рендер таблицы
  return (
    <div className="todo-list">
      <div className="todo-list__row todo-list__header">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`table__col ${
              col === 'Уровень'
                ? 'table__col--level'
                : col === 'Наименование работ'
                ? 'table__col--name'
                : 'table__col--other'
            }`}
          >
            {col}
          </div>
        ))}
      </div>
      <div className="todo-list__table">{renderTree()}</div>
    </div>
  );
};

export default List;















