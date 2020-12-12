const btnSearch = document.querySelector('#js-search_btn')
const mainGrid = document.querySelector('#js-main_grid')

btnSearch.addEventListener('click', getRepo)

function getRepo() {
  mainGrid.innerHTML = ''
  const userName = document.querySelector('#js-search_input').value

  if (userName == '') {
    return alert('Digite um nome de usuario')
  }

  document.querySelector('#js-main_title').innerText = `Repositórios de: ${userName}`

  fetch(`https://api.github.com/users/${userName}/repos`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      for (const repo of data ) {
        mainGrid.innerHTML += createLayout(repo)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function createLayout(repo) {
  return `
  <div class="main__card">
    <h2 class="card__name">${repo.name}</h2>
    <p class="card__description">${repo.description}</p>
    <div class="card__container">
      <div class="card__languages">
      <span class="card__language">${repo.language}</span>
      </div>
        <div class="card__btn">
        <a href="${repo.html_url}" class="btn" target="_blank">Acessar</a>

        <div class="card__stars">
          <span class="card__star">${repo.stargazers_count}</span>
          <img 
            src="./images/star-icon.svg" 
            alt="Numero de estrelas"
            class="card__icon"
          />
        </div>
      </div>
    </div>
  </div>
  `
}