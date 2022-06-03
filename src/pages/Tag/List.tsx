import {
  Container, Table, Button, Spinner
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit, FiRefreshCw } from 'react-icons/fi';
import useDispatch from '../../core/redux/useDispatch';
import { getAll, remove } from '../../core/tags/tagSlice';
import Pill from '../../components/Pill';

const TagList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tags = useSelector((x) => x.tags.tags);
  const loading = useSelector((x) => x.tags.loading);
  console.log('TagList', tags, loading);

  const onUpdate = async () => {
    await dispatch(getAll());
  };
  const onRemove = async (id: number) => {
    await dispatch(remove(id));
  };
  const onEdit = async (id: number) => {
    navigate(`/tag/${id}`);
  };

  return (
    <Container style={{ marginTop: 10 }}>
      <h2>Tags</h2>
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

      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: 6 }}>#</th>
            <th style={{ width: 5 }}>Title</th>
            <th style={{ width: 5 }}>BG Color</th>
            <th style={{ width: 5 }}>Text Color</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((x) => {
            return (
              <tr key={x.id}>
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
                  <span style={{ color: '#666', fontSize: 11 }}>ID: {x.id}</span>
                </td>
                <td><Pill name={x.name} bgColor={x.bgColor} textColor={x.textColor} /></td>
                <td>{x.bgColor}</td>
                <td>{x.textColor}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default TagList;
