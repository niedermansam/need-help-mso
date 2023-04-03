// q: how dow I create a loading spinner component in react with typescript and tailwindcss?
// a:   import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";



export function LoadingSpinner() {
  return (
      <div className="ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
  );
}
