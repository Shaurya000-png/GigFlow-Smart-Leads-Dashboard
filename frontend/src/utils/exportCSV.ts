import axiosInstance from '../api/axiosInstance';

export const exportCSV = async (filters: any) => {
  try {
    const response = await axiosInstance.get('/leads/export/csv', {
      params: filters,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed', error);
    throw error;
  }
};
