import React, { useEffect, useState } from 'react';
import { Chart, LineController, BarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
Chart.register(
  LineController,
  BarController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

interface ITContract {
  reference_number?: string;
  procurement_id?: string;
  vendor_name?: string;
  contract_date?: string;
  contract_value?: number;
  original_value?: number;
  amendment_value?: number;
  description_en?: string;
  department?: string;
}

const ITContractTrendAnalysis: React.FC = () => {
  const [contracts, setContracts] = useState<ITContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [topVendors, setTopVendors] = useState<string[]>([]);

  // Date range for analysis
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2025-03-27');

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load first 5 chunks for testing
        const chunksToLoad = 5;
        const chunkFiles = Array.from({ length: chunksToLoad }, (_, i) => 
          `/it_contracts_chunks/chunk_${i}.json`
        );

        const chunkPromises = chunkFiles.map(async (file, index) => {
          try {
            const response = await fetch(file);
            if (!response.ok) {
              console.warn(`Chunk ${index} not found: ${file}`);
              return [];
            }
            const data = await response.json();
            console.log(`Loaded chunk ${index} with ${data.length} contracts`);
            return data;
          } catch (err) {
            console.error(`Error loading chunk ${index}:`, err);
            return [];
          }
        });

        const chunks = await Promise.all(chunkPromises);
        const allContracts: ITContract[] = chunks.flat();

        // Filter contracts with required fields
        const filteredContracts = allContracts.filter(contract => {
          if (!contract?.contract_date || !contract?.vendor_name) return false;
          
          try {
            const contractDate = new Date(contract.contract_date);
            const isValidDate = !isNaN(contractDate.getTime()) && 
                              contractDate >= startDate && 
                              contractDate <= endDate;
            
            const hasValue = contract.contract_value || 
                           contract.original_value || 
                           contract.amendment_value;

            return isValidDate && hasValue;
          } catch (e) {
            console.warn('Invalid contract date:', contract.contract_date);
            return false;
          }
        });

        if (filteredContracts.length === 0) {
          throw new Error('No valid contracts found. Please check your data files.');
        }

        // Identify top 5 vendors by total contract value
        const vendorTotals: Record<string, number> = {};
        filteredContracts.forEach(contract => {
          const value = contract.contract_value || contract.original_value || contract.amendment_value || 0;
          vendorTotals[contract.vendor_name!] = (vendorTotals[contract.vendor_name!] || 0) + value;
        });

        const sortedVendors = Object.entries(vendorTotals)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([vendor]) => vendor);

        setTopVendors(sortedVendors);
        setContracts(filteredContracts);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load contract data');
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, []);

  // Process data for both charts
  const processChartData = () => {
    const valueTrend = {
      labels: [] as string[],
      values: [] as number[]
    };

    const vendorTrend = {
      labels: [] as string[],
      datasets: [] as {label: string, data: number[], backgroundColor: string}[]
    };

    // Initialize vendor data structure
    const vendorColors = [
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 99, 132, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(153, 102, 255, 0.7)'
    ];

    topVendors.forEach((vendor, index) => {
      vendorTrend.datasets.push({
        label: vendor,
        data: [],
        backgroundColor: vendorColors[index] || 'rgba(201, 203, 207, 0.7)'
      });
    });

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      let periodEnd = new Date(currentDate);
      let label = '';

      if (timePeriod === 'monthly') {
        periodEnd.setMonth(currentDate.getMonth() + 1);
        label = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (timePeriod === 'quarterly') {
        periodEnd.setMonth(currentDate.getMonth() + 3);
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        label = `Q${quarter} ${currentDate.getFullYear()}`;
      } else {
        periodEnd.setFullYear(currentDate.getFullYear() + 1);
        label = currentDate.getFullYear().toString();
      }

      // Filter contracts for this period
      const periodContracts = contracts.filter(contract => {
        try {
          const contractDate = new Date(contract.contract_date!);
          return contractDate >= currentDate && contractDate < periodEnd;
        } catch (e) {
          return false;
        }
      });

      // Calculate average value for value trend
      const totalValue = periodContracts.reduce((sum, contract) => {
        return sum + (contract.contract_value || contract.original_value || contract.amendment_value || 0);
      }, 0);

      const avgValue = periodContracts.length > 0 ? Math.round(totalValue / periodContracts.length) : 0;

      // Calculate vendor totals for this period
      const vendorValues: Record<string, number> = {};
      topVendors.forEach(vendor => {
        vendorValues[vendor] = 0;
      });

      periodContracts.forEach(contract => {
        const value = contract.contract_value || contract.original_value || contract.amendment_value || 0;
        if (topVendors.includes(contract.vendor_name!)) {
          vendorValues[contract.vendor_name!] += value;
        }
      });

      // Store data for both charts
      valueTrend.labels.push(label);
      valueTrend.values.push(avgValue);

      vendorTrend.labels.push(label);
      vendorTrend.datasets.forEach(dataset => {
        dataset.data.push(vendorValues[dataset.label] || 0);
      });

      // Move to next period
      currentDate.setTime(periodEnd.getTime());
    }

    return { valueTrend, vendorTrend };
  };

  // Render both charts
  useEffect(() => {
    if (contracts.length === 0 || topVendors.length === 0) return;

    const { valueTrend, vendorTrend } = processChartData();
    console.log('Processed chart data:', { valueTrend, vendorTrend });

    // Render Average Value Trend Chart
    const renderValueChart = () => {
      const canvas = document.getElementById('valueTrendChart');
      if (!canvas) return;

      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;

      const existingChart = Chart.getChart(canvas as HTMLCanvasElement);
      if (existingChart) existingChart.destroy();

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: valueTrend.labels,
          datasets: [{
            label: 'Average Contract Value (CAD$)',
            data: valueTrend.values,
            borderColor: 'rgba(54, 162, 235, 0.8)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            borderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Average: $${context.raw?.toLocaleString() || '0'}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `$${Number(value).toLocaleString()}`
              }
            }
          }
        }
      });
    };

    // Render Vendor Value Trend Chart
    const renderVendorChart = () => {
      const canvas = document.getElementById('vendorTrendChart');
      if (!canvas) return;

      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;

      const existingChart = Chart.getChart(canvas as HTMLCanvasElement);
      if (existingChart) existingChart.destroy();

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: vendorTrend.labels,
          datasets: vendorTrend.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: $${context.raw?.toLocaleString() || '0'}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              stacked: false,
              ticks: {
                callback: (value) => `$${Number(value).toLocaleString()}`
              }
            }
          }
        }
      });
    };

    renderValueChart();
    renderVendorChart();
  }, [contracts, timePeriod, topVendors]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading contract data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">IT Contract Trends</h1>
        <p className="text-gray-600 text-sm">
          Analyzing {contracts.length.toLocaleString()} contracts from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
        </p>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setTimePeriod('monthly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimePeriod('quarterly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Quarterly
        </button>
        <button
          onClick={() => setTimePeriod('yearly')}
          className={`px-3 py-1 text-xs rounded ${timePeriod === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Value Trend Chart */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Average Contract Value</h2>
          <div className="relative h-64">
            <canvas id="valueTrendChart" />
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Average value of IT contracts over time
          </p>
        </div>

        {/* Top Vendors Trend Chart */}
        <div className="bg-white p-4 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Top Vendors by Value</h2>
          <div className="relative h-64">
            <canvas id="vendorTrendChart" />
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Top 5 vendors by total contract value
          </p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-3 rounded text-sm">
        <h3 className="font-medium mb-1">Data Summary:</h3>
        <ul className="space-y-1">
          <li>• Loaded {contracts.length.toLocaleString()} valid contracts</li>
          <li>• Showing {timePeriod} trends from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</li>
          <li>• Top vendors: {topVendors.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ITContractTrendAnalysis;