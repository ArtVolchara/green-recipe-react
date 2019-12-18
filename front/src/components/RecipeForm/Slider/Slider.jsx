import React from 'react';
import ItemsCarousel from 'react-items-carousel';
import IngredientCard from './Card';
import { Button, Text } from 'grommet';
import { CaretNext, CaretPrevious } from 'grommet-icons';

import { connect } from 'react-redux';
import { parseFetchAC } from '../../../redux/actions/actions';
import Preloader from '../../Preloader/preloader';

class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfCards: 1,
      activeItemIndex: 0
    };
  }
  async componentDidMount() {
    try {
      const cardWidth = 365;
      const cardHeight = 325;
      const search = this.props.search;
      const data = { search, cardWidth, cardHeight };
      this.props.parseFetch(data);
      const ingredientQuantity = this.props.ingredientsParsed.length;
      if (ingredientQuantity >= 3) {
        this.setState({ numberOfCards: 3 });
      } else {
        this.setState({ numberOfCards: ingredientQuantity });
      }
      // const response = await fetch('http://localhost:5000/api/parses/', {
      //   method: 'POST',
      //   headers: { 'Content-type': 'application/json' },
      //   body: JSON.stringify({ productname: search })
      // });
      // if (response.status === 200) {
      //   const ingredients = await response.json();
      //   this.setState({ children: ingredients.ingredients });
      // } else {
      //   console.log(`ERROR: ${response.status}`);
      // }
    } catch (error) {
      console.log(error);
    }
  }

  async componentDidUpdate(prevProps) {
    try {
      const cardWidth = 365;
      const cardHeight = 325;
      if (
        this.props.search !== prevProps.search ||
        this.props.ingredientsParsed.length !==
        prevProps.ingredientsParsed.length
      ) {
        const search = this.props.search;
        const data = { search, cardWidth, cardHeight };
        this.props.parseFetch(data);
        const ingredientQuantity = this.props.ingredientsParsed.length;
        if (ingredientQuantity >= 3) {
          this.setState({ numberOfCards: 3 });
        } else {
          this.setState({ numberOfCards: ingredientQuantity });
        }
        // const response = await fetch('http://localhost:5000/api/parses/', {
        //   method: 'POST',
        //   headers: { 'Content-type': 'application/json' },
        //   body: JSON.stringify({ productname: search })
        // });
        // if (response.status === 200) {
        //   const ingredients = await response.json();
        //   console.log(ingredients);
        //   this.setState({ children: ingredients.ingredients });
        //   console.log(this.state.children);
        // } else {
        //   console.log(`ERROR: ${response.status}`);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const gutter = 12;
    return (
      this.props.loadingFetch
        ? <Preloader />
        : this.props.parseError
          ? <Text>К сожалению ничего не найдено, попробуйте другой запрос.</Text>
          : (< div style={{
            padding: '0 0',
            maxWidth: `${(this.props.cardWidth * this.state.numberOfCards)}px`,
            margin: '0 auto',
          }}>
            <ItemsCarousel
              infiniteLoop={false}
              gutter={gutter}
              activePosition={'center'}
              chevronWidth={60}
              disableSwipe={false}
              alwaysShowChevrons={false}
              numberOfCards={this.state.numberOfCards}
              slidesToScroll={1}
              outsideChevron
              showSlither={false}
              firstAndLastGutter={false}
              activeItemIndex={this.state.activeItemIndex}
              requestToChangeActive={value =>
                this.setState({ activeItemIndex: value })
              }
              rightChevron={<Button icon={<CaretNext size="medium" />} />}
              leftChevron={<Button icon={<CaretPrevious size="medium" />} />}
            >
              {this.props.ingredientsParsed.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  setSearch={this.props.setSearch}
                  ingredient={ingredient}
                  ingredients={this.props.ingredients}
                  setIngredients={this.props.setIngredients}
                  setCaloriesTotal={this.props.setCaloriesTotal}
                  setPriceTotal={this.props.setPriceTotal}
                  errors={this.props.errors}
                  setError={this.props.setError}
                  cardHeight={this.props.cardHeight}
                  cardWidth={this.props.cardWidth}
                // setOpen={this.props.setOpen}
                // open={this.props.open}
                />
              ))}
            </ItemsCarousel>
          </div>
          )
    )
  }
}
function mapStateToProps(store) {
  return {
    loadingFetch: store.loadingFetch,
    ingredientsParsed: store.ingredientsParsed,
    cardWidth: store.cardWidth,
    cardHeight: store.cardHeight,
    parseError: store.parseError
  }
}
function mapDispatchToProps(dispatch) {
  return {
    parseFetch: data => dispatch(parseFetchAC(data))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Slider);
