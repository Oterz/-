const API_URL = 'http://185.244.172.108:8081';
const ENTITY_ID = 3012;

export const createRowAPI = async (parentId: number | null, data: any) => {
  const response = await fetch(`${API_URL}/v1/outlay-rows/entity/${ENTITY_ID}/row/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      parentId: parentId === null ? null : parentId,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      supportCosts: 0,
    }),
  });

  return response.json();
};

export const updateRowAPI = async (rowId: number, data: any) => {
  const response = await fetch(`${API_URL}/v1/outlay-rows/entity/${ENTITY_ID}/row/${rowId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      supportCosts: 0,
    }),
  });

  return response.json();
};

export const deleteRowAPI = async (rowId: number) => {
  const response = await fetch(`${API_URL}/v1/outlay-rows/entity/${ENTITY_ID}/row/${rowId}/delete`, {
    method: 'DELETE',
  });

  return response.json();
};

export const fetchRowsAPI = async () => {
  const response = await fetch(`${API_URL}/v1/outlay-rows/entity/${ENTITY_ID}/row/list`);
  return response.json();
};
