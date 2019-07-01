import { connect } from 'react-redux';

import Category from '../pages/category';
import { getCategoriesAsync, addCategoryAsync } from '../redux/action-creators';

export default connect(
  (state) => ({categories: state.categories}),
  { getCategoriesAsync, addCategoryAsync }
)(Category);