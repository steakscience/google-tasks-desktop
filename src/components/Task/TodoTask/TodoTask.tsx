import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  KeyboardEvent,
  MouseEvent
} from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect, Omit } from 'react-redux';
import { Task } from '../Task';
import { TodoTaskMenu } from './TodoTaskMenu';
import { classes } from '../../../utils/classes';
import { useBoolean } from '../../../utils/useBoolean';
import { useMouseTrap } from '../../../utils/useMouseTrap';
import {
  RootState,
  TaskActionCreators,
  getTodoTasksOrder
} from '../../../store';
import { Schema$Task } from '../../../typings';
import { useMuiMenu } from '../../Mui';
import DateTimeDialog from './DateTimeDialog';

export interface TodoTaskProps extends Pick<Schema$Task, 'uuid'> {
  className?: string;
}

const mapStateToProps = (state: RootState, ownProps: TodoTaskProps) => {
  const todoTasks = getTodoTasksOrder(state);
  const index = todoTasks.indexOf(ownProps.uuid);

  return {
    task: state.task.byIds[ownProps.uuid],
    focused:
      state.task.focused === ownProps.uuid || state.task.focused === index,
    prevTask: todoTasks[Math.max(0, index - 1)],
    nextTask: todoTasks[Math.min(todoTasks.length, index + 1)],
    sortByDate: state.taskList.sortByDate
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(TaskActionCreators, dispatch);

const disableMouseDown = (evt: MouseEvent<HTMLElement>) =>
  !(evt.target instanceof HTMLTextAreaElement) && evt.preventDefault();

export function TodoTaskComponent({
  className,
  task,
  focused,
  setFocused,
  prevTask,
  nextTask,
  newTask,
  moveTask,
  deleteTask,
  updateTask,
  sortByDate
}: ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  TodoTaskProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { anchorPosition, setAnchorPosition, onClose } = useMuiMenu();
  const [dateTimeDialogOpened, dateTimeDialog] = useBoolean();
  const [, taskListDropdown] = useBoolean();

  const [onFocus, onBlur] = useMemo(
    () => [
      () => !focused && setFocused(task.uuid),
      () => focused && setFocused(null)
    ],
    [focused, setFocused, task.uuid]
  );

  const newTaskCallback = useCallback(() => {
    newTask({
      prevUUID: task.uuid,
      due: sortByDate ? task.due : undefined
    });
    return false;
  }, [newTask, task.uuid, task.due, sortByDate]);

  const deleteTaskCallback = useCallback(
    (args?: Omit<Parameters<typeof deleteTask>[0], 'id' | 'uuid'>) => {
      deleteTask({ id: task.id, uuid: task.uuid, ...args });
    },
    [deleteTask, task.id, task.uuid]
  );

  const updateTaskCallback = useCallback(
    (args: Omit<Parameters<typeof updateTask>[0], 'id' | 'uuid'>) => {
      updateTask({ id: task.id, uuid: task.uuid, ...args });
    },
    [task.id, task.uuid, updateTask]
  );

  const onDueDateChangeCallback = useCallback(
    (date: Date) =>
      updateTaskCallback({
        due: date.toISOString()
      }),
    [updateTaskCallback]
  );

  const [focusPrevTask, focusNextTask] = useMemo(() => {
    const handler = (type: 'start' | 'end', uuid?: string) => () => {
      const input = inputRef.current;
      if (input && uuid && uuid !== task.uuid) {
        const { selectionStart, selectionEnd, value } = input;
        const notHightlighted = selectionStart === selectionEnd;
        const shouldFocusPrev = type === 'start' && selectionStart === 0;
        const shouldFocusNext =
          type === 'end' && selectionStart === value.length;

        if (notHightlighted && (shouldFocusPrev || shouldFocusNext)) {
          setFocused(uuid);
        }
      }
    };

    return [handler('start', prevTask), handler('end', nextTask)];
  }, [prevTask, nextTask, setFocused, task.uuid]);

  const [moveTaskUp, moveTaskDown] = useMemo(() => {
    const handler = (prevUUID: Schema$Task['uuid'], step: number) => () => {
      if (prevUUID) {
        if (sortByDate) {
          const canMoveUp = !task.due || new Date(task.due).dayDiff() < 0;
          const canMoveDown = !!task.due;
          if ((step === -1 && canMoveUp) || (step === 1 && canMoveDown)) {
            moveTask({ uuid: task.uuid, prevUUID, step });
          }
        } else if (prevUUID !== task.uuid) {
          moveTask({ uuid: task.uuid, prevUUID });
        }
        return false;
      }
    };

    return [handler(prevTask, -1), handler(nextTask, 1)];
  }, [moveTask, prevTask, nextTask, sortByDate, task.uuid, task.due]);

  const onKeydownCallback = useCallback(
    (evt: KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Backspace' && !evt.currentTarget.value.trim()) {
        deleteTaskCallback({ prevUUID: prevTask });
      }

      if (evt.key === 'Escape') {
        evt.currentTarget.blur();
      }
    },
    [deleteTaskCallback, prevTask]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input && focused) {
      if (document.activeElement !== input) {
        setTimeout(() => {
          const { length } = input.value;

          input.focus();
          // make sure cursor place at end of textarea
          input.setSelectionRange(length, length);
        }, 0);
      }
    }
  }, [focused]);

  useMouseTrap(inputRef, 'enter', newTaskCallback);
  useMouseTrap(inputRef, 'up', focusPrevTask);
  useMouseTrap(inputRef, 'down', focusNextTask);
  // useMouseTrap(inputRef, 'shift+enter', console.log);
  useMouseTrap(inputRef, 'option+up', moveTaskUp);
  useMouseTrap(inputRef, 'option+down', moveTaskDown);

  return (
    <>
      <Task
        className={classes(`todo-task`, focused && 'focused', className)}
        uuid={task.uuid}
        title={task.title}
        notes={task.notes}
        due={sortByDate ? undefined : task.due}
        inputRef={inputRef}
        onClick={onFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseDown={disableMouseDown}
        onKeyDown={onKeydownCallback}
        onContextMenu={setAnchorPosition}
        onDueDateBtnClick={dateTimeDialog.on}
      />
      <TodoTaskMenu
        anchorPosition={anchorPosition}
        anchorReference="anchorPosition"
        due={task.due}
        open={!!anchorPosition}
        onClose={onClose}
        onDelete={deleteTaskCallback}
        openDateTimeDialog={dateTimeDialog.on}
        openTaskListDropdown={taskListDropdown.on}
      />
      <DateTimeDialog
        confirmLabel="OK"
        date={task.due ? new Date(task.due) : new Date()}
        open={dateTimeDialogOpened}
        onClose={dateTimeDialog.off}
        onConfirm={onDueDateChangeCallback}
      />
    </>
  );
}

export const TodoTask = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoTaskComponent);
