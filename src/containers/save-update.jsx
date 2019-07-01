import { connect } from 'react-redux';

import SaveUpdate from '../pages/product/save-update';
import { getCategoriesAsync } from '../redux/action-creators';

export default connect(
  (state) => ({categories: state.categories}),
  { getCategoriesAsync }
)(SaveUpdate);