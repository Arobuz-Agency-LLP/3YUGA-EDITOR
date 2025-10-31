import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, FileText, Copy, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useEditor } from '../../contexts/EditorContext.tsx';

const BoardTabs = () => {
  const { boards, activeBoard, createBoard, switchBoard, closeBoard, duplicateBoard } = useEditor();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {boards.map((board) => (
          <motion.div
            key={board.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors group ${
              activeBoard === board.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <button
              onClick={() => switchBoard(board.id)}
              className="flex items-center gap-2 min-w-0"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="truncate max-w-24">{board.name}</span>
            </button>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <DropdownMenu open={openDropdown === board.id} onOpenChange={(open) => setOpenDropdown(open ? board.id : null)}>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="hover:bg-slate-200 dark:hover:bg-slate-600 rounded p-0.5 transition-all"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateBoard(board.id);
                      setOpenDropdown(null);
                    }}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </DropdownMenuItem>
                  {boards.length > 1 && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        closeBoard(board.id);
                        setOpenDropdown(null);
                      }}
                      className="gap-2 text-red-600 focus:text-red-600"
                    >
                      <X className="w-4 h-4" />
                      Close
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button
        onClick={createBoard}
        variant="ghost"
        size="sm"
        className="flex-shrink-0 h-8 w-8 p-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default BoardTabs;