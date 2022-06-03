import { ComponentProps, useState } from 'react';
import {
  Button,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { FiTrash2 } from 'react-icons/fi';
import { parseCronExpression } from 'cron-schedule';
import useDispatch from '../../core/redux/useDispatch';
import getPrio from '../../core/getPrio';
import type { RootState } from '../../core/redux/store';
import { add, update } from '../../core/tasks/taskSlice';
import { useNavigate, useParams } from 'react-router-dom';
import getCron from '../../core/getCron';

type Task = RootState['tasks']['tasks'][0];
type CronType = Parameters<typeof getCron>[0];

type InputFieldProps = {
  label: string;
  value: ComponentProps<typeof Input>['value'];
  onChange: (newValue: string) => void;
  displayAfter?: string;
  type: ComponentProps<typeof Input>['type'];
  disabled?: boolean;
  step?: number;
};

const InputField = ({
  label,
  value,
  onChange,
  displayAfter,
  disabled,
  step,
  type,
}: InputFieldProps) => (
  <InputGroup>
    <InputGroupText>{label}</InputGroupText>
    <Input
      step={step}
      disabled={disabled}
      type={type}
      value={value}
      onChange={({ target: { value } }) => {
        onChange(value);
      }}
    />
    {displayAfter && <InputGroupText>{displayAfter}</InputGroupText>}
  </InputGroup>
);

const Task = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const tasks = useSelector((x) => x.tasks.tasks);
  const loading = useSelector((x) => x.tasks.loading);

  const id = Number(params.id);
  const currentTask = id ? tasks.find(x => x.id === id) : undefined;
  const [title, setTitle] = useState(currentTask?.title || '');
  const [description, setDescription] = useState(currentTask?.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(currentTask?.startDate ? new Date(currentTask.startDate) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(currentTask?.endDate ? new Date(currentTask.endDate) : undefined);
  const [priority, setPriority] = useState<Task['priority']>(currentTask?.priority || 0);
  const [priorityDropDownOpen, setPriorityDropDownOpen] = useState(false);

  const [repeat, setRepeat] = useState(currentTask?.repeat || '');
  const [repeatDropDown, setRepeatDropDown] = useState<CronType | undefined>(undefined);
  const [repeatDropDownOpen, setRepeatDropDownOpen] = useState(false);
  const [repeatType, setRepeatType] = useState<Task['repeatType'] | ''>(currentTask?.repeatType || '');
  const [repeatTypeDropDownOpen, setRepeatTypeDropDownOpen] = useState(false);

  const onAdd = async () => {
    const action = await dispatch(add({
      title,
      description,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      priority,
      repeat,
    }));

    if (action.type === add.fulfilled.type) {
      navigate('/');
    } else {
      alert('Something went wrong');
    }
  };

  const onEdit = async () => {
    const action = await dispatch(update({
      id,
      title,
      description,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      priority,
      repeat,
    }));

    if (action.type === update.fulfilled.type) {
      navigate('/');
    } else {
      alert('Something went wrong');
    }
  };

  const nextDate = repeat ? parseCronExpression(repeat).getNextDate(repeatType === 'endDate' ? endDate : undefined) : undefined;

  return (
    <Container style={{ marginTop: 10 }}>

      <h2>{id > 0 ? 'Edit' : 'New'} Task</h2>
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>ID: {id}</p>
      {currentTask?.createdAt && <p style={{ margin: 0, color: '#666', fontSize: 11 }}>createdAt: {currentTask.createdAt}</p>}
      {currentTask?.updatedAt && <p style={{ margin: 0, color: '#666', fontSize: 11 }}>updatedAt: {currentTask.updatedAt}</p>}
      <InputField
        label="Title"
        value={title}
        onChange={setTitle}
        type="text"
      />
      <InputField
        label="Description"
        value={description}
        onChange={setDescription}
        type="textarea"
      />

      <InputGroup className="mb-3 mt-3">
        <InputField
          label="Start Date"
          value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          onChange={(newValue) => {
            if (!newValue) {
              return;
            }
            const now = new Date();
            const year = Number(newValue.split('-')[0]) || now.getFullYear();
            const month = Number(newValue.split('-')[1]) || now.getMonth();
            const date = Number(newValue.split('-')[2]) || now.getDate();
            const hour = startDate?.getHours() !== undefined ? startDate.getHours() : now.getHours();
            const minute = startDate?.getMinutes() !== undefined ? startDate.getMinutes() : now.getMinutes();
            setStartDate(new Date(year, month, date, hour, minute));
          }}
          type="date"
        />
        <InputField
          label="Start Time"
          value={startDate ? format(startDate, 'HH:mm') : ''}
          onChange={(newValue) => {
            if (!newValue) {
              return;
            }
            const now = new Date();
            const year = startDate?.getFullYear() || now.getFullYear();
            const month = startDate?.getMonth() || now.getMonth();
            const date = startDate?.getDate() || now.getDate();
            const hour = Number(newValue.split(':')[0]);
            const minute = Number(newValue.split(':')[1]);
            setStartDate(new Date(year, month, date, hour, minute));
          }}
          type="time"
        />
        <Button
          color="danger"
          type="button"
          onClick={() => {
            setStartDate(undefined);
          }}
        >
          <FiTrash2 />
        </Button>
      </InputGroup>

      <InputGroup className="mb-3 mt-3">
        <InputField
          label="End Date"
          value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          onChange={(newValue) => {
            if (!newValue) {
              return;
            }
            const now = new Date();
            const year = Number(newValue.split('-')[0]) || now.getFullYear();
            const month = Number(newValue.split('-')[1]) - 1 || now.getMonth();
            const date = Number(newValue.split('-')[2]) || now.getDate();
            const hour = endDate?.getHours() !== undefined ? endDate.getHours() : now.getHours();
            const minute = endDate?.getMinutes() !== undefined ? endDate.getMinutes() : now.getMinutes();
            setEndDate(new Date(year, month, date, hour, minute));
          }}
          type="date"
        />
        <InputField
          label="End Time"
          value={endDate ? format(endDate, 'HH:mm') : ''}
          onChange={(newValue) => {
            if (!newValue) {
              return;
            }
            const now = new Date();
            const year = endDate?.getFullYear() || now.getFullYear();
            const month = endDate?.getMonth() || now.getMonth();
            const date = endDate?.getDate() || now.getDate();
            const hour = Number(newValue.split(':')[0]);
            const minute = Number(newValue.split(':')[1]);
            setEndDate(new Date(year, month, date, hour, minute));
          }}
          type="time"
        />
        <Button
          color="danger"
          type="button"
          onClick={() => {
            setEndDate(undefined);
          }}
        >
          <FiTrash2 />
        </Button>
      </InputGroup>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroupText>Priority</InputGroupText>
        <ButtonDropdown
          isOpen={priorityDropDownOpen}
          toggle={() => {
            setPriorityDropDownOpen(!priorityDropDownOpen);
          }}
        >
          <DropdownToggle caret color={getPrio(priority).bg}>
            {getPrio(priority).content}
          </DropdownToggle>
          <DropdownMenu>
            {([1, 2, 3, 4] as Task['priority'][]).map((x) => (
              <DropdownItem
                key={x}
                onClick={() => {
                  setPriority(x);
                }}
              >
                {getPrio(x).content}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </InputGroup>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroupText>Repeat</InputGroupText>
        <ButtonDropdown
          isOpen={repeatDropDownOpen}
          toggle={() => {
            setRepeatDropDownOpen(!repeatDropDownOpen);
          }}
        >
          <DropdownToggle caret color="light">
            {repeatDropDown || 'none'}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                setRepeatDropDown(undefined);
                setRepeat('');
              }}
            >
              None
            </DropdownItem>
            {(['weekly', 'monthly', 'yearly'] as CronType[]).map((x) => (
              <DropdownItem
                key={x}
                onClick={() => {
                  setRepeatDropDown(x);
                  setRepeat(getCron(x, endDate, repeatType || 'completionDate'));
                }}
              >
                {x}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </InputGroup>

      <InputField
        label="Repeat CRON pattern"
        value={repeat}
        onChange={setRepeat}
        type="text"
      />
      <p style={{ margin: 0, color: '#666', fontSize: 11 }}>{nextDate ? `Next Date: ${nextDate.toISOString()} UTC - ${nextDate.toLocaleString()} JST` : ''}</p>

      <InputGroup style={{ marginBottom: 5 }}>
        <InputGroupText>RepeatType</InputGroupText>
        <ButtonDropdown
          isOpen={repeatTypeDropDownOpen}
          toggle={() => {
            setRepeatTypeDropDownOpen(!repeatTypeDropDownOpen);
          }}
        >
          <DropdownToggle caret color={getPrio(priority).bg}>
            {repeatType}
          </DropdownToggle>
          <DropdownMenu>
            {(['completionDate', 'endDate'] as Task['repeatType'][]).map((x) => (
              <DropdownItem
                key={x}
                onClick={() => {
                  setRepeatType(x);
                }}
              >
                {x}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
      </InputGroup>

      <InputGroup className="mb-3 mt-3">
        <Button
          disabled={loading}
          color={id ? 'success' : 'primary'}
          type="button"
          onClick={() => {
            if (id) {
              onEdit();
            } else {
              onAdd();
            }

          }}
        >
          {loading ? <Spinner size="sm" /> : id ? 'UPDATE' : 'ADD'}
        </Button>

      </InputGroup>
    </Container>
  );
};

export default Task;
