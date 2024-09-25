'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioSummaryProps {
    name: string;
    valuations: Valuations;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ name, valuations }) => {


    const monkeyValuations = valuations['monkeyValuations'];
    const chatGptValuations = valuations['chatGptValuations'];

    const lastValuation = name === 'Monkey Portfolio' ? monkeyValuations[monkeyValuations.length - 1].value : chatGptValuations[chatGptValuations.length - 1].value;
    const percentageChange = ((lastValuation - 5000) / 5000) * 100;

    const traderName = name === 'Monkey Portfolio' ? 'The Kong of Wall Street' : 'The Wall Street Cyborg';

    return (
        <Card>
            <CardHeader>
                <CardTitle>{traderName}</CardTitle>
                <CardDescription>
                    {`${name}'s performance`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ${lastValuation.toFixed(2)}
                </div>
                <div className="text-md text-muted-foreground">
                    {percentageChange.toFixed(2)}%
                </div>
            </CardContent>
        </Card>
    );
};

export default PortfolioSummary;
