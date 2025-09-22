import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { TransactionList } from './components/TransactionList';
import { CategoryManager } from './components/CategoryManager';
import { DataManager } from './components/DataManager';
import { Dashboard } from './components/Dashboard';
import { XLSXParser } from './services/xlsxParser';
import { Categorizer } from './services/categorizer';
import { Database } from './services/database';
import { Transaction } from './types/Transaction';
import { CategoryRule } from './types/Category';
import { BarChart3, FileText, Settings, Database as DatabaseIcon, CreditCard } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categoryRules, setCategoryRules] = useState<CategoryRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'categories' | 'data'>('dashboard');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedTransactions, savedRules] = await Promise.all([
        Database.getTransactions(),
        Database.getCategoryRules()
      ]);

      setTransactions(savedTransactions);
      
      if (savedRules.length === 0) {
        const defaultRules = Categorizer.getDefaultRules();
        setCategoryRules(defaultRules);
        await Database.saveCategoryRules(defaultRules);
      } else {
        setCategoryRules(savedRules);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const parsedTransactions = await XLSXParser.parseFile(file);
      const categorizedTransactions = Categorizer.categorizeTransactions(parsedTransactions, categoryRules);
      
      setTransactions(categorizedTransactions);
      await Database.saveTransactions(categorizedTransactions);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Erro ao processar arquivo: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRules = async (rules: CategoryRule[]) => {
    setCategoryRules(rules);
    await Database.saveCategoryRules(rules);
    
    if (transactions.length > 0) {
      const recategorizedTransactions = Categorizer.categorizeTransactions(transactions, rules);
      setTransactions(recategorizedTransactions);
      await Database.saveTransactions(recategorizedTransactions);
    }
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    await Database.saveTransactions(updatedTransactions);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    setTransactions(updatedTransactions);
    await Database.saveTransactions(updatedTransactions);
  };

  const handleExportData = async (): Promise<string> => {
    return await Database.exportData();
  };

  const handleImportData = async (data: string) => {
    await Database.importData(data);
    await loadData();
  };

  const handleClearData = async () => {
    await Database.clearAllData();
    setTransactions([]);
    const defaultRules = Categorizer.getDefaultRules();
    setCategoryRules(defaultRules);
    await Database.saveCategoryRules(defaultRules);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', name: 'Transações', icon: FileText },
    { id: 'categories', name: 'Categorias', icon: Settings },
    { id: 'data', name: 'Dados', icon: DatabaseIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                C6 Bank XLSX Categorizer
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactions.length === 0 && activeTab === 'dashboard' ? (
          <div className="text-center py-12">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            <div className="mt-8 text-sm text-gray-500">
              <p>Carregue um arquivo XLSX do C6 Bank para começar a categorizar suas transações.</p>
              <p className="mt-2">O arquivo deve conter as colunas: Data de compra, Nome no cartão, Final do Cartão, Categoria, Descrição, Parcela, Valor em US$, Cotação, Valor em R$</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-6">
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                  </div>
                  <Dashboard transactions={transactions} />
                </>
              )}

              {activeTab === 'transactions' && (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
                    <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                  </div>
                  <TransactionList 
                    transactions={transactions} 
                    onUpdateTransaction={handleUpdateTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </>
              )}

              {activeTab === 'categories' && (
                <CategoryManager 
                  rules={categoryRules} 
                  onUpdateRules={handleUpdateRules}
                />
              )}

              {activeTab === 'data' && (
                <DataManager 
                  onExport={handleExportData}
                  onImport={handleImportData}
                  onClear={handleClearData}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
