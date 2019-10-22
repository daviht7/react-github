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
    loading: false,
    error: null
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

    this.setState({ loading: true,error: false });
    try {
    const { newRepo, repositories } = this.state;

    const hasRepo = repositories.find(r => r.name === newRepo);

      if (hasRepo) throw 'Repositório duplicado';

    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: "",
    });
    
  } catch (error) {
    this.setState({ error: true });
  } finally {
    this.setState({ loading: false });
  }
  };

  render() {
    const { newRepo, loading, repositories,error  } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
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
