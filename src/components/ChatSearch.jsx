import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ChatSearch = ({ messages, onSearchResult }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const results = messages.filter(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onSearchResult(results);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
      <Input
        type="text"
        placeholder="Search in chat..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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