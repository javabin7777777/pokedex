var limit=10; // a quantidade de pokemons que é buscada na pokeapi.co a cada consulta.
var offset=0; // o início da busca - não incluso .
const maxGeneration=27; //quantidade máxima de pokemons .
var arrayHtml=[];
const pokeApi={};
pokeApi.getPokemonsDetails = pokemon => fetch(pokemon)
										.then(response => response.json()) // transforma os dados recebidos para formato Json .
										.then(obj => constructor(obj));
		// a função constructor filtra os dados recebidos,após a busca com a url do pokemon .

pokeApi.getPokemons = (limit=10,offset=0) => {	
	const url=`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
	return 	 fetch(url)
			.then(response => response.json()) // response.json() é passado para jsonBody 		
			.then(jsonBody => jsonBody.results)	// obtém somente o elemento - results - do array jsonBody(response) .		
			.then(resultUrl=> resultUrl.map(element => element.url))
			.then(pokemonUrl => pokemonUrl.map(element => pokeApi.getPokemonsDetails(element)))			
			.then(detailRequests => Promise.all(detailRequests))			
			.then(values => values)
			//.then(values => console.log(values))			
			
	/*
	   results --> é um array de objetos onde cada elemento contém as chaves - name e url - e
	   seus valores para cada pokemon . 
	   results é passado para resultsUrl .
	   o método map de posse do array resultUrl,cria um novo array com somente url's dos pokemons .
	   o método - map - de posse do array de url's,pokemonUrl,cria novo array com os resultados 
	   do método pokeApi.getPokemonsDetails,que buscas das características dos pokemons através das url's. 
	   values --> é um array onde cada elemento contém os valores recebidos da busca realizada
	   			  com as url's dos pokemons,ou seja,das buscas feitas pelo método
	   			  pokeApi.getPokemonsDetails a pokeApi.co para cada pokemon.			
	   	  	
	*/

}

class Pokemon {
	id;
	name;
	typePokemon;// tipo principal	
	types=[];
	img;
}

function pagination(){
	offset=offset+limit; // desloca o valor de offset
	//limita a paginação para quantidade máxima de pokemons e 
	// estiliza o botão Loadmore quando atingir a quantidade máxima de pokemons .
	if( (maxGeneration - offset) < limit ){ 
		limit = maxGeneration - offset;
		$('#loadMore').attr('disabled',true);
		$('#loadMore').text(`Already reached the maximum (${maxGeneration})`);
		$('#loadMore').css('background-color','#ffa7b7');
		$('#loadMore').css('color','black');
		$('#loadMore').css('text-transform','capitalize');	;
		$('body').css('background-color','#ff0000');
	}
	pokeApi.getPokemons(limit,offset).then((pokemons = []) => {
	console.log(pokemons);
	const array= pokemons.map(element => convertPokemonToHtml(element)).join('');
	// cada elemento do array conterá o valor retornado pela função convertPokemonToHtml,depois estes 
	// elementos são juntados pela função join .
	//console.log(array);
	arrayHtml=arrayHtml.concat(array); // para paginação da página,concatena conteúdo .
	console.log(arrayHtml);
	$('#poke').html(arrayHtml);
	});	
}
// a função constructor filtra os dados recebidos,após a busca com a url do pokemon .
function constructor(obj){
 const poke = new Pokemon(); // instanciando um objeto da classe Pokemon
 poke.id = obj.id;
 poke.name = obj.name;
 const array = obj.types.map(y => y.type.name);
 poke.types = array;
 poke.typePokemon = poke.types[0]; // o tipo é o primeiro ítem do array types .
 poke.img = obj.sprites.other.dream_world.front_default;
 return poke
}

//converte cada elemento do array de objetos em html .
function convertPokemonToHtml(element){ 
	return `<li class="pokemon ${element.typePokemon}">
				<span class="number">${element.id}</span>
				<span class="name">${element.name}</span>
				<div class="detail">
					<ol class="types">
						${element.types.map((array) =>`<li class="type ${array}">${array}</li>`).join('')}					
					</ol>
					<img src="${element.img}" alt="${element.name}">
				</div>
			</li> `
}

// executado no carregamento da página ou atualização da mesma .
pokeApi.getPokemons().then((pokemons = []) => {	
	const array= pokemons.map(element => convertPokemonToHtml(element)).join('');
	// cada elemento do array conterá o valor retornado pela função convertPokemonToHtml,depois estes 
	// elementos são juntados pela função join .	
	arrayHtml=arrayHtml.concat(array); // para paginação da página,concatena conteúdo .
	//console.log(arrayHtml);
	$('#poke').html(arrayHtml);
});
$('#loadMore').click(pagination);
$('#reset').click(() => window.location.reload());