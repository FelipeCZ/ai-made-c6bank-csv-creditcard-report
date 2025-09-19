import React, { useRef } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';

interface DataManagerProps {
  onExport: () => Promise<string>;
  onImport: (data: string) => Promise<void>;
  onClear: () => Promise<void>;
}

export const DataManager: React.FC<DataManagerProps> = ({ onExport, onImport, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const data = await onExport();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `c6bank-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Erro ao exportar dados: ' + (error as Error).message);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        await onImport(data);
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar dados: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      try {
        await onClear();
        alert('Dados limpos com sucesso!');
      } catch (error) {
        alert('Erro ao limpar dados: ' + (error as Error).message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Dados</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar Dados
          </button>
        </div>
        
        <button
          onClick={handleClear}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Todos os Dados
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportFile}
        className="hidden"
      />
      
      <div className="mt-4 text-sm text-gray-500">
        <p><strong>Exportar:</strong> Baixa um arquivo JSON com todas as transações e regras de categorização.</p>
        <p><strong>Importar:</strong> Carrega dados de um arquivo JSON exportado anteriormente.</p>
        <p><strong>Limpar:</strong> Remove todos os dados armazenados localmente.</p>
      </div>
    </div>
  );
};
