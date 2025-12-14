"use client";
import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SkeletonList } from '@/components/ui/skeleton';

const CATEGORIES = [
  { value: 'CHOCOLATE', label: 'Chocolate' },
  { value: 'CANDY', label: 'Candy' },
  { value: 'PASTRY', label: 'Pastry' },
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'NAMKEEN', label: 'Namkeen' },
  { value: 'TRADITIONAL', label: 'Traditional' },
];

export default function HomePage() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const loadSweets = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await api.get('/api/v1/sweet/get-all-sweets');
      setSweets(data.sweets || []);
    } catch (err) {
      console.error('Error loading sweets:', err);
      setError('Failed to load sweets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchSweets = async (e) => {
    e?.preventDefault?.();
    try {
      setError(null);
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '' && v != null)
      );
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      const { data } = await api.get('/api/v1/sweet/search', { params });
      setSweets(data.sweets || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    setSearchTerm('');
    loadSweets();
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      const matchesSearch = !searchTerm || 
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filters.category || sweet.category === filters.category;
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      const matchesPrice = sweet.price >= minPrice && sweet.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [sweets, searchTerm, filters]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Discover Sweet Delights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our collection of handcrafted sweets and treats made with the finest ingredients.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <form onSubmit={searchSweets} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search sweets..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button type="submit" className="px-6">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Advanced Filters</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Reset all
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <Select
                          value={filters.category}
                          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        >
                          <option value="">All Categories</option>
                          {CATEGORIES.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Price
                        </label>
                        <Input
                          type="number"
                          placeholder="Min price"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Price
                        </label>
                        <Input
                          type="number"
                          placeholder="Max price"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || Object.values(filters).some(Boolean) ? 'Search Results' : 'Our Sweets'}
            </h2>
            <p className="text-sm text-gray-500">
              {filteredSweets.length} {filteredSweets.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {loading ? (
            <SkeletonList />
          ) : filteredSweets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSweets.map((sweet) => (
                <motion.div
                  key={sweet._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <div className="relative pt-[70%] overflow-hidden rounded-t-lg">
                      <img
                        src={sweet.sweetImage || '/placeholder-sweet.jpg'}
                        alt={sweet.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-sweet.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                          {sweet.category}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">
                        <a
                          href={`/sweets/${sweet._id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {sweet.name}
                        </a>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {sweet.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <div className="mt-auto p-6 pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ${sweet.price?.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">/ item</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{sweet.quantity}</span> in stock
                        </div>
                      </div>
                      <a href={`/sweets/${sweet._id}`} className="block w-full mt-4">
                        <Button className="w-full">
                          View Details
                        </Button>
                      </a>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No sweets found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetFilters();
                    setSearchTerm('');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
