document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const container = document.getElementById('movies-container');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    fetch('http://localhost:3000/movies')
      .then(res => res.json())
      .then(movies => {
        const results = movies.filter(movie =>
          movie.title.toLowerCase().includes(query)
        );
        displayMovies(results);
      });
  });

  function displayMovies(movies) {
    container.innerHTML = '';
    movies.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Année: ${movie.year}</p>
        <p>Likes: <span id="likes-${movie.id}">${movie.likes}</span></p>
        <button class="like-btn" data-id="${movie.id}">❤️ Like</button>
      `;
      container.appendChild(card);
    });

    // Événement pour les boutons "Like"
    document.querySelectorAll('.like-btn').forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const likeSpan = document.getElementById(`likes-${id}`);
        const newLikes = parseInt(likeSpan.textContent) + 1;

        fetch(`http://localhost:3000/movies/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes: newLikes })
        })
          .then(res => res.json())
          .then(updatedMovie => {
            likeSpan.textContent = updatedMovie.likes;
          });
      });
    });
  }
});
