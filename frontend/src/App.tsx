import logo from './assets/logo.svg';
import styles from './App.module.scss';
import { ProfileDashboard } from './components/profile-dashboard/profile-dashboard';

function App() {
    return (
        <div className={styles.App}>
          <ProfileDashboard />
        </div>
    );
}

export default App;
