// create a function to trim a long string to a certain number of words, remove any punctuation or spaces from the end and add an ellipsis at the end
//
export const trimString = (str: string, numWords: number) => {
  // split the string into an array of words
  const words = str.split(" ");

  // if the number of words is less than the number of words to trim to, return the string
  if (words.length <= numWords) return str;

  // splice the array to the number of words
  const trimmedWords = words.splice(0, numWords);

  // join the array back into a string
  const trimmedString = trimmedWords.join(" ");

  // remove any punctuation or spaces from the end of the string
  const trimmedStringNoPunctuation = trimmedString.replace(
    /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
    ""
  );

  // return the trimmed string with an ellipsis at the end
  return trimmedStringNoPunctuation + "...";
};
