// database context

import React, { createContext, useContext, useState, useEffect } from 'react';

const DataBaseContext = createContext();



export const useDataBaseContext = () => {
    return useContext(DataBaseContext);
    }

export const DataBaseProvider = ({ children }) => {

    const [taskLoaded, setTaskLoaded] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projects, setProjects] = useState(['project1', 'project2', 'project3']);

    const handleCreateProject = (project) => {
        handleCreateProject(project);
    }

    const handleUpdateColumns = (newColumns) => {
        handleUpdateColumns(newColumns);
    }

    const handleUpdateProject = (project) => {
        handleUpdateProject(project);
    }

    const handleDeleteProject = (projectId) => {
        handleDeleteProject(projectId);
    }

    const handleCreateTask = (task) => {
        handleCreateTask(task);
    }

    const handleUpdateTask = (task) => {
        handleUpdateTask(task);
    }

    const handleDeleteTask = (taskId) => {
        handleDeleteTask(taskId);
    }

    const handleCreateColumn = (column) => {
        handleCreateColumn(column);
    }

    const handleUpdateColumn = (column) => {
        handleUpdateColumn(column);
    }

    const handleDeleteColumn = (columnId) => {
        handleDeleteColumn(columnId);
    }

    const handleCreateUser = (user) => {
        handleCreateUser(user);
    }

    const handleUpdateUser = (user) => {
        handleUpdateUser(user);
    }
    return (
        <DataBaseContext.Provider
            value={{
                setTaskLoaded,
                setSelectedProjectId,
                handleCreateProject,
                handleUpdateColumns,
                handleUpdateProject,
                handleDeleteProject,
                handleCreateTask,
                handleUpdateTask,
                handleDeleteTask,
                handleCreateColumn,
                handleUpdateColumn,
                handleDeleteColumn,
                handleCreateUser,
                handleUpdateUser,
                taskLoaded,
                selectedProjectId,
                projects
            }}
        >
            {children}
        </DataBaseContext.Provider>
    );

}