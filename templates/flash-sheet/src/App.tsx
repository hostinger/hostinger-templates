import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DesignPage } from './pages/DesignPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flash/:id" element={<DesignPage />} />
      </Routes>
    </BrowserRouter>
  );
}
