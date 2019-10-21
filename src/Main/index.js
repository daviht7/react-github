import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import { Form, SubmitButton, List } from "./styles";
import Container from "../components/Container";
import { Link } from "react-router-dom";

import api from "../services/api";

export default class Main extends Component {
  state = {
    newRepo: "",
    repositories: [],
    loading: false
  };

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  componentDidMount() {
    const repositories = localStorage.getItem("repositores");
    console.log(repositories);

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem(
        "repositores",
        JSON.stringify(this.state.repositories)
      );
    }
  }

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: "",
      loading: false
    });

    console.log(this.state.repositories);
  };

  render() {
    const { newRepo, loading, repositories } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            value={newRepo}
            onChange={this.handleInputChange}
            type="text"
            placeholder="Adicionar repositório"
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14}></FaPlus>
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repo => (
            <li key={repo.name}>
              <span>{repo.name}</span>
              <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
