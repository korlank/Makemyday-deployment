import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Masonry from "react-masonry-css";
import ProjectListItems from "./ProjectListItem";
import axios from "axios";
import "./ProjectList.css";
import CreateProject from "./createProject/CreateProject";

export default function ProjectList() {
  const [state, setState] = useState({
    users: [],
    projects: []
  });

  useEffect(() => {
    Promise.all([axios.get("/api/users"), axios.get("api/projects")]).then(
      (all) => {
        setState({
          ...state,
          users: all[0].data,
          projects: all[1].data
        });
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleEdit = async (id) => {
    await axios.patch(`http://localhost8080/api/projects/${id}`);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost8080/api/projects/${id}`);
    const newProjects = state.projects.filter((project) => project.id !== id);
    setState({
      ...state,
      projects: newProjects
    });
  };

  const HaveProjectWithUsers = (project, users) => {
    const updatedProject = project.users.map((userId) =>
      users.find((userDetail) => userDetail.id === userId)
    );

    return {
      ...project,
      users: updatedProject
    };
  };

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <Container>
      <CreateProject users={state.users} state={state} setState={setState}/>
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {state.projects.reverse().map((project) => (
          <div key={project.id}>
            <ProjectListItems
              project={HaveProjectWithUsers(project, state.users)}
              users={state.users}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        ))}
      </Masonry>
    </Container>
  );
}