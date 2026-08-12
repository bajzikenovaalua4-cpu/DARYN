import { Route, Switch } from 'wouter';
import { AnalyzePage } from './pages/AnalyzePage';
import { GamePage } from './pages/GamePage';
import { HistoryPage } from './pages/HistoryPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ResultPage } from './pages/ResultPage';

export default function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/game" component={GamePage} />
      <Route path="/analyze" component={AnalyzePage} />
      <Route path="/result/:id" component={ResultPage} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

