import localforage from 'localforage';
import { Transaction } from '../types/Transaction';
import { CategoryRule } from '../types/Category';

export class Database {
  private static transactionsStore = localforage.createInstance({
    name: 'c6bank-categorizer',
    storeName: 'transactions'
  });

  private static rulesStore = localforage.createInstance({
    name: 'c6bank-categorizer',
    storeName: 'rules'
  });

  static async saveTransactions(transactions: Transaction[]): Promise<void> {
    await this.transactionsStore.setItem('transactions', transactions);
  }

  static async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.transactionsStore.getItem<Transaction[]>('transactions');
    return transactions || [];
  }

  static async saveCategoryRules(rules: CategoryRule[]): Promise<void> {
    await this.rulesStore.setItem('rules', rules);
  }

  static async getCategoryRules(): Promise<CategoryRule[]> {
    const rules = await this.rulesStore.getItem<CategoryRule[]>('rules');
    return rules || [];
  }

  static async exportData(): Promise<string> {
    const transactions = await this.getTransactions();
    const rules = await this.getCategoryRules();
    
    const exportData = {
      transactions,
      rules,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.transactions) {
        await this.saveTransactions(data.transactions);
      }
      
      if (data.rules) {
        await this.saveCategoryRules(data.rules);
      }
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }

  static async exportCategoryRules(): Promise<string> {
    const rules = await this.getCategoryRules();
    
    const exportData = {
      rules,
      exportDate: new Date().toISOString(),
      version: '1.0',
      type: 'categories'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  static async importCategoryRules(jsonData: string): Promise<CategoryRule[]> {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.rules || !Array.isArray(data.rules)) {
        throw new Error('Invalid category file format: missing rules array');
      }
      
      for (const rule of data.rules) {
        if (!rule.id || !rule.name || !rule.regex || typeof rule.enabled !== 'boolean') {
          throw new Error('Invalid category rule format: missing required fields');
        }
      }
      
      await this.saveCategoryRules(data.rules);
      return data.rules;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    await this.transactionsStore.clear();
    await this.rulesStore.clear();
  }
}
