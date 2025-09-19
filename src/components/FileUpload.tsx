import React, { useCallback } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const xlsxFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (xlsxFile) {
      onFileSelect(xlsxFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !isLoading && document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : (
            <FileSpreadsheet className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isLoading ? 'Processando arquivo...' : 'Selecione um arquivo XLSX'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Arraste e solte ou clique para selecionar
            </p>
          </div>
          
          {!isLoading && (
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Upload className="h-4 w-4" />
              <span>Arquivos .xlsx ou .xls</span>
            </div>
          )}
        </div>
      </div>
      
      <input
        id="file-input"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  );
};
