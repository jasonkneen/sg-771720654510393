import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { debounce } from '@/utils/debounce';
import performanceMonitor from '@/utils/performanceMonitor';
import { logError } from '@/utils/errorLogger';

const ChatSearch = ({ messages, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    performanceMonitor.start('ChatSearch-handleSearch');
    try {
      if (searchTerm.trim()) {
        const results = messages.filter(message =>
          message.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        onSearchResult(results);
      }
    } catch (error) {
      logError(error, { context: 'ChatSearch - handleSearch' });
      console.error('Error in chat search:', error);
    }
    performanceMonitor.end('ChatSearch-handleSearch');
  }, [searchTerm, messages, onSearchResult]);

  const debouncedSearch = debounce(handleSearch, 300);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e);
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <Input
        type="text"
        placeholder="Search in chat..."
        value={searchTerm}
        onChange={handleInputChange}
        className="flex-1"
      />
      <Button type="submit" variant="secondary">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default ChatSearch;