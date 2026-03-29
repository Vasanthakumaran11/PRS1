import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, MessageCircle, AlertTriangle } from 'lucide-react';
import QueriesModal from './QueriesModal';
import GuideModal from './GuideModal';

const HelpDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'query' });
  const [guideOpen, setGuideOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openModal = (type) => {
    setIsOpen(false);
    setModalState({ isOpen: true, type });
  };

  const showGuide = () => {
    setIsOpen(false);
    setGuideOpen(true);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center font-bold px-3 py-2 transition-colors rounded ${isOpen ? 'bg-black/10 text-white' : 'text-[#004b36] hover:text-white'}`}
        >
          <span>Help</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
            <button 
              onClick={showGuide}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-[#8cc63f] flex items-center transition-colors font-medium"
            >
              <BookOpen className="w-4 h-4 mr-3 text-[#8cc63f]" />
              Tutorial Guide
            </button>
            <button 
              onClick={() => openModal('query')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-[#8cc63f] flex items-center transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4 mr-3 text-[#004b36]" />
              Submit Query
            </button>
            <div className="my-1 border-t border-gray-100 dark:border-gray-700"></div>
            <button 
              onClick={() => openModal('issue')}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors font-medium"
            >
              <AlertTriangle className="w-4 h-4 mr-3" />
              Report Bug
            </button>
          </div>
        )}
      </div>

      <QueriesModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
        defaultType={modalState.type}
      />
      <GuideModal 
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </>
  );
};

export default HelpDropdown;
