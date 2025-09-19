import React, { useState } from 'react';
import { CategoryRule } from '../types/Category';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface CategoryManagerProps {
  rules: CategoryRule[];
  onUpdateRules: (rules: CategoryRule[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ rules, onUpdateRules }) => {
  const [editingRule, setEditingRule] = useState<CategoryRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState<Omit<CategoryRule, 'id'>>({
    name: '',
    regex: '',
    color: '#3b82f6',
    enabled: true
  });

  const handleSaveRule = () => {
    if (editingRule) {
      const updatedRules = rules.map(rule => 
        rule.id === editingRule.id ? editingRule : rule
      );
      onUpdateRules(updatedRules);
      setEditingRule(null);
    }
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.regex) {
      const rule: CategoryRule = {
        ...newRule,
        id: `custom-${Date.now()}`
      };
      onUpdateRules([...rules, rule]);
      setNewRule({ name: '', regex: '', color: '#3b82f6', enabled: true });
      setIsCreating(false);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    onUpdateRules(updatedRules);
  };

  const handleToggleRule = (ruleId: string) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );
    onUpdateRules(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Regras de Categorização</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Regra
        </button>
      </div>

      {isCreating && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Restaurantes"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor
              </label>
              <input
                type="color"
                value={newRule.color}
                onChange={(e) => setNewRule({ ...newRule, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expressão Regular
              </label>
              <input
                type="text"
                value={newRule.regex}
                onChange={(e) => setNewRule({ ...newRule, regex: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: restaurante|lanchonete|bar|pizzaria"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use | para separar múltiplas palavras-chave
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1 inline" />
              Cancelar
            </button>
            <button
              onClick={handleCreateRule}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-1 inline" />
              Salvar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white border rounded-lg p-4">
            {editingRule?.id === rule.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={editingRule.name}
                      onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cor
                    </label>
                    <input
                      type="color"
                      value={editingRule.color}
                      onChange={(e) => setEditingRule({ ...editingRule, color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regex
                    </label>
                    <input
                      type="text"
                      value={editingRule.regex}
                      onChange={(e) => setEditingRule({ ...editingRule, regex: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingRule(null)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-1 inline" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRule}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 mr-1 inline" />
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: rule.color }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rule.name}</h4>
                    <p className="text-sm text-gray-500 font-mono">{rule.regex}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => handleToggleRule(rule.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Ativo</span>
                  </label>
                  
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  {rule.id.startsWith('custom-') && (
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
