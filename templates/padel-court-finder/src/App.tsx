import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ClubPage } from './pages/ClubPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { ListClubPage } from './pages/ListClubPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="clubs/:id" element={<ClubPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="list-your-club" element={<ListClubPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
