import React from 'react';
import { EditorProvider } from '../../contexts/EditorContext.tsx';
import Navbar from './Navbar';
import BoardTabs from './BoardTabs';
import LeftSidebar from './LeftSidebar';
import Canvas from './Canvas';
import RightSidebar from './RightSidebar';
import { QuickStartGuide } from '../ui/quick-start';

const Editor = () => {
  return (
    <EditorProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <BoardTabs />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
        <QuickStartGuide />
      </div>
    </EditorProvider>
  );
};

export default Editor;
