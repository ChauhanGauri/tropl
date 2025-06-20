import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ClientsFiltersProps {
  onSearch: (searchParams: {
    name?: string;
    phone?: string;
    contactPerson?: string;
  }) => void;
  onReset: () => void;
}

export function ClientsFilters({ onSearch, onReset }: ClientsFiltersProps) {
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchContactPerson, setSearchContactPerson] = useState('');

  const handleSearch = () => {
    const searchParams: any = {};
    if (searchName.trim()) searchParams.name = searchName.trim();
    if (searchPhone.trim()) searchParams.phone = searchPhone.trim();
    if (searchContactPerson.trim()) searchParams.contactPerson = searchContactPerson.trim();
    
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchPhone('');
    setSearchContactPerson('');
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search by name" 
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex-1">
          <Input 
            placeholder="Search by phone" 
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex-1">
          <Input 
            placeholder="Search by contact person" 
            value={searchContactPerson}
            onChange={(e) => setSearchContactPerson(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>        <div className="flex gap-2">
          <Button className="flex items-center" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" className="flex items-center" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
} 