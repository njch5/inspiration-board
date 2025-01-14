import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      error: '',
    };
  }

  componentDidMount() {
    axios.get(`${this.props.url}/${this.props.boardName}/cards`)
      .then((response) => {
        const newCards = response.data.map((c) => {
          return {
            text: c.card.text,
            emoji: c.card.emoji,
            id: c.card.id,
          }
        })
        this.setState({ cards: newCards });
      })
      .catch((error => {
        this.setState({ error: error.message });
      }));
  }

  addCard = (card) => {
    axios.post(`${this.props.url}/${this.props.boardName}/cards`, card)
      .then((response) => {
        const newCardList = this.state.cards
        newCardList.push(response.data.card)

        this.setState({
          cards: newCardList
        })
      })
      .catch((error) => {
        this.setState({ error: error.message })
      })
  }

  deleteCard = (cardId) => {

    axios.delete(`https://inspiration-board.herokuapp.com/cards/${cardId}`)
      .then((response) => {
        console.log(`${cardId} THIS IS THE ID!!!!!!`);
        // console.log(this.state.cards);
        const cardList = this.state.cards.filter((cardInfo) => cardInfo.id !== cardId);
        console.log(this.state.cards);
        // console.log('cardlist', cardList);

        this.setState({
          cards: cardList,
        });
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  };

  render() {
    const cards = this.state.cards.map((card, i) => {
      return (
        <Card 
          key={i}
          id={card.id}
          text={card.text}
          emoji={card.emoji}
          deleteCard={this.deleteCard} />
      );
    });
    return (
      <section>
        <div className=".validation-errors-display__list">
          {this.state.errors}
        </div>

        <div className="board">
          { cards }
          <NewCardForm addCardCallback={this.addCard} />
        </div>
      </section>
    )
  }

}

Board.propTypes = {
  url: PropTypes.string.isRequired,
  boardName: PropTypes.string,
};

export default Board;
