import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { useState } from "react";

interface JobSeekersFiltersProps {
  onSearch: (searchParams: {
    name?: string;
    jobTitle?: string;
    skills?: string;
    location?: string;
  }) => void;
  onReset: () => void;
}

export function JobSeekersFilters({ onSearch, onReset }: JobSeekersFiltersProps) {
  const [searchName, setSearchName] = useState('');
  const [searchJobTitle, setSearchJobTitle] = useState('');
  const [searchSkills, setSearchSkills] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = () => {
    const searchParams: any = {};
    if (searchName.trim()) searchParams.name = searchName.trim();
    if (searchJobTitle.trim()) searchParams.jobTitle = searchJobTitle.trim();
    if (searchSkills.trim()) searchParams.skills = searchSkills.trim();
    if (searchLocation.trim()) searchParams.location = searchLocation.trim();
    
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchName('');
    setSearchJobTitle('');
    setSearchSkills('');
    setSearchLocation('');
    onReset();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search name/email"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Job title"
            value={searchJobTitle}
            onChange={(e) => setSearchJobTitle(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Skills"
            value={searchSkills}
            onChange={(e) => setSearchSkills(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex-1">
          <Input
            placeholder="Location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex gap-2">
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