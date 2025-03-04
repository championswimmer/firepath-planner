
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, Wallet, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinancialData } from '@/types';

interface HistoricalDataSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  formData: FinancialData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  historicalEntries: { year: number; amount: number }[];
  handleHistoricalChange: (index: number, value: string) => void;
  currentYear: number;
}

const HistoricalDataSection: React.FC<HistoricalDataSectionProps> = ({
  expanded,
  toggleSection,
  formData,
  handleInputChange,
  historicalEntries,
  handleHistoricalChange,
  currentYear,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Historical Earnings</CardTitle>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-apple",
        expanded ? "max-h-[600px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <CardContent className="pt-6 pb-4 space-y-6">
          <CardDescription className="pb-2">
            Enter your first year of earnings and income history
          </CardDescription>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstEarningYear" className="font-medium">First Year of Earnings</Label>
                <Input
                  id="firstEarningYear"
                  name="firstEarningYear"
                  type="number"
                  className="glass-input"
                  value={formData.firstEarningYear || ''}
                  onChange={handleInputChange}
                  min={1950}
                  max={currentYear - 1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstYearEarnings" className="font-medium">First Year's Income</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstYearEarnings"
                    name="firstYearEarnings"
                    type="number"
                    className="pl-10 glass-input"
                    value={formData.firstYearEarnings || ''}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {historicalEntries.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="text-md font-medium">Income for Intermediate Years</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter income for specific years (leave empty for auto-calculation)
                </p>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {historicalEntries.map((entry, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 items-center">
                      <div className="text-sm font-medium">{entry.year}</div>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="number"
                          className="pl-10 glass-input"
                          value={entry.amount || ''}
                          onChange={(e) => handleHistoricalChange(index, e.target.value)}
                          placeholder="Optional"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default HistoricalDataSection;
