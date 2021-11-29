import Candidates from './candidates';

const rootElem = document.getElementById('root');

if (rootElem) {
  const candidates = new Candidates();
  candidates.render(rootElem);
}


function handleOptionChange(event) {
  const { parentNode } = event.target;
  parentNode.submit();
}

const optionInputsElements = document.querySelectorAll('.option-input');

optionInputsElements.forEach((elem) => {
  elem.addEventListener('change', handleOptionChange);
});
