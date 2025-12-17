import { HomePage } from './presentation/components/Home/HomePage';
import {
  getTotalSavingsUseCase,
  getMonthlySavingsUseCase,
  saveRamenResistanceUseCase,
} from './application/di/container';

function App() {
  return (
    <HomePage
      getTotalSavingsUseCase={getTotalSavingsUseCase}
      getMonthlySavingsUseCase={getMonthlySavingsUseCase}
      saveRamenResistanceUseCase={saveRamenResistanceUseCase}
    />
  );
}

export default App;
