import { useState } from 'react'
import { filterOpenTenderNotices, getOpenTenderNoticesToDB } from '../../../api/api'
import { SubNavMenu } from '../components/SubNavMenu';
import { FilteredTenderData } from '../components/FilteredTenderData';
import { PageLayout } from '../../../components/pagelayout/FeaturePageLayout'


export const AiSearchTender: React.FC = () => {
  const [formData, setFormData] = useState({ prompt: '' });
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Refresh tenders from API
  const refreshTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      await getOpenTenderNoticesToDB();
    } catch (e) {
      console.error('Failed to refresh tenders:', e);
      setError('Failed to refresh tenders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowData(false);
    setLoading(true);
    setError(null);
    try {
      await filterOpenTenderNotices(formData.prompt);
      setShowData(true);
    } catch (e) {
      console.error('Failed to filter tenders:', e);
      setError('Failed to generate leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <SubNavMenu /> {/* Integrate sub-navigation */}
      <h1 className="text-3xl font-bold mb-4">AI-Powered Tender Search</h1>

      <button
        onClick={refreshTenders}
        disabled={loading}
        className="text-white bg-black h-12 text-xl font-bold mb-4 rounded disabled:bg-gray-400"
      >
        {loading ? 'Refreshing...' : 'Refresh Open Tender Notices'}
      </button>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          placeholder="Tell us what kind of tenders you want (e.g., 'construction in Texas')"
          className="border-2 border-gray-300 w-full h-12 px-4 text-xl rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-white bg-black w-full h-12 text-xl font-bold rounded disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate Leads'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {showData && <FilteredTenderData />}
    </PageLayout>
  );
};