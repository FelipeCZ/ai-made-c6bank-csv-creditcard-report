# C6 Bank XLSX Categorizer

A web application for processing and categorizing C6 Bank credit card transactions from XLSX files.

## Features

- **XLSX File Processing**: Upload and parse C6 Bank credit card XLSX files
- **Automatic Categorization**: Regex-based transaction categorization with customizable rules
- **Local Storage**: Uses IndexedDB for browser-based data persistence
- **Data Management**: Export and import functionality for backup and restore
- **Dashboard**: Visual statistics and insights about your transactions
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FelipeCZ/ai-made-c6bank-csv-creditcard-report.git
cd ai-made-c6bank-csv-creditcard-report
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Upload XLSX File**: Click on the file upload area and select your C6 Bank credit card XLSX file
2. **View Transactions**: Browse your transactions in the Transactions tab
3. **Manage Categories**: Customize categorization rules in the Categories tab
4. **Export/Import Data**: Backup and restore your data using the Data tab
5. **View Statistics**: Check your spending patterns in the Dashboard

## XLSX File Format

The application expects XLSX files with the following columns:
- Data de compra (Purchase Date)
- Nome no cartão (Name on Card)
- Final do Cartão (Card Ending)
- Categoria (Category)
- Descrição (Description)
- Parcela (Installment)
- Valor em US$ (USD Value)
- Cotação (Exchange Rate)
- Valor em R$ (BRL Value)

## Default Categories

The application comes with pre-configured categorization rules for:
- Restaurantes (Restaurants)
- Supermercados (Supermarkets)
- Postos de Combustível (Gas Stations)
- Farmácias (Pharmacies)
- Transporte (Transportation)
- Shopping
- Streaming/Assinaturas (Streaming/Subscriptions)
- Bancos/Financeiro (Banks/Financial)

## Privacy

All data is stored locally in your browser using IndexedDB. No data is sent to external servers.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
