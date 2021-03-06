import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '../../../components/Mui';
import { useTaskActions, taskSelector } from '../../../store';
import { Schema$Task } from '../../../typings';
import CircleIcon from '@material-ui/icons/RadioButtonUnchecked';
import TickIcon from '@material-ui/icons/Check';

interface Props extends Pick<Schema$Task, 'uuid'> {
  isEmpty: boolean;
}

const MarkCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark incomplete">
    <CircleIcon />
  </IconButton>
));

const MarkInCompleteButton = React.memo(() => (
  <IconButton tooltip="Mark complete">
    <TickIcon className="mui-tick-icon" />
  </IconButton>
));

export function ToggleCompleted({ uuid, isEmpty }: Props) {
  const { updateTask, deleteTask } = useTaskActions();
  const { status, hidden } = useSelector(taskSelector(uuid)) || {};
  const isCompleted = hidden || status === 'completed';

  return (
    <div
      className="toggle-completed"
      onClick={() =>
        isEmpty
          ? deleteTask({ uuid })
          : updateTask({
              uuid,
              hidden: !isCompleted,
              status: isCompleted ? 'needsAction' : 'completed'
            })
      }
    >
      {!isCompleted && <MarkCompleteButton />}
      <MarkInCompleteButton />
    </div>
  );
}
