import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_BOARD        = 'community/GET_BOARD';
// eslint-disable-next-line
const actions = createActions({
    // eslint-disable-next-line
    [GET_BOARD]: () => {}
});

/* 리듀서 */
const communityReducer = handleActions({
    [GET_BOARD]: (state, { payload }) => payload
}, initialState);

export default communityReducer;