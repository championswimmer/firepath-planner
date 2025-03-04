
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { ArrowDown, ArrowUp, ChevronRight, Calendar, PiggyBank, Wallet, TrendingUp } from 'lucide-react';
import { ChartData, ProjectionData } from '@/types';
import { formatCurrency } from '@/utils/financialCalculations';
import { cn } from '@/lib/utils';

interface FinancialChartProps {
  data: ChartData;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState<ProjectionData[]>([]);
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    finalSavings: 0,
    finalInvestments: 0,
    totalValue: 0,
    fireYear: 0,
  });
  
  const currentYear = new Date().getFullYear();
  
  // Combine past and future data for charting
  useEffect(() => {
    if (data) {
      const combined = [...data.past, ...data.future];
      setChartData(combined);
      
      // Calculate financial statistics
      calculateStatistics(combined);
    }
  }, [data]);
  
  // Calculate key financial statistics
  const calculateStatistics = (chartData: ProjectionData[]) => {
    if (!chartData.length) return;
    
    const totalIncome = data.past.reduce((sum, item) => sum + item.income, 0) + 
                        data.future.slice(0, 20).reduce((sum, item) => sum + item.income, 0);
    
    const finalValues = chartData[chartData.length - 1];
    const totalValue = finalValues.savings + finalValues.investments;
    
    // Estimate FIRE year - when investments can generate enough passive income
    // Using the 4% rule: when 4% of investments exceeds current annual spending
    const lastKnownIncome = data.past[data.past.length - 1]?.income || 0;
    const spendPercentage = 70; // Assuming 70% spend by default
    const annualSpending = lastKnownIncome * (spendPercentage / 100);
    
    let fireYear = 0;
    for (const entry of chartData) {
      // If 4% of investments can cover annual spending, mark as FIRE year
      if (entry.investments * 0.04 >= annualSpending) {
        fireYear = entry.year;
        break;
      }
    }
    
    setStatistics({
      totalIncome,
      finalSavings: finalValues.savings,
      finalInvestments: finalValues.investments,
      totalValue,
      fireYear,
    });
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPastYear = label <= currentYear;
      
      return (
        <div className="glass-card p-3 shadow-md border border-primary/10 text-sm">
          <p className="font-semibold border-b pb-1 mb-2">{`Year: ${label}`} {isPastYear ? '(Historical)' : '(Projected)'}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 py-0.5">
              <div className="w-3 h-3" style={{ backgroundColor: entry.color }}></div>
              <span className="font-medium">{entry.name}:</span>
              <span>{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full animate-zoom-in">
      {/* Financial Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Estimated FIRE Year
                </p>
                <h3 className="text-2xl font-bold">
                  {statistics.fireYear > 0 ? statistics.fireYear : "N/A"}
                </h3>
                {statistics.fireYear > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {statistics.fireYear - currentYear} years from now
                  </p>
                )}
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <ChevronRight className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Wallet className="h-4 w-4 mr-1" /> Lifetime Income
                </p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(statistics.totalIncome)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Past & 20 years projection
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <TrendingUp className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <PiggyBank className="h-4 w-4 mr-1" /> Final Savings
                </p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(statistics.finalSavings)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  After 40 years
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <ArrowUp className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" /> Final Investments
                </p>
                <h3 className="text-2xl font-bold">
                  {formatCurrency(statistics.finalInvestments)}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  After 40 years
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <ArrowUp className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Card className="glass-card chart-container">
        <CardHeader className="pb-3">
          <CardTitle>Financial Projections</CardTitle>
          <CardDescription>
            Visualize your FIRE journey with projected income, savings, and investments
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
            </TabsList>
            
            <TabsContent 
              value="overview" 
              className={cn(
                "transition-all duration-500", 
                activeTab === "overview" ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine x={currentYear} stroke="#888" strokeDasharray="3 3" />
                    {statistics.fireYear > 0 && (
                      <ReferenceLine 
                        x={statistics.fireYear} 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ 
                          value: 'FIRE', 
                          position: 'top',
                          fill: '#10b981',
                          fontSize: 12
                        }} 
                      />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="income" 
                      name="Income" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 1, fill: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      name="Savings" 
                      stroke="#a855f7" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 1, fill: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="investments" 
                      name="Investments" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 1 }}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent 
              value="income"
              className={cn(
                "transition-all duration-500", 
                activeTab === "income" ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine x={currentYear} stroke="#888" strokeDasharray="3 3" />
                    <Bar 
                      dataKey="income" 
                      name="Income" 
                      fill="#3b82f6" 
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent 
              value="savings"
              className={cn(
                "transition-all duration-500", 
                activeTab === "savings" ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine x={currentYear} stroke="#888" strokeDasharray="3 3" />
                    <defs>
                      <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      name="Savings" 
                      stroke="#a855f7" 
                      fill="url(#savingsGradient)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, stroke: '#a855f7', strokeWidth: 1, fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent 
              value="investments"
              className={cn(
                "transition-all duration-500", 
                activeTab === "investments" ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine x={currentYear} stroke="#888" strokeDasharray="3 3" />
                    {statistics.fireYear > 0 && (
                      <ReferenceLine 
                        x={statistics.fireYear} 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        label={{ 
                          value: 'FIRE', 
                          position: 'top',
                          fill: '#10b981',
                          fontSize: 12
                        }} 
                      />
                    )}
                    <defs>
                      <linearGradient id="investmentsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="investments" 
                      name="Investments" 
                      stroke="#10b981" 
                      fill="url(#investmentsGradient)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 1, fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialChart;
