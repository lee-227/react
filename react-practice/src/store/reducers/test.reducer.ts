export default function testReducer(state = 0, action: any) {
  switch (action.type) {
    case 0:
      return 0;
    default:
      return state;
  }
}
