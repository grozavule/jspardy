//verify that the user is logged in
let user = JSON.parse(sessionStorage.getItem('user'));
if(!user)
{
    navigateToHome();
}

let score = document.querySelector('#final-score');
score.textContent = user.gameScore;

let newGameButton = document.querySelector('#new-game-button');
newGameButton.addEventListener('click', e => {
    e.preventDefault();
    window.location.href='/game';
})

let challengeFriendButton = document.querySelector('#challenge-friend');
