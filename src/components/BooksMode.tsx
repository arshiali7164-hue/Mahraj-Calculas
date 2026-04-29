import { useState, useMemo, useEffect } from 'react';
import { Search, ExternalLink, BookText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type BookEntry = {
  id: string;
  classLevel: string;
  subject: string;
  name: string;
  url: string; // The link to actual PDF or digital version
};

type OpenLibraryDoc = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
};

const booksData: BookEntry[] = [
  // Class 8
  { id: '8_sci', classLevel: 'Class 8', subject: 'Science', name: 'Science Textbook for Class 8', url: 'https://ncert.nic.in/textbook.php?hesc1=0-13' },
  { id: '8_math', classLevel: 'Class 8', subject: 'Maths', name: 'Mathematics for Class 8', url: 'https://ncert.nic.in/textbook.php?hema1=0-13' },

  // Class 9
  { id: '9_sci', classLevel: 'Class 9', subject: 'Science', name: 'Science Textbook for Class 9', url: 'https://ncert.nic.in/textbook.php?iesc1=0-12' },
  { id: '9_math', classLevel: 'Class 9', subject: 'Maths', name: 'Mathematics for Class 9', url: 'https://ncert.nic.in/textbook.php?iema1=0-12' },

  // Class 10
  { id: '10_sci', classLevel: 'Class 10', subject: 'Science', name: 'Science Textbook for Class 10', url: 'https://ncert.nic.in/textbook.php?jesc1=0-13' },
  { id: '10_math', classLevel: 'Class 10', subject: 'Maths', name: 'Mathematics for Class 10', url: 'https://ncert.nic.in/textbook.php?jema1=0-14' },

  // Class 11 PCM
  { id: '11_phy_1', classLevel: 'Class 11', subject: 'Physics', name: 'Physics Part I', url: 'https://ncert.nic.in/textbook.php?keph1=0-8' },
  { id: '11_phy_2', classLevel: 'Class 11', subject: 'Physics', name: 'Physics Part II', url: 'https://ncert.nic.in/textbook.php?keph2=0-6' },
  { id: '11_chem_1', classLevel: 'Class 11', subject: 'Chemistry', name: 'Chemistry Part I', url: 'https://ncert.nic.in/textbook.php?kech1=0-7' },
  { id: '11_chem_2', classLevel: 'Class 11', subject: 'Chemistry', name: 'Chemistry Part II', url: 'https://ncert.nic.in/textbook.php?kech2=0-2' },
  { id: '11_math', classLevel: 'Class 11', subject: 'Maths', name: 'Mathematics for Class 11', url: 'https://ncert.nic.in/textbook.php?kema1=0-14' },

  // Class 12 PCM
  { id: '12_phy_1', classLevel: 'Class 12', subject: 'Physics', name: 'Physics Part I', url: 'https://ncert.nic.in/textbook.php?leph1=0-8' },
  { id: '12_phy_2', classLevel: 'Class 12', subject: 'Physics', name: 'Physics Part II', url: 'https://ncert.nic.in/textbook.php?leph2=0-6' },
  { id: '12_chem_1', classLevel: 'Class 12', subject: 'Chemistry', name: 'Chemistry Part I', url: 'https://ncert.nic.in/textbook.php?lech1=0-5' },
  { id: '12_chem_2', classLevel: 'Class 12', subject: 'Chemistry', name: 'Chemistry Part II', url: 'https://ncert.nic.in/textbook.php?lech2=0-5' },
  { id: '12_math_1', classLevel: 'Class 12', subject: 'Maths', name: 'Mathematics Part I', url: 'https://ncert.nic.in/textbook.php?lema1=0-6' },
  { id: '12_math_2', classLevel: 'Class 12', subject: 'Maths', name: 'Mathematics Part II', url: 'https://ncert.nic.in/textbook.php?lema2=0-7' },
];

export function BooksMode() {
  const [viewMode, setViewMode] = useState<'local' | 'internet'>('local');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClass, setActiveClass] = useState<'All' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12'>('All');
  
  // Internet Search State
  const [internetQuery, setInternetQuery] = useState('');
  const [internetResults, setInternetResults] = useState<OpenLibraryDoc[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const filteredBooks = useMemo(() => {
    let result = booksData;
    if (activeClass !== 'All') {
      result = result.filter(b => b.classLevel === activeClass);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(lower) || 
        b.subject.toLowerCase().includes(lower) ||
        b.classLevel.toLowerCase().includes(lower)
      );
    }
    return result;
  }, [searchTerm, activeClass]);

  const handleInternetSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internetQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(internetQuery)}&limit=15`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setInternetResults(data.docs || []);
    } catch (err) {
      setSearchError('Failed to fetch books from the internet.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 relative z-10 w-full h-full font-sans text-white overflow-hidden">
      {/* View Mode Toggle */}
      <div className="flex bg-zinc-900/80 rounded-xl p-1 shrink-0 border border-zinc-800">
        <button
          onClick={() => setViewMode('local')}
          className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === 'local' ? 'bg-zinc-800 text-rose-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
        >
          <BookText size={16} /> NCERT PDFs
        </button>
        <button
          onClick={() => setViewMode('internet')}
          className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${viewMode === 'internet' ? 'bg-zinc-800 text-cyan-400 shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
        >
          <Globe size={16} /> World Library
        </button>
      </div>

      {viewMode === 'local' ? (
        <>
          {/* Search Bar */}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search local books, subjects, classes..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all placeholder:text-zinc-600"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto custom-scrollbar shrink-0 pb-1">
            {(['All', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveClass(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeClass === tab 
                    ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Books List */}
          <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-3 custom-scrollbar">
            {filteredBooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                <BookText size={48} className="mb-4 opacity-20" />
                <p>No books found.</p>
              </div>
            ) : (
              filteredBooks.map((book, index) => (
                <motion.div 
                  key={book.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 hover:border-rose-500/30 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                        {book.classLevel}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        book.subject === 'Maths' ? 'bg-indigo-500/20 text-indigo-300' :
                        book.subject === 'Science' ? 'bg-emerald-500/20 text-emerald-300' :
                        book.subject === 'Physics' ? 'bg-amber-500/20 text-amber-300' :
                        book.subject === 'Chemistry' ? 'bg-cyan-500/20 text-cyan-300' :
                        'bg-zinc-700 text-zinc-300'
                      }`}>
                        {book.subject}
                      </span>
                    </div>
                    <h3 className="font-semibold text-rose-100/90 text-sm">{book.name}</h3>
                  </div>
                  <a 
                    href={book.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <span>Read PDF</span>
                    <ExternalLink size={16} />
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          {/* Internet Search */}
          <form onSubmit={handleInternetSearch} className="relative shrink-0 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search world library..." 
                value={internetQuery}
                onChange={e => setInternetQuery(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-cyan-500 text-black px-4 rounded-2xl font-bold active:scale-95 transition-transform disabled:opacity-50"
            >
              Search
            </button>
          </form>

          {/* Internet Results List */}
          <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-3 custom-scrollbar">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center h-48 text-cyan-500">
                <Globe size={48} className="mb-4 opacity-50 animate-pulse" />
                <p className="animate-pulse">Searching the internet...</p>
              </div>
            ) : searchError ? (
              <div className="flex flex-col items-center justify-center h-48 text-red-400">
                <p>{searchError}</p>
              </div>
            ) : internetResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                <Globe size={48} className="mb-4 opacity-20" />
                <p>Enter a query to search the World Library.</p>
              </div>
            ) : (
              internetResults.map((book, index) => (
                <motion.div 
                  key={book.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 hover:border-cyan-500/30 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-cyan-100/90 text-sm line-clamp-2">{book.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {book.author_name?.[0] && (
                        <span className="text-zinc-400 text-xs">
                          by {book.author_name[0]}
                        </span>
                      )}
                      {book.first_publish_year && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">
                          {book.first_publish_year}
                        </span>
                      )}
                    </div>
                  </div>
                  <a 
                    href={`https://openlibrary.org${book.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <span>View Online</span>
                    <ExternalLink size={16} />
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
