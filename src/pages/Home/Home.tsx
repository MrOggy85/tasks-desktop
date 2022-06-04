import { useState } from 'react';
import {
  Container, Table, Button, Spinner, InputGroup,
  InputGroupText, DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import { FiTrash2, FiEdit, FiCheckSquare, FiSquare, FiRepeat, FiRefreshCw } from 'react-icons/fi';
import format from 'date-fns/format';
import isAfter from 'date-fns/isAfter';
import getPrio from '../../core/getPrio';
import useDispatch from '../../core/redux/useDispatch';
import { getAll, remove, done, unDone } from '../../core/tasks/taskSlice';
import Pill from '../../components/Pill';

type Sorting = 'createdDate' | 'updatedDate' | 'title' | 'startDate' | 'endDate' | 'priority';

function sortDate(aDate: string | undefined, bDate: string | undefined, sortOrder: 'asc' | 'desc') {
  const aD = sortOrder === 'asc' ? aDate : bDate;
  const bD = sortOrder === 'asc' ? bDate : aDate;
  if (!aD && !bD) {
    return 0;
  }
  if (!aD) {
    return sortOrder === 'asc' ? 1 : -1;
  }
  if (!bD) {
    return sortOrder === 'asc' ? -1 : 1;
  }
  return new Date(aD).getTime() - new Date(bD).getTime();
}

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rawTasks = useSelector((x) => x.tasks.tasks);
  const loading = useSelector((x) => x.tasks.loading);

  const [sorting, setSorting] = useState<Sorting>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSortingDropDownOpen, setIsSortingDropDownOpen] = useState(false);
  const [isSortOrderDropDownOpen, setIsSortOrderDropDownOpen] = useState(false);

  const tasks = rawTasks.filter(x => {
    if (x.completionDate && x.repeat) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (sorting) {
      case 'startDate':
        return sortDate(a.startDate, b.startDate, sortOrder);
      case 'endDate':
        return sortDate(a.endDate, b.endDate, sortOrder);
      case 'updatedDate':
        return sortDate(a.updatedAt, b.updatedAt, sortOrder);

      case 'priority':
        return sortOrder === 'asc' ? a.priority - b.priority : b.priority - a.priority;

      case 'title':
        return sortOrder === 'asc' ? a.title.charCodeAt(0) - b.title.charCodeAt(0) : b.title.charCodeAt(0) - a.title.charCodeAt(0);

      case 'createdDate':
      default:
        return sortDate(a.createdAt, b.createdAt, sortOrder);
    }
  });

  const onUpdate = async () => {
    await dispatch(getAll());
  };
  const onRemove = async (id: number) => {
    await dispatch(remove(id));
  };
  const onEdit = async (id: number) => {
    navigate(`/task/${id}`);
  };
  const onDone = async (id: number) => {
    await dispatch(done(id));
  };
  const onUnDone = async (id: number) => {
    await dispatch(unDone(id));
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <h2>Tasks</h2>
      <Button
        style={{ marginBottom: 4 }}
        color="primary"
        type="button"
        disabled={loading}
        onClick={() => {
          onUpdate();
        }}
      >
        {loading ? <Spinner size="sm" /> : <FiRefreshCw />}
      </Button>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroupText>Sorting</InputGroupText>
        <ButtonDropdown
          isOpen={isSortingDropDownOpen}
          toggle={() => {
            setIsSortingDropDownOpen(!isSortingDropDownOpen);
          }}
        >
          <DropdownToggle caret color="primary">
            {sorting}
          </DropdownToggle>
          <DropdownMenu>
            {(['createdDate', 'updatedDate', 'title', 'startDate', 'endDate', 'priority'] as Sorting[]).map((x) => (
              <DropdownItem
                key={x}
                onClick={() => {
                  setSorting(x);
                }}
              >
                {x}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
        <InputGroupText>Order</InputGroupText>
        <ButtonDropdown
          isOpen={isSortOrderDropDownOpen}
          toggle={() => {
            setIsSortOrderDropDownOpen(!isSortOrderDropDownOpen);
          }}
        >
          <DropdownToggle caret color="primary">
            {sortOrder}
          </DropdownToggle>
          <DropdownMenu>
            {(['asc', 'desc'] as ('asc' | 'desc')[]).map((x) => (
              <DropdownItem
                key={x}
                onClick={() => {
                  setSortOrder(x);
                }}
              >
                {x}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </InputGroup>

      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 6 }}>#</th>
            <th style={{ width: 5 }}>Title</th>
            <th style={{ width: 5 }}>Start</th>
            <th style={{ width: 5 }}>End</th>
            <th style={{ width: 5 }}></th>

          </tr>
        </thead>
        <tbody>
          {tasks.map((x) => {
            const prio = getPrio(x.priority);
            const notStarted = x.startDate ? isAfter(new Date(x.startDate), new Date()) : false;

            return (
              <tr key={x.id} style={{ opacity: notStarted ? 0.5 : 1 }}>
                <td>
                  <Button
                    style={{ marginRight: 4 }}
                    color="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onRemove(x.id);
                    }}
                  >
                    <FiTrash2 />
                  </Button>
                  <Button
                    style={{ marginRight: 4 }}
                    color="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      onEdit(x.id);
                    }}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    style={{ marginRight: 4 }}
                    color="light"
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (x.completionDate) {
                        onUnDone(x.id);
                      } else {
                        onDone(x.id);
                      }
                    }}
                  >
                    {x.repeat ? <FiRepeat /> : x.completionDate ? <FiCheckSquare /> : <FiSquare />}
                  </Button>
                  <span style={{ color: '#666', fontSize: 11 }}>ID: {x.id}</span>
                </td>
                <td>{x.title}</td>
                <td>{x.startDate ? format(new Date(x.startDate), 'yyyy-MM-dd HH:mm') : 'None'}</td>
                <td>{x.endDate ? format(new Date(x.endDate), 'yyyy-MM-dd HH:mm') : 'None'}</td>
                <td>
                  <Badge text={prio.text} bg={prio.bg}>{prio.content}</Badge>
                  {x.repeat ? <Badge style={{ marginLeft: 4 }} bg="success"><FiRepeat /></Badge> : ''}
                  {x.tags.map(t => <div key={t.id} style={{ marginLeft: 4, display: 'inline-block' }}><Pill name={t.name} bgColor={t.bgColor} textColor={t.textColor} /></div>)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Home;
