import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({
        type: 'FETCH_REQUEST',
      });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: result.data,
        });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: error.message,
        });
      }
    };
    fetchData();
  }, [slug]); // cuando el usuario vaya navegando el dispatch se dispara y obtenemos el nuevo producto desde el backend

  return loading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>{product.name}</div>
  );
}

export default ProductScreen;
