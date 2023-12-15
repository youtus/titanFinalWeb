var poolData = {
    UserPoolId : 'eu-west-1_RA59RWZ1A', // Votre User Pool ID
    ClientId : '5peouqfnah1lu5ksnhtcqrdbbi' // Votre App Client ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


function registerUser(email, password) {
    var attributeList = [];
    var dataEmail = {
        Name: 'email',
        Value: email
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('Inscription réussie. Nom d\'utilisateur est:', result.user.getUsername());

        // Connexion automatique après l'inscription
        loginUser(email, password);
    });
}

function loginUser(email, password) {
    var authenticationData = {
        Username: email,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log('Connexion réussie');

            // Redirection vers index.html
            window.location.href = 'index.html';
        },
        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Écouteur d'événement pour le formulaire d'inscription
    var signupForm = document.getElementById('formSignin');
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            registerUser(email, password);
        });
    }

    // Écouteur d'événement pour le formulaire de connexion
    var signinForm = document.getElementById('formSignin');
    if (signinForm) {
        signinForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            loginUser(email, password);
        });
    }
});



window.registerUser = registerUser;
window.loginUser = loginUser;
