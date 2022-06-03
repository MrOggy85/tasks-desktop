import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import WithRedux from './core/redux/WithRedux';
import styles from './App.module.css';
import Home from './pages/Home';
import Task from './pages/Task';
import TagList from './pages/Tag/List';
import TagDetail from './pages/Tag/Detail';

const HomeWithRedux = WithRedux(Home);
const TaskWithRedux = WithRedux(Task);
const TagListWithRedux = WithRedux(TagList);
const TagDetailWithRedux = WithRedux(TagDetail);

type LinkItemProps = {
  url: string;
  text: string;
  pathname: string;
};

const LinkItem = ({ url, text, pathname }: LinkItemProps) => {

  return pathname === url ? (
    <p className={styles.active}>{text}</p>
  ) : (
    <Link
      className={`${styles.link} ${pathname === url ? 'active' : ''
        }`}
      to={url}
    >
      {text}
    </Link>
  );
};

function App() {
  const location = useLocation();

  return (
    <>
      <Nav variant="tabs">
        <NavItem>
          <LinkItem url="/" text="Home" pathname={location.pathname} />
        </NavItem>
        <NavItem>
          <LinkItem url="/task/0" text="New Task" pathname={location.pathname} />
        </NavItem>
        <NavItem>
          <LinkItem url="/tag" text="New Tag" pathname={location.pathname} />
        </NavItem>
      </Nav>
      <Routes>
        <Route path="/" element={<HomeWithRedux />} />
        <Route path="/task/:id" element={<TaskWithRedux />} />
        <Route path="/tag" element={<TagListWithRedux />} />
        <Route path="/tag/:id" element={<TagDetailWithRedux />} />

      </Routes>
    </>
  );
}

export default App;
