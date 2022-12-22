//verify that the user is logged in
let user = sessionStorage.getItem('user');
if(!user)
{
    navigateToHome();
}

