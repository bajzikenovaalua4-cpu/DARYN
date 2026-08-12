import { Route, Switch } from 'wouter';
import { AuthSessionRedirect } from './components/AuthSessionRedirect';
import { AnalyzePage } from './pages/AnalyzePage';
import { AuthPage } from './pages/AuthPage';
import { GamePage } from './pages/GamePage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResultPage } from './pages/ResultPage';

export default function App() {
  return (
    <>
      <AuthSessionRedirect />
      <Switch>
        <Route path="/" component={RegisterPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/game" component={GamePage} />
        <Route path="/analyze" component={AnalyzePage} />
        <Route path="/result/:id" component={ResultPage} />
        <Route path="/history" component={HistoryPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}

