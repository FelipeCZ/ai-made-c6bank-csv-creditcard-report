import React, { useMemo } from 'react';
import { Transaction } from '../types/Transaction';
import { CategoryStats } from '../types/Category';
import { TrendingUp, CreditCard, Calendar, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      'Restaurantes': '#ef4444',
      'Supermercados': '#22c55e',
      'Postos de Combustível': '#f59e0b',
      'Farmácias': '#06b6d4',
      'Transporte': '#8b5cf6',
      'Shopping': '#ec4899',
      'Streaming/Assinaturas': '#64748b',
      'Bancos/Financeiro': '#dc2626',
      'Outros': '#6b7280'
    };
    return colors[category as keyof typeof colors] || '#6b7280';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.valorBRL, 0);
    const avgAmount = totalAmount / totalTransactions || 0;
    
    const categoryStats: CategoryStats[] = [];
    const categoryMap = new Map<string, { count: number; total: number }>();
    
    transactions.forEach(transaction => {
      const category = transaction.categoriaCustom || 'Outros';
      const current = categoryMap.get(category) || { count: 0, total: 0 };
      categoryMap.set(category, {
        count: current.count + 1,
        total: current.total + transaction.valorBRL
      });
    });
    
    categoryMap.forEach((value, key) => {
      categoryStats.push({
        name: key,
        count: value.count,
        totalBRL: value.total,
        color: getCategoryColor(key)
      });
    });
    
    categoryStats.sort((a, b) => b.totalBRL - a.totalBRL);
    
    const monthlyData = new Map<string, number>();
    transactions.forEach(transaction => {
      const date = transaction.dataCompra;
      const month = date.substring(3); // MM/YYYY
      const current = monthlyData.get(month) || 0;
      monthlyData.set(month, current + transaction.valorBRL);
    });
    
    return {
      totalTransactions,
      totalAmount,
      avgAmount,
      categoryStats,
      monthlyData: Array.from(monthlyData.entries()).map(([month, amount]) => ({
        month,
        amount
      })).sort((a, b) => a.month.localeCompare(b.month))
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Carregue um arquivo XLSX para ver as estatísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Transações</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Valor Médio</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.avgAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categorias</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.categoryStats.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {stats.categoryStats.map((category, index) => {
              const percentage = (category.totalBRL / stats.totalAmount) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.totalBRL)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% ({category.count} transações)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gastos por Mês</h3>
          <div className="space-y-3">
            {stats.monthlyData.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{month.month}</span>
                <span className="text-sm text-gray-600">{formatCurrency(month.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
