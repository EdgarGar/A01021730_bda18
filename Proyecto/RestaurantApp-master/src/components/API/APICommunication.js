

//********************************************** FUNCIONES RAW MATERIALS *******************************************
function getRawMaterials(callback, auth){
  const url = 'http://104.236.192.53/restaurantapi/materias-primas';
  var request = new Request(url, {
      method: 'GET',
      headers: {
        Authorization: "bearer " + auth
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    callback(data.items);
  })
}


function deleteRawMaterial(id, auth){
  const url = 'http://104.236.192.53/restaurantapi/materias-primas/' + id;
  var request = new Request(url, {
      method: 'DELETE',
      headers: {
        Authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGVucnlrIiwiaWQiOjEsImlhdCI6MTUyNTc0NTQ3Mn0.OLbyDrZSMa331KzHFdLh2oT0T8lrNIu66auqHEGCuj4"
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    return 0;
    // callback(data.items);
  })
}

function newRawMaterial(obj, auth, qty, expirationDate){

  const url = 'http://104.236.192.53/restaurantapi/materias-primas';
  var request = new Request(url, {
      method: 'POST',
      headers: {
        Authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGVucnlrIiwiaWQiOjEsImlhdCI6MTUyNTc0NTQ3Mn0.OLbyDrZSMa331KzHFdLh2oT0T8lrNIu66auqHEGCuj4",
        'content-type': 'application/json'
      },
      body: JSON.stringify(obj)
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn("data", data);
    // callback(data.items);
    addRawMaterial(auth, data.item.id, qty, expirationDate);
  })
}

function addRawMaterial(auth, id, qty, expirationDate){
  const url = 'http://104.236.192.53/restaurantapi/materias-primas/hay/'+id;
  const obj = {
    quantity: qty,
    expiration: expirationDate
  };
  var request = new Request(url, {
      method: 'POST',
      headers: {
        Authorization: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGVucnlrIiwiaWQiOjEsImlhdCI6MTUyNTc0NTQ3Mn0.OLbyDrZSMa331KzHFdLh2oT0T8lrNIu66auqHEGCuj4",
        'content-type': 'application/json'
      },
      body: JSON.stringify(obj)
  });
  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn("data", data);
    return 0;
    // callback(data.items);

  })
}

function checkQuantity(id, callback, auth){
  const url = 'http://104.236.192.53/restaurantapi/materias-primas/hay/' + id;
  var request = new Request(url, {
      method: 'GET',
      headers: {
        Authorization: "bearer " + auth
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    callback(data.items);
  })
}


//************************************************************FUNCIONES LOGIN************************************************+++

function logUser(username, password, callback){
  const url = 'http://104.236.192.53/restaurantapi/login';
  const user = {
      username: username,
      password: password
  }
  var request = new Request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user)

  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    callback(data.token)
    // console.warn(data.token);
  })
}

function isLoggedIn(token, action){
  const url = 'http://104.236.192.53/restaurantapi/isLoggedIn';

  var request = new Request(url, {
      method: 'GET',
      headers: {
        Authorization: 'bearer ' +  token,
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn("data",data);
    if(data.success = true){
      action();
    }
    // callback(data.token)
    // console.warn(data.token);
  })

}



function registerUser(username, email, password, callback){
  const url = 'http://104.236.192.53/restaurantapi/register';
  const user = {
      username: username,
      password: password,
      email: email
  }
  var request = new Request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user)

  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    callback(data)
  })
}
 //****************************************************RECETAS*******************************************************+


 function getRecipes(callback, auth){
   const url = 'http://104.236.192.53/restaurantapi/recetas';
   var request = new Request(url, {
       method: 'GET',
       headers: {
         Authorization: "bearer " + auth
       }
   });

   fetch(request)
   .then((resp) => resp.json())
   .then(function(data){
     // console.warn(data);
     callback(data.items);
   })
 }


function newRecipe(name, description, auth, callback, quantityList, idList){
  // console.warn(auth);
  const recipe = {
	   name: name,
	   cost:0,
	   quantity:1,
     description: description
  };
  const url = 'http://104.236.192.53/restaurantapi/recetas/';
  var request = new Request(url, {
      method: 'POST',
      headers: {
        Authorization: "bearer " + auth,
        'content-type': 'application/json'
      },
      body: JSON.stringify(recipe)
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    if(data.success){
      // console.warn(data);
      for(var i = 0; i < quantityList.length; i++){
        addIngredients(quantityList[i], idList[i], data.item.id, auth);
      }
      callback(data);
    }

  })
}


function addIngredients(quantityList, idList, id, auth){
  const url = 'http://104.236.192.53/restaurantapi/recetas/necesita/' + id;
  const ingredient = {
    quantity:quantityList,
    materiaPrimaId:idList
  }
  var request = new Request(url, {
      method: 'POST',
      headers: {
        Authorization: "bearer " + auth,
        'content-type': 'application/json'
      },
      body: JSON.stringify(ingredient)
  });
  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    return true;
  })
}

function deleteRecipe(id, auth){
  const url = 'http://104.236.192.53/restaurantapi/recetas/' + id;
  var request = new Request(url, {
      method: 'DELETE',
      headers: {
        Authorization: "bearer " + auth
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    return 0;
    // callback(data.items);
  })
}

function getIngredients(auth, id, callback){
  const url = 'http://104.236.192.53/restaurantapi/recetas/necesita/' + id;
  var request = new Request(url, {
      method: 'GET',
      headers: {
        Authorization: "bearer " + auth
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data.items[0].necesita);
    callback(data.items[0].necesita);
  })
}


//*********************************** PLATILLOS *********************************************************


function getDishes(callback, auth){
  const url = 'http://104.236.192.53/restaurantapi/users/elabora';
  var request = new Request(url, {
      method: 'GET',
      headers: {
        Authorization: "bearer " + auth
      }
  });
  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn("data");
    callback(data.items);
  })
}



function newDish(recipe, auth, description, callback){
  const url = 'http://104.236.192.53/restaurantapi/users/elabora/' + recipe.id;
  const obj = {
    quantity: 1,
    specifications: description
  }
  var request = new Request(url, {
      method: 'POST',
      headers: {
        Authorization: "bearer " + auth,
        'content-type': 'application/json'
      },
      body: JSON.stringify(obj)
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    callback(data);

  })
}


function deleteDish(id, auth, callback){
  const url = 'http://104.236.192.53/restaurantapi/users/elabora/' + id;
  var request = new Request(url, {
      method: 'DELETE',
      headers: {
        Authorization: "bearer " + auth
      }
  });

  fetch(request)
  .then((resp) => resp.json())
  .then(function(data){
    // console.warn(data);
    callback(data);
    // callback(data.items);
  })
}



export{getRawMaterials, deleteRawMaterial, newRawMaterial, addRawMaterial, logUser, isLoggedIn, registerUser, getRecipes, newRecipe, deleteRecipe, getIngredients, getDishes, newDish, deleteDish}
