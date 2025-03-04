
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinancialData } from '@/types';

interface InflationSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  formData: FinancialData;
  handleSliderChange: (name: string, value: number[]) => void;
}

const InflationSection: React.FC<InflationSectionProps> = ({
  expanded,
  toggleSection,
  formData,
  handleSliderChange,
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 glass-card animate-fade-in">
      <CardHeader 
        className="cursor-pointer flex flex-row items-center justify-between bg-secondary/50"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">Inflation</CardTitle>
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </CardHeader>
      
      <div className={cn(
        "transition-all duration-300 ease-apple",
        expanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <CardContent className="pt-6 pb-4 space-y-6">
          <CardDescription className="pb-2">
            Expected annual inflation rate for future projections
          </CardDescription>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="inflationRate" className="text-sm">Expected Inflation Rate</Label>
              <span className="text-sm font-medium">{formData.inflationRate}%</span>
            </div>
            <Slider
              id="inflationRate"
              name="inflationRate"
              value={[formData.inflationRate]}
              min={0}
              max={10}
              step={0.1}
              onValueChange={(value) => handleSliderChange("inflationRate", value)}
              className="py-2"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default InflationSection;
