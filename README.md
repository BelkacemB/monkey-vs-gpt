# Monkey vs GPT: Stock Trading Showdown

![image](https://github.com/user-attachments/assets/7e5a4237-0a94-4412-af91-35b8fb37d8bb)

## Overview

This project is an experiment that pits a ChatGPT-powered AI trader against a "monkey" trader (simulating random stock picks) in a virtual stock market (using real market news and data). The goal is to compare the performance of AI-driven trading strategies against random selection over time.

## Features

- Real-time stock market data integration
- AI-powered trading decisions using ChatGPT
- Random stock selection for the "monkey" trader
- Automated trading simulation
- Performance tracking and visualization
- Web interface to view results and trading history

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Python (AWS Lambda)
- Database: AWS DynamoDB
- Deployment: Vercel (frontend), AWS SAM (backend)
- APIs: OpenAI API, Yahoo Finance API

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python 3.9
- AWS CLI
- SAM CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/belkacemb/monkey-vs-gpt.git
   cd monkey-vs-gpt
   ```

2. Install frontend dependencies:
   ```
   cd app
   npm install
   ```

3. Set up backend:
   ```
   cd ../functions/daily-trade
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env.local` file in the `app` directory with the following variables:
     ```
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     AWS_DB_REGION=your-aws-region
     AWS_DB_ACCESS_KEY=your-aws-access-key
     AWS_DB_ACCESS_SECRET=your-aws-secret-key
     ```
   - Create an `env.json` file in the `functions/daily-trade` directory with:
     ```json
     {
       "DailyTradeFunction": {
         "OPENAI_API_KEY": "your-openai-api-key",
         "TRADING_TABLE_NAME": "TradingTable"
       }
     }
     ```

### Running the Project

1. Start the frontend:
   ```
   cd app
   npm run dev
   ```

2. Deploy the backend:
   ```
   cd functions/daily-trade
   sam build
   sam deploy --guided
   ```

3. Visit `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
