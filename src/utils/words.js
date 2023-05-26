import randomWords from 'random-words'
const no_of_words = 100;

export const generate = () => {
  return new Array(no_of_words)
    .fill(null)
    .map(() => randomWords());
};
