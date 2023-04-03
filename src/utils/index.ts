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

// a function to get a raw 10 digit phone number from a string
// for use in clickable phone links
export const getRawPhoneNumber = (phoneNumber: string, prefix?:boolean ) => {
  // remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  const output = prefix ? "tel:" + cleaned : cleaned;

  // if the number is less than 10 digits, return null
  if (cleaned.length < 10) return null;

  // if the number is 10 digits, return the number
  if (cleaned.length === 10) return output;

  // if the number is 11 digits and the first digit is 1, return the number
  if (cleaned.length === 11 && cleaned[0] === "1") return output;

  // if the number is 11 digits and the first digit is not 1, return null

  if (cleaned.length === 11 && cleaned[0] !== "1") return null;

  // if the number is more than 11 digits, return null
  if (cleaned.length > 11) return null;

  else return null;

};




export function prettyPhoneNumber(phoneNumber: string | null | undefined) {
  if (!phoneNumber) return null;
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if(!match || !match[1] || !match[2] || !match[3] ) return null;

  const prettyNumber = `(${match[1]}) ${match[2]}-${match[3]}`;
  return prettyNumber

  
}


export const prettyUrl = (website: string, shortUrl?: boolean) => {
  if (shortUrl === undefined) shortUrl = true;
  const url = new URL(website);

  let urlString = "";

  if (shortUrl) {
    urlString = url.hostname;
  } else {
    urlString = url.hostname + url.pathname;
  }

  return urlString.replace(/^www\./, "").replace(/\/$/, "");
};
