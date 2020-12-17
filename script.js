let repos =[]

const html = {
  get(element) {
    return document.querySelector(element)
  }
}

const repoPerPage = 6

let state = {
  page: 1,
  repoPerPage,
  totalPages: 0
}

const controls = {
  next() {
    state.page++

    if(state.page > state.totalPages) {
      state.page--
    }
  },
  prev() {
    state.page--

    if(state.page < 1) {
      state.page++
    }
  },
  createListeners() {
    html.get('#js-next').addEventListener('click', () => {
      controls.next()
      pageRepos.update()
    }),
    html.get('#js-prev').addEventListener('click', () => {
      controls.prev()
      pageRepos.update()
    })
  }
}

const pageRepos = {
  create(repo){
    const layout = `
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

    html.get('#js-main_grid').innerHTML += layout
  },
  update(){
    html.get('#js-main_grid').innerHTML = ""

    let page = state.page - 1
    let start = page * state.repoPerPage
    let end = start + state.repoPerPage

    const paginatedRepos = repos.slice(start, end)

    for (repo of paginatedRepos) {
      pageRepos.create(repo)
    }
  }
}

function init() {
  const name = html.get('#js-search_input').value

  if (name == '') {
    return alert('Digite um nome de usuario!')
  }

  state.page = 1
  repos = []
  getRepo(name)
  controls.createListeners()
  html.get('#js-main_title').innerText = `Repositorios de ${name}`
}

function getRepo(userName) {
  fetch(`https://api.github.com/users/${userName}/repos`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      for (const repo of data ) {
        repos.push(repo)
      }

      state.totalPages = Math.ceil(repos.length / repoPerPage)
      pageRepos.update()
      html.get('.main__controls').classList.add('on')
      
    })
    .catch((err) => {
      console.log(err)
    })
}

html.get('#js-search_btn').addEventListener('click', init)
html.get('#js-search_input').addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
      init()
    }
})