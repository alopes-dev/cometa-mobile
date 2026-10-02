require('react-native-reanimated').setUpTests();

// Haptics is a fire-and-forget native side effect every tappable triggers, so
// it is stubbed once here rather than in each suite. Jest's automock would
// return `undefined` and break the `.catch()` call sites use to ignore
// failures; these resolve like the real module does.
jest.mock('expo-haptics', () => require('./src/test-utils/haptics'));
