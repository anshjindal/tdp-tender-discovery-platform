import React, { useEffect, useRef, useState } from 'react';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Contract {
  description_en?: string;
  contract_date?: string;
  department?: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const VisContractCountTrends: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all chunk files from the correct public path
        const chunks = await Promise.all(
          Array.from({ length: 20 }, (_, i) =>
            fetch(`/it_contracts_chunks/chunk_${i}.json`)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to load chunk ${i}`);
                return res.json();
              })
              .catch(err => {
                console.error(`Error loading chunk ${i}:`, err);
                return []; // Return empty array if chunk fails to load
              })
          )
        );

        const contracts: Contract[] = chunks.flat();
        
        // Filter out contracts without dates
        const validContracts = contracts.filter(c => c.contract_date);
        
        if (validContracts.length === 0) {
          setError('No valid contracts with dates found');
          return;
        }

        // Process data by year and category
        const yearCounts: Record<string, Record<string, number>> = {};
        const minYear = new Date().getFullYear() - 5; // Show last 5 years by default
        const maxYear = new Date().getFullYear();

        validContracts.forEach(contract => {
          const year = new Date(contract.contract_date!).getFullYear();
          // Only include recent years
          if (year < minYear || year > maxYear) return;
          
          const yearStr = year.toString();
          const description = contract.description_en?.toLowerCase() || 'other';

          let category = 'Other';
          if (description.includes('web') || description.includes('site')) category = 'Web Design';
          else if (description.includes('cloud') || description.includes('nuage')) category = 'Cloud Services';
          else if (description.includes('cyber') || description.includes('sécurité')) category = 'Cybersecurity';
          else if (description.includes('software') || description.includes('logiciel') || 
                  description.includes('information technology') || 
                  description.includes('technologie de l\'information')) category = 'Software';
          else if (description.includes('hardware') || description.includes('matériel')) category = 'Hardware';
          else if (description.includes('consult') || description.includes('conseil') || 
                  description.includes('expert')) category = 'Consulting';

          if (!yearCounts[yearStr]) {
            yearCounts[yearStr] = {};
          }

          yearCounts[yearStr][category] = (yearCounts[yearStr][category] || 0) + 1;
        });

        // Prepare chart data
        const years = Object.keys(yearCounts).sort();
        if (years.length === 0) {
          setError('No contract data available for the selected time range');
          return;
        }

        const categories = ['Web Design', 'Cloud Services', 'Cybersecurity', 'Software', 'Hardware', 'Consulting', 'Other'];
        const datasets = categories.map(category => ({
          label: category,
          data: years.map(year => yearCounts[year]?.[category] || 0),
          backgroundColor: getCategoryColor(category),
          borderColor: getCategoryColor(category).replace('0.7', '1'),
          borderWidth: 1
        }));

        // Debug logging
        console.log('Processed contract data:', {
          years,
          yearCounts,
          datasets,
          sampleContract: validContracts[0] // Log first contract for verification
        });

        setChartData({
          labels: years,
          datasets,
        });
      } catch (err) {
        console.error('Error processing contract data:', err);
        setError('Failed to load contract data. Please check the console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Year',
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              text: 'Number of Contracts',
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [chartData]);

  if (loading) return <div className="text-center text-gray-500">Loading contract data...</div>;
  if (error) return <div className="text-center text-red-500 p-4 bg-red-50 rounded">{error}</div>;
  if (!chartData) return <div className="text-center text-gray-500">No contract data available</div>;

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-[#5C5C5D]">IT Contracts by Year and Category</h2>
      <div className="relative h-[400px] w-full">
        <canvas ref={chartRef} key={JSON.stringify(chartData)} />
      </div>
    </div>
  );
};

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Web Design': 'rgba(54, 162, 235, 0.7)',
    'Cloud Services': 'rgba(255, 99, 132, 0.7)',
    'Cybersecurity': 'rgba(75, 192, 192, 0.7)',
    'Software': 'rgba(255, 159, 64, 0.7)',
    'Hardware': 'rgba(153, 102, 255, 0.7)',
    'Consulting': 'rgba(50, 205, 50, 0.7)',
    'Other': 'rgba(201, 203, 207, 0.7)',
  };
  return colors[category] || 'rgba(201, 203, 207, 0.7)';
}

export default VisContractCountTrends;