$.ajaxSetup({
  beforeSend: function (req) {
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
  }
})
lock = new Auth0Lock('kVq2br5crIamzToIbqQnGIY6anIO33cY', 'seesharp.auth0.com', {
       auth: {
           params: { scope: 'openid email' } //Details: https:///scopes
       }
   });
 // Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getProfile() and save it to localStorage
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    };
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    loadBandsApp()
  });
});
$(document).ready(function() {
  checkLoggedIn()
  loadNewBand()
  deleteBand()
  $('#login-button').click(function (e) {
    e.preventDefault()
      lock.show()
  });
  $('#logout-button').click(function(e) {
      e.preventDefault()
        logOut()
  });
}); // I am the end of document.ready
function logOut() {
  localStorage.removeItem('id_token')
  showWelcome()
};

function checkLoggedIn() {
  if (isLoggedIn()) {
    loadBandsApp()
  } else {
    showApp()
  };
};
function showWelcome() {
  $('#welcome').show()
  $('#app').hide()
};
function showApp() {
  $('#app').show()
  $('#welcome').hide()
};
function loadBandsApp() {
  console.log('loadBandsApp');

  loadBands()
  // updateTodo()
  showApp()
}
function isLoggedIn() {
  var idToken = localStorage.getItem('id_token')
  if (idToken) {
    return true;
  } else {
    return false;
  }
}
function deleteBand() {
  $(document).on('click', 'a.deleteBand', function (e) {
    e.preventDefault()

    // this is the link that was clicked
    var link = $(this)

    $.ajax({
      url: link.attr('href'),
      method: 'DELETE'
    })
    .done(function () {
      link.parent('li').remove()
    })
  })
}


function loadBands() {
  $.ajax({
      url: 'https://git.heroku.com/bandlistapi.git'
    }).done(function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        loadBand(data[i])

      };
    });
};

function loadBand(band) {
  var li = $('<li></li>');
  li.html(band.name + ' ');
   var a = $('<a>Delete</a>');      
   a.attr('href','https://git.heroku.com/bandlistapi.git' + band._id);     a.addClass('deleteBand');    
   li.append(a);    
   $('#band_list').prepend(li);
};
function loadNewBand() {
  $('#new_band_form').on('submit', function(e) {
    e.preventDefault();
    var bandName = $('#band_name').val()
    var genre = $('#genre').val()
    $.ajax({
      url: 'https://git.heroku.com/bandlistapi.git',
      method: 'POST',
      data: $('#new_band_form').serialize()
    }).done(function(newBand) {
      loadBand(newBand)
      $('.input_body').val('').focus()
      $('#band_name').focus()
    })
  })
};
