import React, { useEffect, useState } from 'react';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Contract {
  description_en?: string;
  contract_date?: string;
  contract_value?: number;
  original_value?: number;
  amendment_value?: number;
  department?: string;
}

interface SubcategoryData {
  label: string;
  years: string[];
  averages: number[];
  color: string;
}

const AverageContractTrendsGraph: React.FC = () => {
  const [subcategoryData, setSubcategoryData] = useState<SubcategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all chunk files
        const chunks = await Promise.all(
          Array.from({ length: 20 }, (_, i) =>
            fetch(`/it_contracts_chunks/chunk_${i}.json`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to load chunk ${i}`);
                return res.json();
              })
              .catch(err => {
                console.error(`Error loading chunk ${i}:`, err);
                return [];
              })
          )
        );

        const contracts: Contract[] = chunks.flat();
        
        // Filter out contracts without required data
        const validContracts = contracts.filter(c => 
          c.contract_date && 
          (c.contract_value || c.original_value || c.amendment_value)
        );
        
        if (validContracts.length === 0) {
          setError('No valid contracts with financial data found');
          return;
        }

        const subcategories = [
          { 
            name: 'Software', 
            keywords: ['software', 'application', 'platform', 'saas'],
            color: 'rgba(255, 159, 64, 0.7)'
          },
          { 
            name: 'Cloud', 
            keywords: ['cloud', 'iaas', 'paas'],
            color: 'rgba(54, 162, 235, 0.7)'
          },
          { 
            name: 'Security', 
            keywords: ['security', 'cyber', 'firewall', 'encryption'],
            color: 'rgba(255, 99, 132, 0.7)'
          },
          { 
            name: 'Hardware', 
            keywords: ['hardware', 'server', 'computer'],
            color: 'rgba(75, 192, 192, 0.7)'
          },
          { 
            name: 'Services', 
            keywords: ['support', 'maintenance', 'managed services'],
            color: 'rgba(153, 102, 255, 0.7)'
          }
        ];

        // Process data by year and subcategory
        const currentYear = new Date().getFullYear();
        const years = Array.from({length: 5}, (_, i) => currentYear - 4 + i); // Last 5 years
        const yearStrings = years.map(y => y.toString());

        const processedData = subcategories.map(({name, keywords, color}) => {
          // Initialize year data for this subcategory
          const yearStats: Record<string, {total: number, count: number}> = {};
          years.forEach(year => {
            yearStats[year] = {total: 0, count: 0};
          });

          // Process contracts for this subcategory
          validContracts.forEach(contract => {
            const year = new Date(contract.contract_date!).getFullYear();
            if (!years.includes(year)) return;
            
            const description = contract.description_en?.toLowerCase() || '';
            const matchesSubcategory = keywords.some(kw => description.includes(kw));
            
            if (matchesSubcategory) {
              const value = contract.contract_value || contract.original_value || contract.amendment_value || 0;
              yearStats[year].total += value;
              yearStats[year].count += 1;
            }
          });

          // Calculate averages
          const averages = years.map(year => {
            const stats = yearStats[year];
            return stats.count > 0 ? Math.round(stats.total / stats.count) : 0;
          });

          return {
            label: name,
            years: yearStrings,
            averages,
            color
          };
        });

        setSubcategoryData(processedData);
      } catch (err) {
        console.error('Error processing contract data:', err);
        setError('Failed to load contract data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading contract data...</div>;
  if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded">{error}</div>;
  if (subcategoryData.length === 0) return <div className="text-center text-gray-500">No contract data available</div>;

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-[#5C5C5D]">Average IT Contract Values by Subcategory (Last 5 Years)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subcategoryData.map((subcategory, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">{subcategory.label} Contracts</h3>
            <div className="relative h-[250px] w-full">
              <canvas 
                ref={node => {
                  if (!node) return;
                  
                  const ctx = node.getContext('2d');
                  if (!ctx) return;
                  
                  // Destroy previous chart instance if exists
                  const existingChart = Chart.getChart(node);
                  if (existingChart) existingChart.destroy();
                  
                  new Chart(ctx, {
                    type: 'line',
                    data: {
                      labels: subcategory.years,
                      datasets: [{
                        label: `Average ${subcategory.label} Value`,
                        data: subcategory.averages,
                        borderColor: subcategory.color,
                        backgroundColor: subcategory.color.replace('0.7', '0.1'),
                        tension: 0.3,
                        fill: true
                      }]
                    },
                    options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `Average: $${context.raw?.toLocaleString()}`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Average Value (CAD$)',
                          },
                          ticks: {
                            callback: (value) => `$${Number(value).toLocaleString()}`
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Year',
                          }
                        }
                      }
                    }
                  });
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>5-year trend for {subcategory.label.toLowerCase()} contracts</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>Data source: Government of Canada procurement contracts</p>
        <p>Values represent annual averages of identified IT contracts</p>
      </div>
    </div>
  );
};

export default AverageContractTrendsGraph;