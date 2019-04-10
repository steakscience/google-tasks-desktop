import { tasks_v1 } from 'googleapis';
import { TaskList } from '../../typings';

interface TaskListAPIParams {
  tasklist: string;
}

interface AddTaskListAPIParams {
  id: string;
  title: string;
}

interface TaskListApiResponse {
  oid: string;
  id: string;
  data: tasks_v1.Schema$TaskList;
}

export enum TaskListActionTypes {
  GET_ALL_TASK_LIST = 'GET_ALL_TASK_LIST',
  GET_ALL_TASK_LIST_SUCCESS = 'GET_ALL_TASK_LIST_SUCCESS',
  GET_TASK_LIST = 'GET_TASK_LIST',
  GET_TASK_LIST_SUCCESS = 'GET_TASK_LIST_SUCCESS',
  ADD_TASK_LIST = 'ADD_TASK_LIST',
  ADD_TASK_LIST_SUCCESS = 'ADD_TASK_LIST_SUCCESS',
  UPDATE_TASK_LIST = 'UPDATE_TASK_LIST',
  UPDATE_TASK_LIST_SUCCESS = 'UPDATE_TASK_LIST_SUCCESS',
  DELETE_TASK_LIST = 'DELETE_TASK_LIST',
  DELETE_TASK_LIST_SUCCESS = 'DELETE_TASK_LIST_SUCCESS',
  SYNC_TASK_LIST = 'SYNC_TASK_LIST',
  SYNC_TASK_LIST_SUCCESS = 'SYNC_TASK_LIST_SUCCESS'
}

export interface GetAllTaskList {
  type: TaskListActionTypes.GET_ALL_TASK_LIST;
}

export interface GetAllTaskListSuccess {
  type: TaskListActionTypes.GET_ALL_TASK_LIST_SUCCESS;
  payload: Array<[string, TaskList]>;
}

export interface GetTaskList {
  type: TaskListActionTypes.GET_TASK_LIST;
  payload: TaskListAPIParams;
}

export interface GetTaskListSuccess {
  type: TaskListActionTypes.GET_TASK_LIST_SUCCESS;
}

export interface AddTaskList {
  type: TaskListActionTypes.ADD_TASK_LIST;
  payload: AddTaskListAPIParams;
}

export interface AddTaskListSuccess {
  type: TaskListActionTypes.ADD_TASK_LIST_SUCCESS;
  payload: TaskListApiResponse;
}

export interface UpdateTaskList {
  type: TaskListActionTypes.UPDATE_TASK_LIST;
  payload: AddTaskListAPIParams;
}

export interface UpdateTaskListSuccess {
  type: TaskListActionTypes.UPDATE_TASK_LIST_SUCCESS;
}

export interface DeleteTaskList {
  type: TaskListActionTypes.DELETE_TASK_LIST;
  payload: string;
}

export interface DeleteTaskListSuccess {
  type: TaskListActionTypes.DELETE_TASK_LIST_SUCCESS;
}

export interface SyncTaskList {
  type: TaskListActionTypes.SYNC_TASK_LIST;
}

export interface SyncTaskListSuccess {
  type: TaskListActionTypes.SYNC_TASK_LIST_SUCCESS;
  payload: tasks_v1.Schema$TaskList[];
}

export type TaskListActions =
  | GetAllTaskList
  | GetAllTaskListSuccess
  | GetTaskList
  | GetTaskListSuccess
  | AddTaskList
  | AddTaskListSuccess
  | UpdateTaskList
  | UpdateTaskListSuccess
  | DeleteTaskList
  | DeleteTaskListSuccess
  | SyncTaskList
  | SyncTaskListSuccess;

export const TaskListActionCreators = {
  getAllTaskList(): GetAllTaskList {
    return {
      type: TaskListActionTypes.GET_ALL_TASK_LIST
    };
  },
  getTaskList(payload: TaskListAPIParams): GetTaskList | GetAllTaskList {
    return {
      type: TaskListActionTypes.GET_TASK_LIST,
      payload
    };
  },
  addTaskList(payload: AddTaskListAPIParams): AddTaskList {
    return {
      type: TaskListActionTypes.ADD_TASK_LIST,
      payload
    };
  },
  updateTaskList(payload: AddTaskListAPIParams): UpdateTaskList {
    return {
      type: TaskListActionTypes.UPDATE_TASK_LIST,
      payload
    };
  },
  delteTaskList(payload: string): DeleteTaskList {
    return {
      type: TaskListActionTypes.DELETE_TASK_LIST,
      payload
    };
  },
  syncTaskList(): SyncTaskList {
    return {
      type: TaskListActionTypes.SYNC_TASK_LIST
    };
  }
};