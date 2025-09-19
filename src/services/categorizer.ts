import { Transaction } from '../types/Transaction';
import { CategoryRule } from '../types/Category';

export class Categorizer {
  private static defaultRules: Omit<CategoryRule, 'id'>[] = [
    {
      name: 'Restaurantes',
      regex: 'restaurante|lanchonete|bar|pizzaria|hamburger|comida|food|delivery',
      color: '#ef4444',
      enabled: true
    },
    {
      name: 'Supermercados',
      regex: 'supermercado|mercado|padaria|açougue|hortifruti|extra|carrefour|pao de acucar|COMERCIALVILLA',
      color: '#22c55e',
      enabled: true
    },
    {
      name: 'Postos de Combustível',
      regex: 'posto|combustivel|gasolina|etanol|shell|petrobras|ipiranga',
      color: '#f59e0b',
      enabled: true
    },
    {
      name: 'Farmácias',
      regex: 'farmacia|drogaria|droga|medicamento|pharmacy',
      color: '#06b6d4',
      enabled: true
    },
    {
      name: 'Transporte',
      regex: 'uber|taxi|metro|onibus|transporte|99|cabify|vlt|cptm',
      color: '#8b5cf6',
      enabled: true
    },
    {
      name: 'Shopping',
      regex: 'shopping|loja|magazine|americanas|submarino|mercado livre|amazon',
      color: '#ec4899',
      enabled: true
    },
    {
      name: 'Streaming/Assinaturas',
      regex: 'netflix|spotify|amazon prime|disney|youtube|subscription|assinatura',
      color: '#64748b',
      enabled: true
    },
    {
      name: 'Bancos/Financeiro',
      regex: 'banco|financeira|emprestimo|cartao|anuidade|tarifa|saque',
      color: '#dc2626',
      enabled: true
    }
  ];

  static getDefaultRules(): CategoryRule[] {
    return this.defaultRules.map((rule, index) => ({
      ...rule,
      id: `default-${index}`
    }));
  }

  static categorizeTransaction(transaction: Transaction, rules: CategoryRule[]): string {
    const description = transaction.descricao.toLowerCase();
    
    for (const rule of rules) {
      if (!rule.enabled) continue;
      
      try {
        const regex = new RegExp(rule.regex, 'i');
        if (regex.test(description)) {
          return rule.name;
        }
      } catch (error) {
        console.warn(`Invalid regex pattern for rule ${rule.name}:`, rule.regex);
      }
    }
    
    return 'Outros';
  }

  static categorizeTransactions(transactions: Transaction[], rules: CategoryRule[]): Transaction[] {
    return transactions.map(transaction => ({
      ...transaction,
      categoriaCustom: this.categorizeTransaction(transaction, rules)
    }));
  }
}
