import React from 'react';
import { useSelector } from 'react-redux';
import { Divider } from '@material-ui/core';
import {
  Menu,
  MenuProps,
  useMuiMenuItem,
  FormDialog,
  ConfirmDialog
} from '../../components/Mui';
import {
  useTaskActions,
  isMasterTaskListSelector,
  RootState,
  useTaskListActions,
  currentTaskListsSelector
} from '../../store';
import { useBoolean } from '../../hooks/useBoolean';

interface Props extends Omit<MenuProps, 'ref'> {}

const menuClasses = { paper: 'task-list-menu-paper' };

function selector(state: RootState) {
  const completedTasks = state.task.completed.ids.length;
  return {
    isMasterTaskList: isMasterTaskListSelector(state),
    totalTasks: completedTasks + state.task.todo.ids.length,
    completedTasks,
    currentTaskList: currentTaskListsSelector(state)
  };
}

export function TaskListMenu({ onClose, ...props }: Props) {
  const MenuItem = useMuiMenuItem({ onClose });
  const taskListActions = useTaskListActions();
  const { deleteAllCompletedTasks } = useTaskActions();
  const {
    isMasterTaskList,
    totalTasks,
    completedTasks,
    currentTaskList
  } = useSelector(selector);

  const { title: currentTaskListTitle, id: currentTaskListId } =
    currentTaskList || {};

  const [
    deleteCompletedTaskDialogOpend,
    openDeleteCompletedTaskDialog,
    closeDeleteCompletedTaskDialog
  ] = useBoolean();

  const [
    deleteTaskListDialogOpend,
    openDeleteTaskListDialog,
    closeDeleteTaskListDialog
  ] = useBoolean();

  const [
    renameTaskDialogOpend,
    openRenameTaskDialog,
    closeRenameTaskDialog
  ] = useBoolean();

  return (
    <>
      <Menu {...props} onClose={onClose} classes={menuClasses}>
        <div className="task-list-menu-title">Sort by</div>
        <MenuItem text="My order" />
        <MenuItem text="Date" />
        <Divider />
        <MenuItem text="Rename list" onClick={openRenameTaskDialog} />
        <MenuItem
          text="Delete list"
          disabled={isMasterTaskList}
          onClick={
            totalTasks === 0
              ? taskListActions.deleteCurrTaskList
              : openDeleteTaskListDialog
          }
        />
        <MenuItem
          text="Delete all completed tasks"
          onClick={openDeleteCompletedTaskDialog}
          disabled={completedTasks === 0}
        />
        <Divider />
        <MenuItem text="Keyboard shortcuts" />
        <MenuItem text="Preferences" />
        <MenuItem text="Logout" />
      </Menu>
      <FormDialog
        title="Rename list"
        errorMsg="Task list name cannot be empty"
        defaultValue={currentTaskListTitle || ''}
        open={renameTaskDialogOpend}
        onClose={closeRenameTaskDialog}
        onConfirm={title =>
          currentTaskListId &&
          taskListActions.updateTaskList({ id: currentTaskListId, title })
        }
      />
      <ConfirmDialog
        title="Delete this list?"
        confirmLabel="Delete"
        open={deleteTaskListDialogOpend}
        onClose={closeDeleteTaskListDialog}
        onConfirm={taskListActions.deleteCurrTaskList}
      >
        Deleting this list will also delete {totalTasks} task.
      </ConfirmDialog>
      <ConfirmDialog
        title="Delete all completed tasks?"
        confirmLabel="Delete"
        open={deleteCompletedTaskDialogOpend}
        onClose={closeDeleteCompletedTaskDialog}
        onConfirm={deleteAllCompletedTasks}
      >
        {completedTasks} completed task will be permanently removed unless it
        repeats.
      </ConfirmDialog>
    </>
  );
}
