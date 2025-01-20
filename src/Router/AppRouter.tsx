import { Routes, Route } from 'react-router-dom'; // 올바르게 임포트
import App from '../components/App/App';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import Preview from '../components/Preview/Preview';
import { useLocation, Router } from 'react-router';

const AppRouter = () => {
  const location = useLocation();

  const showHeader = location.pathname !== '/preview';

  // 사용자 정의 컴포넌트 이름 변경
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/preview' element={<Preview />} />
      </Routes>
    </>
  );
};

export default AppRouter;
