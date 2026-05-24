import { Board } from './components/Board/Board';

function App() {
  return (
    <main>
      <h1>Damas Chinas</h1>
      <Board hexSize={20} />
    </main>
  );
}

export default App;
