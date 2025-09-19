import * as XLSX from 'xlsx';
import { Transaction } from '../types/Transaction';

export class XLSXParser {
  static parseFile(file: File): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const transactions: Transaction[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            
            if (row.length < 9) continue;
            
            const transaction: Transaction = {
              id: `${i}-${Date.now()}`,
              dataCompra: this.parseDate(row[0]),
              nomeCartao: row[1] || '',
              finalCartao: row[2] || '',
              categoria: row[3] || '',
              descricao: row[4] || '',
              parcela: row[5] || '',
              valorUSD: this.parseNumber(row[6]),
              cotacao: this.parseNumber(row[7]),
              valorBRL: this.parseNumber(row[8])
            };
            
            transactions.push(transaction);
          }
          
          resolve(transactions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  }
  
  private static parseDate(value: any): string {
    if (!value) return '';
    
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      return `${date.d.toString().padStart(2, '0')}/${date.m.toString().padStart(2, '0')}/${date.y}`;
    }
    
    return value.toString();
  }
  
  private static parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  }
}
