import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <>
      <Navbar />
      <div className="board-header">
        <h1 className="board-title">📋 My Project Board</h1>
      </div>
      <KanbanBoard />
    </>
  );
}

export default App;
